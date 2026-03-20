import { create } from 'zustand';

interface CameraState {
  isGlobalPaused: boolean;
  masterSeekTime: number;
  lastActionTime: number; // NEW: The Date.now() timestamp of the last play/seek
  layoutGrid: 2 | 3 | 4;
  setGlobalPaused: (paused: boolean) => void;
  syncAllToTime: (time: number) => void;
  setLayout: (cols: 2 | 3 | 4) => void;
  getExpectedTime: () => number; // NEW: Helper to calculate the true synced time
}

export const useDashboardStore = create<CameraState>((set, get) => ({
  isGlobalPaused: true,
  masterSeekTime: 0,
  lastActionTime: Date.now(),
  layoutGrid: 2,
  
  setGlobalPaused: (paused) => set((state) => ({ 
    isGlobalPaused: paused,
    // If unpausing, start the clock now. 
    lastActionTime: paused ? state.lastActionTime : Date.now(),
    // If pausing, lock in the exact time it paused at
    masterSeekTime: paused ? get().getExpectedTime() : state.masterSeekTime
  })),
  
  syncAllToTime: (time) => set({ 
    masterSeekTime: time,
    lastActionTime: Date.now() // Reset the clock on a seek
  }),
  
  setLayout: (cols) => set({ layoutGrid: cols }),

  // This calculates where the video SHOULD be right now
  getExpectedTime: () => {
    const state = get();
    if (state.isGlobalPaused) return state.masterSeekTime;
    
    // Elapsed time in seconds since play was pressed
    const elapsedSeconds = (Date.now() - state.lastActionTime) / 1000;
    return state.masterSeekTime + elapsedSeconds;
  }
}));