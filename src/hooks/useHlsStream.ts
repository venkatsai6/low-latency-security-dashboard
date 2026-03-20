import { useEffect, useRef, type MutableRefObject } from 'react';
import Hls from 'hls.js';

interface UseHlsStreamProps {
  url: string;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  isVisible: boolean; // NEW: We now pass visibility state into the hook
}

export const useHlsStream = ({ url, videoRef, isVisible }: UseHlsStreamProps) => {
  // We keep a ref to the HLS instance so we can control it across renders
  const hlsRef = useRef<Hls | null>(null);

  // 1. Initialization Effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 10,
        maxMaxBufferLength: 15,
        backBufferLength: 30,
      });

      hls.loadSource(url);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, videoRef]);

  // 2. Network Management Effect (The Optimization)
  useEffect(() => {
    if (!hlsRef.current) return;

    if (isVisible) {
      // Resume downloading video chunks
      hlsRef.current.startLoad();
    } else {
      // Stop network requests to save bandwidth and CPU
      hlsRef.current.stopLoad();
    }
  }, [isVisible]); 
};