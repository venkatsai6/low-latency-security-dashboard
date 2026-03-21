import React, { useEffect, useRef } from 'react';
import { Loader2, EyeOff, Camera, Volume2, VolumeX, SlidersHorizontal, Cpu } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import { useHlsStream } from '../hooks/useHlsStream';
import { useMediaEvents } from '../hooks/useMediaEvents';
import { useVisibility } from '../hooks/useVisibility';
import { useSnapshot } from '../hooks/useSnapshot';
import { useAudioEnhancer } from '../hooks/useAudioEnhancer';

interface Props {
  url: string;
  label: string;
}

export const VideoFeed: React.FC<Props> = ({ url, label }) => {
  // We attach this ref to the wrapper div, not just the video, 
  // so we can detect when the container itself is visible.
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isGlobalPaused = useDashboardStore((state) => state.isGlobalPaused);
  const masterSeekTime = useDashboardStore((state) => state.masterSeekTime);
  // 1. Import getExpectedTime at the top of your component (if you haven't already)
  const getExpectedTime = useDashboardStore((state) => state.getExpectedTime);


  // Hook Executions
  const isVisible = useVisibility(containerRef);
  useHlsStream({ url, videoRef, isVisible });
  const { isBuffering } = useMediaEvents(videoRef);
  // Initialize the Snapshot Hook
  const { takeSnapshot } = useSnapshot(videoRef, label);
  // Initialize the Audio Enhancer Hook
  const { isEnhanced, isMuted, toggleMute, toggleEnhance } = useAudioEnhancer(videoRef);

  // ... [keep the useHlsStream and useMediaEvents hooks as they are] ...
  // 2. Play/Pause & Wake-up Catch-Up Sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVisible) return;

    if (isGlobalPaused) {
      video.pause();
    } else {
      // WAKE UP LOGIC: Jump to the correct live time
      const expectedTime = getExpectedTime();
      if (Math.abs(video.currentTime - expectedTime) > 0.5) {
        video.currentTime = expectedTime;
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { /* safely ignore interruption errors */ });
      }
    }
  }, [isGlobalPaused, isVisible]); // <--- isVisible stays here to trigger the wake-up

  // 3. Manual Scrubbing Sync (THE FIX)
  useEffect(() => {
    // We removed !isVisible here so it can seek even in the background if needed
    if (!videoRef.current) return;

    const drift = Math.abs(videoRef.current.currentTime - masterSeekTime);
    if (drift > 0.5) {
      videoRef.current.currentTime = masterSeekTime;
    }
  }, [masterSeekTime]); // <--- FIX: Removed isVisible. Now it only fires when you drag the slider!
  const setAnalysisCamera = useDashboardStore((state) => state.setAnalysisCamera);
  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-neutral-900 border border-neutral-800 group overflow-hidden rounded-lg"
    >
      <video
        ref={videoRef}
        className={`w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        muted
        playsInline
        crossOrigin="anonymous"
      />

      <div className="absolute top-0 left-0 p-2 w-full bg-linear-to-b from-black/70 to-transparent z-10">
        <span className="text-xs font-mono text-white flex items-center gap-2">
          {isVisible ? (
            <span className={`w-2 h-2 rounded-full ${isBuffering ? 'bg-yellow-500' : 'bg-red-600 animate-pulse'}`} />
          ) : (
            <EyeOff size={12} className="text-neutral-400" />
          )}
          {label} {isVisible ? (isBuffering ? '• BUFFERING' : '• LIVE') : '• STANDBY'}
          {/* Audio Indicator */}
          {/* Updated Status Indicator */}
          {!isMuted && (
            <span className="ml-2 px-1.5 py-0.5 bg-blue-600 rounded text-[10px] font-bold">
              AUDIO ON
            </span>
          )}
        </span>
        {/* The Snapshot Button - Only visible on group hover */}
        {isVisible && !isBuffering && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {/* NEW: Master Volume Button */}
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded transition-colors ${!isMuted ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-neutral-700 text-white'}`}
              title={isMuted ? "Unmute Stream" : "Mute Stream"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* EQ Enhancement Button (Only visible if unmuted) */}
            {!isMuted && (
              <button
                onClick={toggleEnhance}
                className={`p-1.5 rounded transition-colors ${isEnhanced ? 'bg-green-500 text-white' : 'bg-black/50 hover:bg-neutral-700 text-white'}`}
                title="Toggle Voice Enhancement EQ"
              >
                <SlidersHorizontal size={16} />
              </button>
            )}
            {/* NEW: AI Analysis Button */}
            <button
              onClick={() => setAnalysisCamera({ id: label, url: url })}
              className="p-1.5 bg-black/50 hover:bg-purple-600 text-white rounded transition-colors flex items-center gap-1"
              title="Run AI Privacy Blur"
            >
              <Cpu size={16} />
            </button>
            <button
              onClick={takeSnapshot}
              className="p-1.5 bg-black/50 hover:bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Export Snapshot"
            >
              <Camera size={16} />
            </button>
          </div>
        )}
      </div>

      {isBuffering && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-0">
          <Loader2 className="w-8 h-8 text-white animate-spin opacity-80" />
        </div>
      )}
    </div>
  );
};