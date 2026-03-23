import { useCallback, type RefObject } from 'react';

export const useSnapshot = (videoRef: RefObject<HTMLVideoElement | null>, label: string) => {

  const takeSnapshot = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('Cannot take snapshot: Video dimensions are not yet available.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${label}-SNAPSHOT-${Date.now()}.jpg`; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }, [videoRef, label]);

  return { takeSnapshot };
};