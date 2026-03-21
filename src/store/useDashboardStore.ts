import { create } from 'zustand';

export interface AnalysisCamera {
  id: string;
  url: string;
}

interface CameraState {
  isGlobalPaused: boolean;
  masterSeekTime: number;
  lastActionTime: number;
  layoutGrid: 2 | 3 | 4;
  activeAnalysisCamera: AnalysisCamera | null; 
  
  // NEW: History Mode State
  isHistoryMode: boolean;
  historyDate: Date; // The specific day we are reviewing
  
  setGlobalPaused: (paused: boolean) => void;
  syncAllToTime: (time: number) => void;
  setLayout: (cols: 2 | 3 | 4) => void;
  getExpectedTime: () => number;
  setAnalysisCamera: (camera: AnalysisCamera | null) => void; 
  
  // NEW: History Mode Actions
  toggleHistoryMode: () => void;
  setHistoryDate: (date: Date) => void;
}

export const useDashboardStore = create<CameraState>((set, get) => ({
  isGlobalPaused: true,
  masterSeekTime: 0,
  lastActionTime: Date.now(),
  layoutGrid: 2,
  activeAnalysisCamera: null,
  
  // NEW: Initialize History Mode
  isHistoryMode: false,
  historyDate: new Date(), 
  
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
  
  // NEW: Toggle actions
  toggleHistoryMode: () => set((state) => ({ isHistoryMode: !state.isHistoryMode })),
  setHistoryDate: (date) => set({ historyDate: date })
}));