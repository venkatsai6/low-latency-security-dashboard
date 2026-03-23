import { Star } from 'lucide-react';
import { useDashboardStore, ALL_CAMERAS } from '../store/useDashboardStore';
import { VideoFeed } from './VideoFeed';

export default function FavoritesView() {
  const { favorites, layoutGrid } = useDashboardStore();
  
  const favoriteCameras = ALL_CAMERAS.filter(c => favorites.includes(c.id));

  if (favoriteCameras.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-8">
        <Star size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium">No favorite cameras</p>
        <p className="text-sm text-center mt-2">
          Click the star icon on any camera to add it to your favorites
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Star size={20} className="text-yellow-500 fill-yellow-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Favorites ({favoriteCameras.length})
          </h2>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${layoutGrid}, 1fr)` }}
        >
          {favoriteCameras.map((camera) => (
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
