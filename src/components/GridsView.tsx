import { useState } from 'react';
import { Plus, Trash2, Grid3X3, Play, X, Check } from 'lucide-react';
import { useDashboardStore, ALL_CAMERAS } from '../store/useDashboardStore';
import type { SavedGrid } from '../store/useDashboardStore';
import { VideoFeed } from './VideoFeed';

export default function GridsView() {
  const { savedGrids, createGrid, deleteGrid, activeGridId, setActiveGrid, setLayout } = useDashboardStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGridName, setNewGridName] = useState('');
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<1 | 2 | 3 | 4>(2);

  const handleCreateGrid = () => {
    if (newGridName.trim() && selectedCameras.length > 0) {
      createGrid(newGridName.trim(), selectedCameras, selectedLayout);
      setNewGridName('');
      setSelectedCameras([]);
      setSelectedLayout(2);
      setIsCreateModalOpen(false);
    }
  };

  const handleSelectGrid = (grid: SavedGrid) => {
    setActiveGrid(grid.id);
    setLayout(grid.layout);
  };

  const toggleCameraSelection = (cameraId: string) => {
    setSelectedCameras(prev =>
      prev.includes(cameraId)
        ? prev.filter(id => id !== cameraId)
        : [...prev, cameraId]
    );
  };

  const activeGrid = savedGrids.find(g => g.id === activeGridId);
  const gridCameras = activeGrid
    ? ALL_CAMERAS.filter(c => activeGrid.cameraIds.includes(c.id))
    : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Saved Grids</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Grid
          </button>
        </div>
      </div>

      {activeGrid ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3X3 size={18} className="text-orange-500" />
              <span className="font-medium text-slate-900 dark:text-slate-100">{activeGrid.name}</span>
              <span className="text-slate-500 text-sm">({activeGrid.cameraIds.length} cameras)</span>
            </div>
            <button
              onClick={() => setActiveGrid(null)}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${activeGrid.layout}, 1fr)` }}
            >
              {gridCameras.map((camera) => (
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
      ) : (
        <div className="flex-1 p-4 overflow-auto">
          {savedGrids.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
              <Grid3X3 size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No saved grids</p>
              <p className="text-sm">Create a grid to organize your cameras</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedGrids.map((grid) => (
                <div
                  key={grid.id}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-orange-500 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">{grid.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGrid(grid.id);
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      {grid.cameraIds.length} cameras • {grid.layout}x{grid.layout} layout
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {grid.cameraIds.slice(0, 3).map(camId => {
                        const cam = ALL_CAMERAS.find(c => c.id === camId);
                        return cam ? (
                          <span
                            key={camId}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded"
                          >
                            {cam.name}
                          </span>
                        ) : null;
                      })}
                      {grid.cameraIds.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded">
                          +{grid.cameraIds.length - 3} more
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleSelectGrid(grid)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Play size={14} />
                      Open Grid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create New Grid</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[60vh]">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Grid Name
                </label>
                <input
                  type="text"
                  value={newGridName}
                  onChange={(e) => setNewGridName(e.target.value)}
                  placeholder="Enter grid name..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Layout
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3, 4] as const).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => setSelectedLayout(layout)}
                      className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                        selectedLayout === layout
                          ? 'bg-orange-600 border-orange-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-orange-500'
                      }`}
                    >
                      {layout}x{layout}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Cameras ({selectedCameras.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_CAMERAS.map((camera) => (
                    <button
                      key={camera.id}
                      onClick={() => toggleCameraSelection(camera.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                        selectedCameras.includes(camera.id)
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-300'
                          : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-orange-500'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{camera.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{camera.location}</div>
                      </div>
                      {selectedCameras.includes(camera.id) && (
                        <Check size={18} className="text-orange-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGrid}
                disabled={!newGridName.trim() || selectedCameras.length === 0}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Create Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
