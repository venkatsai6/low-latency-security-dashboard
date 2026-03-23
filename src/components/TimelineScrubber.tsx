import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDashboardStore } from '../store/useDashboardStore';

export const TimelineScrubber: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const masterSeekTime = useDashboardStore((state) => state.masterSeekTime);
  const syncAllToTime = useDashboardStore((state) => state.syncAllToTime);
  
  const [isDragging, setIsDragging] = useState(false);
  
  const pixelsPerSecond = 5;

  const drawTimeline = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;

    ctx.fillStyle = '#a3a3a3'; // Neutral-400
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    const visibleSeconds = rect.width / pixelsPerSecond;
    const startSecond = masterSeekTime - (visibleSeconds / 2);
    const endSecond = masterSeekTime + (visibleSeconds / 2);

    for (let i = Math.floor(startSecond); i <= Math.ceil(endSecond); i++) {
      if (i % 10 === 0) {
        const xPos = centerX + ((i - masterSeekTime) * pixelsPerSecond);

        const isMinute = i % 60 === 0;
        const tickHeight = isMinute ? 20 : 10;
        
        ctx.fillStyle = isMinute ? '#ffffff' : '#525252';
        ctx.fillRect(xPos - 1, rect.height - tickHeight, 2, tickHeight);

        if (isMinute) {
          const minutes = Math.floor((Math.abs(i) % 3600) / 60);
          const seconds = Math.abs(i) % 60;
          const timeLabel = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          ctx.fillText(timeLabel, xPos, rect.height - 25);
        }
      }
    }

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(centerX - 1, 0, 2, rect.height);

  }, [masterSeekTime, pixelsPerSecond]);

  useEffect(() => {
    drawTimeline();
    window.addEventListener('resize', drawTimeline);
    return () => window.removeEventListener('resize', drawTimeline);
  }, [drawTimeline]);

  const handlePointerDown = () => setIsDragging(true);

  const handlePointerUp = () => setIsDragging(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const movementX = e.movementX;
    const timeChange = -(movementX / pixelsPerSecond);

    const newTime = Math.max(0, masterSeekTime + timeChange);
    syncAllToTime(newTime);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-24 bg-neutral-950 border-t border-neutral-800 relative cursor-ew-resize select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Subtle gradient edges to fade out the timeline */}
      <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />
    </div>
  );
};