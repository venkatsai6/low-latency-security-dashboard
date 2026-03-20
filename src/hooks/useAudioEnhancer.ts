import { useEffect, useRef, useState, type RefObject, useCallback } from 'react';

export const useAudioEnhancer = (videoRef: RefObject<HTMLVideoElement | null>) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start fully muted
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const highPassRef = useRef<BiquadFilterNode | null>(null);
  const peakingRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null); // NEW: Our safe volume control
  const isInitialized = useRef(false);

  const initAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video || isInitialized.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const source = ctx.createMediaElementSource(video);

    // Filter 1: High Pass
    const highPass = ctx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.value = 0; 
    highPassRef.current = highPass;

    // Filter 2: Peaking EQ
    const peaking = ctx.createBiquadFilter();
    peaking.type = 'peaking';
    peaking.frequency.value = 2500; 
    peaking.Q.value = 1.5; 
    peaking.gain.value = 0; 
    peakingRef.current = peaking;

    // NEW: Master Gain Node
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; // Initialize at 0 (muted)
    masterGainRef.current = masterGain;

    // Route the audio: Source -> HighPass -> Peaking -> MasterGain -> Speakers
    source.connect(highPass);
    highPass.connect(peaking);
    peaking.connect(masterGain);
    masterGain.connect(ctx.destination);

    isInitialized.current = true;
  }, [videoRef]);

  // NEW: Dedicated Mute/Unmute Function
  const toggleMute = useCallback(() => {
    if (!isInitialized.current) initAudio();
    
    const video = videoRef.current;
    const ctx = audioCtxRef.current;
    const gainNode = masterGainRef.current;
    if (!video || !ctx || !gainNode) return;

    if (ctx.state === 'suspended') ctx.resume();

    // We must unmute the HTML element so the source flows into our graph
    if (video.muted) video.muted = false;

    setIsMuted((prev) => {
      const nextMuted = !prev;
      // Safety: A 50ms fade prevents speaker popping when toggling
      gainNode.gain.setTargetAtTime(nextMuted ? 0 : 1, ctx.currentTime, 0.05);
      return nextMuted;
    });
  }, [initAudio, videoRef]);

  // UPDATED: Now this ONLY handles the EQ curve
  const toggleEnhance = useCallback(() => {
    if (!isInitialized.current) initAudio();
    
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    setIsEnhanced((prev) => {
      const nextState = !prev;
      if (highPassRef.current && peakingRef.current) {
        highPassRef.current.frequency.value = nextState ? 250 : 0;
        peakingRef.current.gain.value = nextState ? 6 : 0;
      }
      return nextState;
    });
  }, [initAudio]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return { isEnhanced, isMuted, toggleMute, toggleEnhance };
};