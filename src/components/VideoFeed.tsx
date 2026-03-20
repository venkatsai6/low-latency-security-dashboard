import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2 } from 'lucide-react'; // Import a spinner icon
import { useDashboardStore } from '../store/useDashboardStore';

interface Props {
  url: string;
  label: string;
}

export const VideoFeed: React.FC<Props> = ({ url, label }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  // Local state to track buffering
  const [isBuffering, setIsBuffering] = useState(true); 
  
  const isGlobalPaused = useDashboardStore((state) => state.isGlobalPaused);
  const masterSeekTime = useDashboardStore((state) => state.masterSeekTime);

  useEffect(() => {
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 10,
        maxMaxBufferLength: 15,
        backBufferLength: 30,
      });
      
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = url;
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [url]);

  // Handle Play/Pause Promises safely
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isGlobalPaused) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.debug("Playback interrupted:", error);
        });
      }
    }
  }, [isGlobalPaused]);

  // Sync Video Time
  useEffect(() => {
    if (!videoRef.current) return;
    const drift = Math.abs(videoRef.current.currentTime - masterSeekTime);
    if (drift > 0.3) {
      videoRef.current.currentTime = masterSeekTime;
    }
  }, [masterSeekTime]);

  // Buffer Event Listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Native DOM events for media loading states
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <div className="relative aspect-video bg-neutral-900 border border-neutral-800 group overflow-hidden rounded-lg">
      <video 
        ref={videoRef} 
        className="w-full h-full object-cover pointer-events-none" 
        muted 
        playsInline
      />
      
      {/* Top Gradient Label */}
      <div className="absolute top-0 left-0 p-2 w-full bg-linear-to-b from-black/70 to-transparent z-10">
        <span className="text-xs font-mono text-white flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isBuffering ? 'bg-yellow-500' : 'bg-red-600 animate-pulse'}`} />
          {label} {isBuffering ? '• BUFFERING' : '• LIVE'}
        </span>
      </div>

      {/* Centered Loading Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-0">
          <Loader2 className="w-8 h-8 text-white animate-spin opacity-80" />
        </div>
      )}
    </div>
  );
};