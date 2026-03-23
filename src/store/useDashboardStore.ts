import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Camera {
  id: string;
  name: string;
  url: string;
  siteId: string;
  location: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
}

export interface SavedGrid {
  id: string;
  name: string;
  cameraIds: string[];
  layout: 1 | 2 | 3 | 4;
  createdAt: Date;
}

export interface AnalysisCamera {
  id: string;
  url: string;
}

export type SectionType = 'cameras' | 'grids' | 'favorites' | 'sites' | 'settings';

export const SITES: Site[] = [
  { id: 'site-hq', name: 'Headquarters', address: '123 Main Street, San Francisco, CA' },
  { id: 'site-warehouse', name: 'Warehouse', address: '456 Industrial Blvd, Oakland, CA' },
  { id: 'site-retail', name: 'Retail Store', address: '789 Market St, San Jose, CA' },
];

export const ALL_CAMERAS: Camera[] = [
  { id: 'CAM-FRONT-DOOR', name: 'Front Door', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', siteId: 'site-hq', location: 'Main Entrance' },
  { id: 'CAM-SERVER-ROOM', name: 'Server Room', url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8', siteId: 'site-hq', location: 'IT Department' },
  { id: 'CAM-PARKING', name: 'Parking Lot', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', siteId: 'site-warehouse', location: 'Outdoor' },
  { id: 'CAM-LOBBY', name: 'Main Lobby', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8', siteId: 'site-hq', location: 'Reception' },
  { id: 'CAM-LOADING-DOCK', name: 'Loading Dock', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', siteId: 'site-warehouse', location: 'Shipping Area' },
  { id: 'CAM-RETAIL-ENTRANCE', name: 'Store Entrance', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', siteId: 'site-retail', location: 'Front' },
  { id: 'CAM-RETAIL-FLOOR', name: 'Sales Floor', url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8', siteId: 'site-retail', location: 'Main Area' },
  { id: 'CAM-RETAIL-BACK', name: 'Back Room', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8', siteId: 'site-retail', location: 'Storage' },
];

interface DashboardState {
  isGlobalPaused: boolean;
  masterSeekTime: number;
  lastActionTime: number;
  layoutGrid: 1 | 2 | 3 | 4;
  activeAnalysisCamera: AnalysisCamera | null;
  isHistoryMode: boolean;
  historyDate: Date;
  isDarkMode: boolean;
  activeSection: SectionType;
  isSidebarCollapsed: boolean;
  
  favorites: string[];
  savedGrids: SavedGrid[];
  selectedSiteId: string | null;
  activeGridId: string | null;
  
  settings: {
    autoPlay: boolean;
    lowLatencyMode: boolean;
    showCameraLabels: boolean;
    defaultLayout: 1 | 2 | 3 | 4;
  };

  setGlobalPaused: (paused: boolean) => void;
  syncAllToTime: (time: number) => void;
  setLayout: (cols: 1 | 2 | 3 | 4) => void;
  getExpectedTime: () => number;
  setAnalysisCamera: (camera: AnalysisCamera | null) => void;
  toggleHistoryMode: () => void;
  setHistoryDate: (date: Date) => void;
  toggleDarkMode: () => void;
  setActiveSection: (section: SectionType) => void;
  toggleSidebar: () => void;
  
  toggleFavorite: (cameraId: string) => void;
  isFavorite: (cameraId: string) => boolean;
  
  createGrid: (name: string, cameraIds: string[], layout: 1 | 2 | 3 | 4) => void;
  deleteGrid: (gridId: string) => void;
  setActiveGrid: (gridId: string | null) => void;
  
  setSelectedSite: (siteId: string | null) => void;
  
  updateSettings: (settings: Partial<DashboardState['settings']>) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      isGlobalPaused: true,
      masterSeekTime: 0,
      lastActionTime: Date.now(),
      layoutGrid: 2,
      activeAnalysisCamera: null,
      isHistoryMode: false,
      historyDate: new Date(),
      isDarkMode: true,
      activeSection: 'cameras',
      isSidebarCollapsed: false,
      
      favorites: [],
      savedGrids: [
        { id: 'grid-1', name: 'HQ Overview', cameraIds: ['CAM-FRONT-DOOR', 'CAM-SERVER-ROOM', 'CAM-LOBBY'], layout: 2, createdAt: new Date() },
        { id: 'grid-2', name: 'All Entrances', cameraIds: ['CAM-FRONT-DOOR', 'CAM-RETAIL-ENTRANCE', 'CAM-LOADING-DOCK'], layout: 2, createdAt: new Date() },
      ],
      selectedSiteId: null,
      activeGridId: null,
      
      settings: {
        autoPlay: true,
        lowLatencyMode: true,
        showCameraLabels: true,
        defaultLayout: 2,
      },

      setGlobalPaused: (paused) => set((state) => ({
        isGlobalPaused: paused,
        lastActionTime: paused ? state.lastActionTime : Date.now(),
        masterSeekTime: paused ? get().getExpectedTime() : state.masterSeekTime
      })),

      syncAllToTime: (time) => set({
        masterSeekTime: time,
        lastActionTime: Date.now()
      }),

      setLayout: (cols) => set({ layoutGrid: cols }),

      getExpectedTime: () => {
        const state = get();
        if (state.isGlobalPaused) return state.masterSeekTime;
        const elapsedSeconds = (Date.now() - state.lastActionTime) / 1000;
        return state.masterSeekTime + elapsedSeconds;
      },

      setAnalysisCamera: (camera) => set({ activeAnalysisCamera: camera }),

      toggleHistoryMode: () => set((state) => ({ isHistoryMode: !state.isHistoryMode })),
      setHistoryDate: (date) => set({ historyDate: date }),

      toggleDarkMode: () => {
        const newMode = !get().isDarkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDarkMode: newMode });
      },
      
      setActiveSection: (section) => set({ activeSection: section }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      
      toggleFavorite: (cameraId) => set((state) => ({
        favorites: state.favorites.includes(cameraId)
          ? state.favorites.filter(id => id !== cameraId)
          : [...state.favorites, cameraId]
      })),
      
      isFavorite: (cameraId) => get().favorites.includes(cameraId),
      
      createGrid: (name, cameraIds, layout) => set((state) => ({
        savedGrids: [
          ...state.savedGrids,
          { id: `grid-${Date.now()}`, name, cameraIds, layout, createdAt: new Date() }
        ]
      })),
      
      deleteGrid: (gridId) => set((state) => ({
        savedGrids: state.savedGrids.filter(g => g.id !== gridId),
        activeGridId: state.activeGridId === gridId ? null : state.activeGridId
      })),
      
      setActiveGrid: (gridId) => set({ activeGridId: gridId }),
      
      setSelectedSite: (siteId) => set({ selectedSiteId: siteId }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        savedGrids: state.savedGrids,
        isDarkMode: state.isDarkMode,
        settings: state.settings,
      }),
    }
  )
);