import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EmbryoStage } from '../types';
import { ALL_23_CARNEGIE_STAGES, CarnegieStageInfo } from '../data/carnegie23StagesData';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Compass, 
  Layers, 
  Activity, 
  Heart, 
  Calendar, 
  Maximize2, 
  Minimize2, 
  X, 
  CheckCircle2, 
  Info,
  Clock,
  Gauge,
  Sliders,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap
} from 'lucide-react';

interface Props {
  currentStage: EmbryoStage;
  onSelectStage: (stage: EmbryoStage) => void;
  isOpen: boolean;
  onClose: () => void;
  isAutoOrbit?: boolean;
  onToggleAutoOrbit?: (active: boolean) => void;
}

const SPEED_PRESETS = [
  { label: '0.25x', ms: 3500, desc: 'Deep Study' },
  { label: '0.5x', ms: 2200, desc: 'Detailed' },
  { label: '1.0x', ms: 1400, desc: 'Standard' },
  { label: '2.0x', ms: 700, desc: 'Fast Morph' },
  { label: '4.0x', ms: 350, desc: 'Cinematic Rapid' },
];

const EPOCH_GROUPS = [
  {
    name: 'Pre-Embryonic',
    range: 'CS 1–5 (Days 1–12)',
    stages: [1, 2, 3, 4, 5],
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300'
  },
  {
    name: 'Gastrulation & Neurula',
    range: 'CS 6–10 (Days 13–23)',
    stages: [6, 7, 8, 9, 10],
    color: 'from-blue-500/20 to-cyan-500/20 border-sky-500/40 text-sky-300'
  },
  {
    name: 'Early Organogenesis',
    range: 'CS 11–15 (Days 24–38)',
    stages: [11, 12, 13, 14, 15],
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300'
  },
  {
    name: 'Mid Organogenesis',
    range: 'CS 16–19 (Days 39–51)',
    stages: [16, 17, 18, 19],
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300'
  },
  {
    name: 'Late Embryonic',
    range: 'CS 20–23 (Days 52–56)',
    stages: [20, 21, 22, 23],
    color: 'from-rose-500/20 to-pink-500/20 border-rose-500/40 text-rose-300'
  }
];

