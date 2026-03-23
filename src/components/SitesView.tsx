import { MapPin, Building2, ChevronRight, X } from 'lucide-react';
import { useDashboardStore, ALL_CAMERAS, SITES } from '../store/useDashboardStore';
import { VideoFeed } from './VideoFeed';

export default function SitesView() {
  const { selectedSiteId, setSelectedSite, layoutGrid } = useDashboardStore();
  
  const selectedSite = SITES.find(s => s.id === selectedSiteId);
  const siteCameras = selectedSiteId
    ? ALL_CAMERAS.filter(c => c.siteId === selectedSiteId)
    : [];

  const getCameraCountForSite = (siteId: string) => {
    return ALL_CAMERAS.filter(c => c.siteId === siteId).length;
  };

  if (selectedSite) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSite(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <X size={18} className="text-slate-500" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-orange-500" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {selectedSite.name}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {selectedSite.address}
                </p>
              </div>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {siteCameras.length} cameras
            </span>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${layoutGrid}, 1fr)` }}
          >
            {siteCameras.map((camera) => (
              <div key={camera.id} className="relative">
                <VideoFeed
                  id={camera.id}
                  url={camera.url}
                  label={camera.name}
                  location={camera.location}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Sites ({SITES.length})
          </h2>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-3">
          {SITES.map((site) => {
            const cameraCount = getCameraCountForSite(site.id);
            return (
              <button
                key={site.id}
                onClick={() => setSelectedSite(site.id)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Building2 size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">{site.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin size={12} />
                      {site.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {cameraCount} camera{cameraCount !== 1 ? 's' : ''}
                  </span>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
