import { Settings, Monitor, Zap, Tag, Grid3X3 } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

export default function SettingsView() {
  const { settings, updateSettings, isDarkMode, toggleDarkMode } = useDashboardStore();

  const settingsSections = [
    {
      title: 'Display',
      items: [
        {
          icon: Monitor,
          label: 'Dark Mode',
          description: 'Use dark theme for the dashboard',
          type: 'toggle' as const,
          value: isDarkMode,
          onChange: toggleDarkMode,
        },
        {
          icon: Tag,
          label: 'Show Camera Labels',
          description: 'Display camera name and location on video feeds',
          type: 'toggle' as const,
          value: settings.showCameraLabels,
          onChange: () => updateSettings({ showCameraLabels: !settings.showCameraLabels }),
        },
      ],
    },
    {
      title: 'Playback',
      items: [
        {
          icon: Zap,
          label: 'Auto Play',
          description: 'Automatically play video when feeds load',
          type: 'toggle' as const,
          value: settings.autoPlay,
          onChange: () => updateSettings({ autoPlay: !settings.autoPlay }),
        },
        {
          icon: Zap,
          label: 'Low Latency Mode',
          description: 'Optimize for minimal video delay (may affect stability)',
          type: 'toggle' as const,
          value: settings.lowLatencyMode,
          onChange: () => updateSettings({ lowLatencyMode: !settings.lowLatencyMode }),
        },
      ],
    },
    {
      title: 'Layout',
      items: [
        {
          icon: Grid3X3,
          label: 'Default Grid Layout',
          description: 'Default layout when opening camera views',
          type: 'select' as const,
          value: settings.defaultLayout,
          options: [
            { value: 1, label: '1x1' },
            { value: 2, label: '2x2' },
            { value: 3, label: '3x3' },
            { value: 4, label: '4x4' },
          ],
          onChange: (value: 1 | 2 | 3 | 4) => updateSettings({ defaultLayout: value }),
        },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-2xl space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">{section.title}</h3>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {section.items.map((item) => (
                  <div key={item.label} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <item.icon size={20} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{item.label}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.description}</div>
                      </div>
                    </div>
                    {item.type === 'toggle' ? (
                      <button
                        onClick={item.onChange}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          item.value ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            item.value ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                    ) : item.type === 'select' ? (
                      <select
                        value={item.value}
                        onChange={(e) => item.onChange(Number(e.target.value) as 1 | 2 | 3 | 4)}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {item.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">About</h3>
            <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <p>Security Dashboard v1.0.0</p>
              <p>Built with React, TypeScript, and Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
