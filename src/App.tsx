import React, { useEffect, useState } from 'react';
import { Play, Pause, Grid2x2, Grid3x3, History, Video, LayoutGrid, Square, Maximize2 } from 'lucide-react';
import { useDashboardStore, ALL_CAMERAS } from './store/useDashboardStore';
import { VideoFeed } from './components/VideoFeed';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { TimelineScrubber } from './components/TimelineScrubber';
import { Sidebar } from './components/Sidebar';
import GridsView from './components/GridsView';
import FavoritesView from './components/FavoritesView';
import SitesView from './components/SitesView';
import SettingsView from './components/SettingsView';

function App() {
  const {
    isGlobalPaused,
    masterSeekTime,
    layoutGrid,
    setGlobalPaused,
    syncAllToTime,
    setLayout,
    isDarkMode,
    isSidebarCollapsed,
    toggleSidebar,
    activeSection
  } = useDashboardStore();

  const isHistoryMode = useDashboardStore((state) => state.isHistoryMode);
  const toggleHistoryMode = useDashboardStore((state) => state.toggleHistoryMode);

  const [sliderValue, setSliderValue] = useState(0);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setSliderValue(time);
    syncAllToTime(time);
  };

  useEffect(() => {
    setSliderValue(masterSeekTime);
  }, [masterSeekTime]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const gridOptions = [
    { value: 1, icon: <Square size={18} />, label: '1x1' },
    { value: 2, icon: <Grid2x2 size={18} />, label: '2x2' },
    { value: 3, icon: <Grid3x3 size={18} />, label: '3x3' },
    { value: 4, icon: <LayoutGrid size={18} />, label: '4x4' },
  ] as const;

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'cameras': return 'All Cameras';
      case 'grids': return 'Saved Grids';
      case 'favorites': return 'Favorites';
      case 'sites': return 'Sites';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const showCameraControls = activeSection === 'cameras' || activeSection === 'favorites';

  const renderMainContent = () => {
    switch (activeSection) {
      case 'grids':
        return <GridsView />;
      case 'favorites':
        return <FavoritesView />;
      case 'sites':
        return <SitesView />;
      case 'settings':
        return <SettingsView />;
      case 'cameras':
      default:
        return (
          <div className="p-4 overflow-auto h-full">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${layoutGrid}, minmax(0, 1fr))`
              }}
            >
              {ALL_CAMERAS.slice(0, layoutGrid * layoutGrid).map((cam) => (
                <VideoFeed key={cam.id} id={cam.id} url={cam.url} label={cam.name} location={cam.location} />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-white dark:bg-neutral-950">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 overflow-hidden">
        <header className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center bg-white dark:bg-neutral-950">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">{getSectionTitle()}</h1>
              {activeSection === 'cameras' && (
                <p className="text-xs text-gray-600 dark:text-gray-300">All Cameras • {ALL_CAMERAS.length} devices</p>
              )}
            </div>
            {showCameraControls && (
              <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wider ${isHistoryMode ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                {isHistoryMode ? 'PLAYBACK' : 'LIVE'}
              </span>
            )}
          </div>

          {showCameraControls && (
            <div className="flex items-center gap-3">
              <button
                onClick={toggleHistoryMode}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  isHistoryMode
                    ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                    : 'border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700'
                }`}
              >
                {isHistoryMode ? <Video size={16} /> : <History size={16} />}
                {isHistoryMode ? 'Return to Live' : 'History'}
              </button>

              <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-lg p-1 border border-gray-200 dark:border-neutral-700">
                {gridOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLayout(option.value)}
                    className={`p-2 rounded-md transition-colors ${
                      layoutGrid === option.value
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={`${option.label} Grid`}
                  >
                    {option.icon}
                  </button>
                ))}
              </div>

              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors" title="Fullscreen">
                <Maximize2 size={18} />
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-hidden bg-gray-100 dark:bg-neutral-900">
          {renderMainContent()}
        </main>

        {showCameraControls && (
          <footer className="border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-950">
            {isHistoryMode ? (
              <TimelineScrubber />
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => setGlobalPaused(!isGlobalPaused)}
                    className="w-12 h-12 flex shrink-0 items-center justify-center bg-blue-600 dark:bg-white text-white dark:text-black rounded-full hover:bg-blue-700 dark:hover:bg-gray-200 transition-transform active:scale-95"
                  >
                    {isGlobalPaused ? <Play fill="currentColor" size={20} className="ml-0.5" /> : <Pause fill="currentColor" size={20} />}
                  </button>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 font-mono">
                      <span>SYNC TIMELINE</span>
                      <span className="text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-neutral-700 px-2 py-0.5 rounded text-[10px]">
                        T-{sliderValue.toFixed(1)}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="0.1"
                      value={sliderValue}
                      onChange={handleSeekChange}
                      className="w-full h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </footer>
        )}
      </div>

      <AiAnalysisModal />
    </div>
  );
}

export default App;