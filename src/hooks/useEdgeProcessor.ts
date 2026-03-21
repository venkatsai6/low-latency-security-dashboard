import { useEffect, useRef, useState, type RefObject } from 'react';

export const useEdgeProcessor = (
    videoRef: RefObject<HTMLVideoElement | null>,
    canvasRef: RefObject<HTMLCanvasElement | null>,
    isProcessing: boolean
) => {
    const [metrics, setMetrics] = useState({ fps: 0, renderTime: 0 });
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(performance.now());
    const frameCountRef = useRef<number>(0);

    // Simulated AI Bounding Box coordinates (moves side to side)
    const boxX = useRef(0);
    const boxDirection = useRef(1);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !isProcessing) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // The core processing loop tied exactly to the video's frame rate
        const processFrame = (now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) => {
            const startRender = performance.now();

            // 1. Match Canvas size to raw video dimensions
            if (canvas.width !== metadata.width || canvas.height !== metadata.height) {
                canvas.width = metadata.width;
                canvas.height = metadata.height;
            }

            // 2. Draw the raw frame to the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 3. Apply the "Privacy Blur" inside our simulated AI tracking box
            // (In a real Verkada app, these coordinates would come from a WebAssembly ML model)
            const boxSize = canvas.height * 0.4;
            boxX.current += 3 * boxDirection.current;

            if (boxX.current > canvas.width - boxSize || boxX.current < 0) {
                boxDirection.current *= -1; // Reverse direction at the edges
            }

            // 4. Hardware-accelerated CSS filter for the blur
            ctx.save();
            ctx.filter = 'blur(8px)';
            ctx.drawImage(
                canvas,
                boxX.current, canvas.height / 4, boxSize, boxSize, // Source coordinates
                boxX.current, canvas.height / 4, boxSize, boxSize  // Destination coordinates
            );
            ctx.restore();

            // 5. Draw the AI Bounding Box overlay
            ctx.strokeStyle = '#a855f7'; // Purple-500
            ctx.lineWidth = 4;
            ctx.strokeRect(boxX.current, canvas.height / 4, boxSize, boxSize);

            ctx.fillStyle = '#a855f7';
            ctx.font = '16px monospace';
            ctx.fillText(`PERSON_DETECTED: ${(metadata.expectedDisplayTime / 1000).toFixed(2)}s`, boxX.current, canvas.height / 4 - 10);

            // --- Telemetry Calculations (FPS & Render Time) ---
            const endRender = performance.now();
            frameCountRef.current++;

            if (now - lastTimeRef.current >= 1000) {
                setMetrics({
                    fps: frameCountRef.current,
                    renderTime: Number((endRender - startRender).toFixed(2))
                });
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }

            // Request the next frame recursively
            if (isProcessing) {
                requestRef.current = video.requestVideoFrameCallback(processFrame);
            }
        };

        // Start the loop
        requestRef.current = video.requestVideoFrameCallback(processFrame);

        return () => {
            if (requestRef.current) {
                video.cancelVideoFrameCallback(requestRef.current);
            }
        };
    }, [videoRef, canvasRef, isProcessing]);

    return { metrics };
};