export const CarnegieTimeLapsePlayer: React.FC<Props> = ({
  currentStage,
  onSelectStage,
  isOpen,
  onClose,
  isAutoOrbit = false,
  onToggleAutoOrbit
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1400);
  const [isLooping, setIsLooping] = useState(true);
  const [isReversed, setIsReversed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedEpochIdx, setSelectedEpochIdx] = useState<number | null>(null);

  // Audio Doppler Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextBeatTimeRef = useRef<number>(0);
  const heartbeatTimerRef = useRef<number | null>(null);

  // Match current stage with 23 Carnegie dataset
  const currentCSIndex = ALL_23_CARNEGIE_STAGES.findIndex((cs) => {
    if (currentStage.carnegieStage) {
      return Number(currentStage.carnegieStage) === cs.carnegieNumber;
    }
    return cs.week === currentStage.week;
  });

  const activeIndex = currentCSIndex >= 0 ? currentCSIndex : 0;
  const activeCSInfo = ALL_23_CARNEGIE_STAGES[activeIndex];

  // Helper to step stages
  const stepStage = useCallback((direction: 'next' | 'prev') => {
    let nextIdx: number;
    if (direction === 'next') {
      if (activeIndex >= ALL_23_CARNEGIE_STAGES.length - 1) {
        if (isLooping) nextIdx = 0;
        else {
          setIsPlaying(false);
          return;
        }
      } else {
        nextIdx = activeIndex + 1;
      }
    } else {
      if (activeIndex <= 0) {
        if (isLooping) nextIdx = ALL_23_CARNEGIE_STAGES.length - 1;
        else {
          setIsPlaying(false);
          return;
        }
      } else {
        nextIdx = activeIndex - 1;
      }
    }
    const targetStage = ALL_23_CARNEGIE_STAGES[nextIdx];
    onSelectStage(targetStage);
  }, [activeIndex, isLooping, onSelectStage]);

  // Automated playback interval timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      stepStage(isReversed ? 'prev' : 'next');
    }, speedMs);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, speedMs, isReversed, stepStage]);

  // Keyboard navigation shortcuts when time-lapse is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepStage('next');
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepStage('prev');
      } else if (e.code === 'KeyL') {
        setIsLooping((prev) => !prev);
      } else if (e.code === 'KeyM') {
        setIsMuted((prev) => !prev);
      } else if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, stepStage, onClose]);

  // Synthesized Web Audio Doppler Heartbeat
  const playHeartSound = useCallback((bpm: number) => {
    if (isMuted || !bpm || bpm <= 0) return;

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // "Lub" Sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);

      // "Dub" Sound after 130ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter2 = ctx.createBiquadFilter();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(95, now + 0.13);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.19);

      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(160, now + 0.13);

      gain2.gain.setValueAtTime(0.0001, now + 0.13);
      gain2.gain.linearRampToValueAtTime(0.18, now + 0.145);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.13);
      osc2.stop(now + 0.23);
    } catch {
      // Audio playback suppressed or blocked by browser policy
    }
  }, [isMuted]);

  // Trigger heartbeat audio according to active stage BPM
  useEffect(() => {
    if (!isOpen || isMuted) {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      return;
    }

    const bpm = activeCSInfo?.heartRateBpm || 0;
    if (bpm > 0) {
      playHeartSound(bpm);
      const intervalMs = (60 / bpm) * 1000;
      const timer = window.setInterval(() => {
        playHeartSound(bpm);
      }, intervalMs);
      heartbeatTimerRef.current = timer;
      return () => clearInterval(timer);
    }
  }, [isOpen, isMuted, activeCSInfo?.heartRateBpm, playHeartSound]);

  if (!isOpen) return null;

  const currentPercent = ((activeIndex) / (ALL_23_CARNEGIE_STAGES.length - 1)) * 100;

  return (
    <div 
      id="carnegie_timelapse_overlay"
      className="fixed inset-x-0 bottom-0 z-40 p-3 md:p-5 pointer-events-none transition-all duration-300 ease-out"
    >
      <div 
        className={`pointer-events-auto mx-auto w-full transition-all duration-300 ease-in-out bg-slate-950/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl md:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-white/10 ${
          isExpanded ? 'max-w-5xl' : 'max-w-4xl'
        }`}
      >
        {/* Header Ribbon with Mode Title & Quick Controls */}
        <div className="flex items-center justify-between px-4 py-2.5 md:px-6 md:py-3 border-b border-slate-800/80 bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/30 rounded-t-2xl md:rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-400">
              <Zap className="w-4 h-4 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  Automated Carnegie Time-Lapse
                  <span className="px-1.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-[10px] font-mono text-sky-300">
                    23 Stages (CS 1 – CS 23)
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Visualizing complete 56-day embryonic morphogenesis, organogenesis & anatomical transitions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Camera Auto-Orbit Toggle */}
            {onToggleAutoOrbit && (
              <button
                id="btn_timelapse_orbit"
                onClick={() => onToggleAutoOrbit(!isAutoOrbit)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  isAutoOrbit 
                    ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300 shadow-sm shadow-indigo-950' 
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
                title="Cinematic 3D Camera Orbit during playback"
              >
                <Compass className={`w-3.5 h-3.5 ${isAutoOrbit ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">3D Orbit</span>
              </button>
            )}

            {/* Heartbeat Doppler Audio Toggle */}
            <button
              id="btn_timelapse_audio"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-lg border transition-all ${
                !isMuted 
                  ? 'bg-rose-500/20 border-rose-400/50 text-rose-400 shadow-sm shadow-rose-950' 
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
              title={isMuted ? 'Unmute Doppler Cardiac Pulse Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            </button>

            {/* Expand / Compact Toggle */}
            <button
              id="btn_timelapse_expand"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-all hidden sm:block"
              title={isExpanded ? 'Compact View' : 'Expand Detailed Telemetry'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              id="btn_timelapse_close"
              onClick={() => {
                setIsPlaying(false);
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-500/20 border border-slate-700/80 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-all"
              title="Close Time-Lapse"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Interactive Controls & Telemetry Deck */}
        <div className="p-3 md:p-5 flex flex-col gap-3 md:gap-4">
          {/* Active Stage Live Telemetry Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 md:p-4">
            {/* Stage Badge & Title */}
            <div className="md:col-span-6 flex items-center gap-3">
              <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-sky-500/40 flex flex-col items-center justify-center text-center shadow-lg shadow-sky-950/50">
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase leading-none">STAGE</span>
                <span className="text-base font-extrabold text-white leading-none mt-0.5">{activeCSInfo.carnegieNumber}</span>
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate">
                    {activeCSInfo.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 border border-sky-500/30 text-sky-300">
                    Day {activeCSInfo.dayStart === activeCSInfo.dayEnd ? activeCSInfo.dayStart : `${activeCSInfo.dayStart}–${activeCSInfo.dayEnd}`} (Wk {activeCSInfo.week})
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {activeCSInfo.subtitle}
                </p>
              </div>
            </div>

            {/* Metric Gauges: CRL, Heart Rate, Size Analogy */}
            <div className="md:col-span-6 grid grid-cols-3 gap-2 text-center">
              {/* CRL Gauge */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Gauge className="w-3 h-3 text-sky-400" />
                  <span>CRL Size</span>
                </div>
                <div className="text-xs md:text-sm font-extrabold text-sky-300 mt-0.5">
                  {activeCSInfo.crlMm} <span className="text-[10px] font-normal text-slate-400">mm</span>
                </div>
                <span className="text-[9px] text-slate-400 truncate max-w-full px-1">
                  {activeCSInfo.sizeAnalogy.split('(')[0]}
                </span>
              </div>

              {/* Heart Rate / Cardiac Activity */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Heart className={`w-3 h-3 ${activeCSInfo.heartRateBpm ? 'text-rose-400 animate-pulse' : 'text-slate-600'}`} />
                  <span>Heart Rate</span>
                </div>
                <div className="text-xs md:text-sm font-extrabold text-rose-300 mt-0.5">
                  {activeCSInfo.heartRateBpm ? `${activeCSInfo.heartRateBpm} BPM` : 'Pre-Cardiac'}
                </div>
                <span className="text-[9px] text-slate-400 truncate max-w-full px-1">
                  {activeCSInfo.heartRateBpm ? 'Rhythmic Pulsation' : 'Endocardial tubes'}
                </span>
              </div>

              {/* Active Morphogen / Master Gene */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Key Signals</span>
                </div>
                <div className="text-xs md:text-sm font-bold text-amber-300 truncate max-w-full mt-0.5 px-1">
                  {activeCSInfo.morphogens[0]?.split(' ')[0] || 'BMP/Wnt'}
                </div>
                <span className="text-[9px] text-slate-400 truncate max-w-full px-1">
                  {activeCSInfo.morphogens[1]?.split(' ')[0] || 'Signaling'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Telemetry Dropdown (Expanded Mode) */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-xs animate-in fade-in duration-200">
              <div>
                <span className="font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Key Morphological Milestones (Carnegie Stage {activeCSInfo.carnegieNumber}):
                </span>
                <ul className="space-y-1 text-slate-400">
                  {activeCSInfo.keyEvents.slice(0, 3).map((event, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{event}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Clinical & Teratogenic Correlation:
                </span>
                <p className="text-slate-400 bg-amber-500/5 border border-amber-500/20 rounded-lg p-2">
                  {activeCSInfo.clinicalFocus}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeCSInfo.activeOrganSystems.map((sys, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Carnegie Stages Scrubber Track (23 Stages) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1 text-purple-400">
                <span>CS 1</span>
                <span className="text-slate-600">|</span>
                <span>Day 1</span>
              </span>
              <span className="text-sky-400 font-bold">
                Carnegie Stage {activeCSInfo.carnegieNumber} of 23
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span>CS 23</span>
                <span className="text-slate-600">|</span>
                <span>Day 56 (End of Embryonic)</span>
              </span>
            </div>

            {/* Visual Scrubber Track with 23 Stage Markers */}
            <div className="relative w-full h-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center px-1">
              {/* Background Filled Progress Bar */}
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/30 via-sky-500/30 to-amber-500/30 border-r-2 border-sky-400 transition-all duration-200"
                style={{ width: `${currentPercent}%` }}
              />

              {/* 23 Stage Clickable Marker Ticks */}
              <div className="relative z-10 w-full flex items-center justify-between h-full">
                {ALL_23_CARNEGIE_STAGES.map((stg, idx) => {
                  const isCurrent = idx === activeIndex;
                  const isPast = idx < activeIndex;

                  return (
                    <button
                      key={stg.id}
                      onClick={() => onSelectStage(stg)}
                      className="group relative flex-1 h-full flex flex-col items-center justify-center focus:outline-none transition-all"
                      title={`${stg.title} (Day ${stg.dayStart} • ${stg.crlMm} mm)`}
                    >
                      {/* Interactive Pin / Dot */}
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-150 ${
                          isCurrent 
                            ? 'w-3 h-3 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,1)] ring-2 ring-white scale-125' 
                            : isPast 
                              ? 'bg-sky-500/60 group-hover:bg-sky-400 group-hover:scale-110' 
                              : 'bg-slate-700 group-hover:bg-slate-500'
                        }`}
                      />
                      <span className={`text-[8px] font-mono mt-0.5 transition-colors hidden sm:block ${
                        isCurrent ? 'text-sky-300 font-extrabold' : 'text-slate-500 group-hover:text-slate-300'
                      }`}>
                        {stg.carnegieNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Playback Controls & Speed Preset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
            {/* Primary Transport Controls */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {/* Jump to Beginning */}
              <button
                id="btn_timelapse_start"
                onClick={() => onSelectStage(ALL_23_CARNEGIE_STAGES[0])}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
                title="Restart from CS 1 (Day 1)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Step Previous */}
              <button
                id="btn_timelapse_step_prev"
                onClick={() => stepStage('prev')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
                title="Step Backward 1 Stage (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Main Play / Pause Button */}
              <button
                id="btn_timelapse_play_pause"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-amber-500/30'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white border-sky-400/50 shadow-sky-500/30'
                }`}
                title="Toggle Time-Lapse Playback (Spacebar)"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Time-Lapse</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play 23 Stages</span>
                  </>
                )}
              </button>

              {/* Step Next */}
              <button
                id="btn_timelapse_step_next"
                onClick={() => stepStage('next')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
                title="Step Forward 1 Stage (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Loop Toggle */}
              <button
                id="btn_timelapse_loop"
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 rounded-xl border transition-all ${
                  isLooping 
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 shadow-sm shadow-sky-950' 
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={isLooping ? 'Loop Continuous Playback (Active)' : 'Loop Disabled'}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Selection Presets & Custom Slider */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 hidden sm:inline">
                <Clock className="w-3 h-3 text-sky-400" />
                Speed:
              </span>

              {/* Speed Presets Buttons */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
                {SPEED_PRESETS.map((preset) => {
                  const isSelected = speedMs === preset.ms;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setSpeedMs(preset.ms)}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                        isSelected 
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-950' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                      title={`${preset.desc} (${preset.ms}ms per stage)`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Continuous Speed Slider */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 hidden md:flex">
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="100"
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                  className="w-20 accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  title="Adjust Speed (ms per stage)"
                />
                <span className="text-[10px] font-mono text-slate-400 w-10 text-right">
                  {(speedMs / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
          </div>

          {/* Epoch Quick-Jump Ribbon */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex-shrink-0 mr-1 hidden sm:inline">
              Jump Epoch:
            </span>
            {EPOCH_GROUPS.map((epoch, idx) => {
              const containsActive = epoch.stages.includes(activeCSInfo.carnegieNumber);
              return (
                <button
                  key={epoch.name}
                  onClick={() => {
                    const targetCS = ALL_23_CARNEGIE_STAGES.find((s) => s.carnegieNumber === epoch.stages[0]);
                    if (targetCS) onSelectStage(targetCS);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border whitespace-nowrap ${
                    containsActive 
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-200 font-bold shadow-md shadow-sky-950/50' 
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{epoch.name}</span>
                  <span className="text-[9px] font-mono text-slate-400">({epoch.range.split(' ')[0]} {epoch.range.split(' ')[1]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
