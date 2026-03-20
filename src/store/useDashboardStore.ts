import { create } from 'zustand';

interface CameraState {
  isGlobalPaused: boolean;
  masterSeekTime: number; // In seconds
  layoutGrid: 2 | 3 | 4; // 2x2, 3x3, etc.
  setGlobalPaused: (paused: boolean) => void;
  syncAllToTime: (time: number) => void;
  setLayout: (cols: 2 | 3 | 4) => void;
}

export const useDashboardStore = create<CameraState>((set) => ({
  isGlobalPaused: true,
  masterSeekTime: 0,
  layoutGrid: 2,
  
  setGlobalPaused: (paused) => set({ isGlobalPaused: paused }),
  
  syncAllToTime: (time) => set({ masterSeekTime: time }),
  
  setLayout: (cols) => set({ layoutGrid: cols }),
}));