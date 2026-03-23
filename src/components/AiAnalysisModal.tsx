import React, { useRef, useState, useEffect } from 'react';
import { X, Cpu, Activity } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import { useHlsStream } from '../hooks/useHlsStream';
import { useEdgeProcessor } from '../hooks/useEdgeProcessor';

export const AiAnalysisModal: React.FC = () => {
    const activeCamera = useDashboardStore((state) => state.activeAnalysisCamera);
    const setAnalysisCamera = useDashboardStore((state) => state.setAnalysisCamera);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useHlsStream({
        url: activeCamera?.url || '',
        videoRef,
        isVisible: true
    });

    const { metrics } = useEdgeProcessor(videoRef, canvasRef, isProcessing);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [activeCamera]);

    if (!activeCamera) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 rounded-lg">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <h2 className="text-slate-900 dark:text-white font-semibold text-lg">Edge AI Processing</h2>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono">SOURCE: {activeCamera.id}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setIsProcessing(false);
                            setAnalysisCamera(null);
                        }}
                        className="text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-neutral-900">

                    <div className="md:col-span-2 aspect-video bg-slate-900 dark:bg-black rounded-lg border border-slate-300 dark:border-neutral-800 flex items-center justify-center relative overflow-hidden">
                        <video
                            ref={videoRef}
                            className="absolute top-0 left-0 w-px h-px opacity-0 pointer-events-none"
                            muted
                            playsInline
                            crossOrigin="anonymous"
                        />
                        <canvas
                            ref={canvasRef}
                            className={`w-full h-full object-contain ${!isProcessing ? 'hidden' : 'block'}`}
                        />
                        {!isProcessing && (
                            <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-neutral-500">
                                <Activity className="animate-pulse" size={32} />
                                <p className="text-sm font-mono tracking-widest">AWAITING PROCESSING ENGINE...</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="bg-slate-100 dark:bg-neutral-950 p-4 rounded-lg border border-slate-200 dark:border-neutral-800">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Processing Telemetry</h3>

                            <div className="space-y-2 text-xs font-mono">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-neutral-400">STATUS:</span>
                                    <span className={isProcessing ? "text-green-600 dark:text-green-500" : "text-yellow-600 dark:text-yellow-500"}>
                                        {isProcessing ? "ACTIVE" : "STANDBY"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-neutral-400">DECODER:</span>
                                    <span className="text-slate-900 dark:text-white">Canvas 2D API</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-neutral-400">FPS:</span>
                                    <span className="text-slate-900 dark:text-white">{isProcessing ? metrics.fps : '--'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-neutral-400">RENDER TIME:</span>
                                    <span className="text-slate-900 dark:text-white">{isProcessing ? `${metrics.renderTime} ms` : '-- ms'}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsProcessing(!isProcessing)}
                            className={`w-full py-2 font-semibold rounded-lg transition-colors text-sm ${isProcessing
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                        >
                            {isProcessing ? 'Halt Processing' : 'Enable Privacy Blur'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};