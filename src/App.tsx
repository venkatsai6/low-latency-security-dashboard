import React, { useEffect, useState } from 'react';
import { Play, Pause, Grid2x2, Grid3x3 } from 'lucide-react';
import { useDashboardStore } from './store/useDashboardStore';
import { VideoFeed } from './components/VideoFeed';

// Mock HLS Streams (Public test streams)
const MOCK_CAMERAS = [
  // Stream 1: Mux
  { id: 'CAM-FRONT-DOOR', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
   // Stream 2: Apple Basic Stream
  { id: 'CAM-SERVER-ROOM', url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8' }, 
  // Stream 3: Akamai
  { id: 'CAM-PARKING', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8' },
    // Stream 4: Unified Streaming
  { id: 'CAM-LOBBY', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
 
];

function App() {
  const { 
    isGlobalPaused, 
    masterSeekTime, 
    layoutGrid, 
    setGlobalPaused, 
    syncAllToTime, 
    setLayout 
  } = useDashboardStore();

  // Local state for the slider to prevent UI lagging while dragging
  const [sliderValue, setSliderValue] = useState(0);

  // Handle the scrubbing of the timeline
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setSliderValue(time);
    syncAllToTime(time); // Fire the update to all connected VideoFeeds
  };

  // Ensure local slider stays in sync if masterSeekTime changes elsewhere
  useEffect(() => {
    setSliderValue(masterSeekTime);
  }, [masterSeekTime]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* --- Top Header --- */}
      <header className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Security Command Center</h1>
          <p className="text-xs text-neutral-400">Low-Latency Synchronized Playback</p>
        </div>
        
        {/* Layout Toggles */}
        <div className="flex gap-2">
          <button 
            onClick={() => setLayout(2)}
            className={`p-2 rounded transition-colors ${layoutGrid === 2 ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
            title="2x2 Grid"
          >
            <Grid2x2 size={20} />
          </button>
          <button 
            onClick={() => setLayout(3)}
            className={`p-2 rounded transition-colors ${layoutGrid === 3 ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
            title="3x3 Grid"
          >
            <Grid3x3 size={20} />
          </button>
        </div>
      </header>

      {/* --- Main Camera Grid --- */}
      <main className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
        <div 
          className="grid gap-4 w-full max-w-7xl mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${layoutGrid}, minmax(0, 1fr))` 
          }}
        >
          {/* Dynamically render cameras based on layout (4 for 2x2, up to 9 for 3x3) */}
          {MOCK_CAMERAS.slice(0, layoutGrid * layoutGrid).map((cam) => (
            <VideoFeed key={cam.id} url={cam.url} label={cam.id} />
          ))}
        </div>
      </main>

      {/* --- Global Transport Controls --- */}
      <footer className="p-6 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-4">
        <div className="flex items-center gap-6 max-w-4xl mx-auto w-full">
          
          {/* Master Play/Pause */}
          <button 
            onClick={() => setGlobalPaused(!isGlobalPaused)}
            className="w-14 h-14 flex flex-shrink-0 items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-transform active:scale-95"
          >
            {isGlobalPaused ? <Play fill="currentColor" size={24} className="ml-1" /> : <Pause fill="currentColor" size={24} />}
          </button>
          
          {/* Master Timeline */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-neutral-400 font-mono">
              <span>SYNC TIMELINE (SECONDS)</span>
              <span className="text-white bg-neutral-800 px-2 py-1 rounded">
                T- {sliderValue.toFixed(1)}s
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="60" // Mocking a 60-second recorded buffer
              step="0.1"
              value={sliderValue}
              onChange={handleSeekChange}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

        </div>
      </footer>

    </div>
  );
}

export default App;