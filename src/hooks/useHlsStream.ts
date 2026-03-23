import { useEffect, useRef, type MutableRefObject } from 'react';
import Hls from 'hls.js';

interface UseHlsStreamProps {
  url: string;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  isVisible: boolean;
}

export const useHlsStream = ({ url, videoRef, isVisible }: UseHlsStreamProps) => {
  const hlsRef = useRef<Hls | null>(null);

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

  useEffect(() => {
    if (!hlsRef.current) return;

    if (isVisible) {
      hlsRef.current.startLoad();
    } else {
      hlsRef.current.stopLoad();
    }
  }, [isVisible]); 
};