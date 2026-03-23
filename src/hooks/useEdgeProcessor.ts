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

    const boxX = useRef(0);
    const boxDirection = useRef(1);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !isProcessing) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const processFrame = (now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) => {
            const startRender = performance.now();

            if (canvas.width !== metadata.width || canvas.height !== metadata.height) {
                canvas.width = metadata.width;
                canvas.height = metadata.height;
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const boxSize = canvas.height * 0.4;
            boxX.current += 3 * boxDirection.current;

            if (boxX.current > canvas.width - boxSize || boxX.current < 0) {
                boxDirection.current *= -1;
            }

            ctx.save();
            ctx.filter = 'blur(8px)';
            ctx.drawImage(
                canvas,
                boxX.current, canvas.height / 4, boxSize, boxSize,
                boxX.current, canvas.height / 4, boxSize, boxSize
            );
            ctx.restore();

            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 4;
            ctx.strokeRect(boxX.current, canvas.height / 4, boxSize, boxSize);

            ctx.fillStyle = '#a855f7';
            ctx.font = '16px monospace';
            ctx.fillText(`PERSON_DETECTED: ${(metadata.expectedDisplayTime / 1000).toFixed(2)}s`, boxX.current, canvas.height / 4 - 10);

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

            if (isProcessing) {
                requestRef.current = video.requestVideoFrameCallback(processFrame);
            }
        };

        requestRef.current = video.requestVideoFrameCallback(processFrame);

        return () => {
            if (requestRef.current) {
                video.cancelVideoFrameCallback(requestRef.current);
            }
        };
    }, [videoRef, canvasRef, isProcessing]);

    return { metrics };
};