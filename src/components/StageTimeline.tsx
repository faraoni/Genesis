import React, { useEffect, useState } from 'react';
import { EmbryoStage } from '../types';
import { Play, Pause, FastForward, ChevronLeft, ChevronRight, Sparkles, Clock, Compass, Zap } from 'lucide-react';

interface Props {
  stages: EmbryoStage[];
  currentStage: EmbryoStage;
  onSelectStage: (stage: EmbryoStage) => void;
  onOpenCarnegieTimeLapse?: () => void;
}

export const StageTimeline: React.FC<Props> = ({
  stages,
  currentStage,
  onSelectStage,
  onOpenCarnegieTimeLapse
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeedMs, setPlaySpeedMs] = useState(2500);

  const currentIndex = stages.findIndex((s) => s.id === currentStage.id);

  // Auto-play developmental sequence
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onSelectStage(stages[(currentIndex + 1) % stages.length]);
      }, playSpeedMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentIndex, stages, onSelectStage, playSpeedMs]);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + stages.length) % stages.length;
    onSelectStage(stages[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % stages.length;
    onSelectStage(stages[nextIdx]);
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-2xl flex flex-col gap-4">
      {/* Header with Timeline Controls & Play/Pause */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Gestational Stage Timeline
              <span className="text-[11px] font-mono font-medium text-slate-400">
                (Week 1 to 38+ / Full Term)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Select or play through developmental epochs to inspect organogenesis, Carnegie stages, and morphogen signaling
            </p>
          </div>
        </div>

        {/* Playback Controls & Speed */}
        <div className="flex items-center gap-2">
          {/* Automated 23 Carnegie Stages Time-Lapse Mode Button */}
          {onOpenCarnegieTimeLapse && (
            <button
              id="btn_timeline_open_carnegie_timelapse"
              onClick={onOpenCarnegieTimeLapse}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 border border-sky-500/50 text-sky-300 font-bold text-xs transition-all shadow-md shadow-sky-950/40"
              title="Open Automated 23 Carnegie Stages Time-Lapse Player with speed control & telemetry"
            >
              <Zap className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>23 Carnegie Stages Time-Lapse</span>
            </button>
          )}

          <button
            id="btn_timeline_prev"
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            title="Previous Milestone"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="btn_timeline_play"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-lg ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/30 font-bold'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold border-sky-400 shadow-sky-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Morph Stages</span>
              </>
            )}
          </button>

          <button
            id="btn_timeline_next"
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            title="Next Milestone"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gestational Phase Track Visualizer */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Pre-Embryonic (W1-2)
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(14,165,233,0.8)]" />
            Embryonic Period (W3-8)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Fetal Period (W9-38+)
          </span>
        </div>

        {/* Visual Progress Bar Track */}
        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(14,165,233,0.6)]"
            style={{ width: `${Math.min(100, Math.max(5, ((currentIndex + 1) / stages.length) * 100))}%` }}
          />
        </div>
      </div>

      {/* Horizontal Scroller Ribbon of Developmental Stages */}
      <div className="relative">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
          {stages.map((stage) => {
            const isSelected = stage.id === currentStage.id;
            return (
              <button
                key={stage.id}
                id={`btn_stage_card_${stage.id}`}
                onClick={() => onSelectStage(stage)}
                className={`flex-shrink-0 w-40 sm:w-48 p-3 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-sky-500 ring-2 ring-sky-500/30 shadow-lg shadow-sky-950/80 text-white'
                    : 'bg-slate-950/60 hover:bg-slate-800/70 border-slate-800 text-slate-400'
                }`}
              >
                {/* Trimester Badge */}
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    stage.trimester === 'Pre-Embryonic' ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30' :
                    stage.trimester === 'Embryonic' ? 'bg-sky-950 text-sky-300 border border-sky-500/30' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    Week {stage.week}
                  </span>

                  {stage.carnegieStage && (
                    <span className="text-[10px] text-slate-400 font-mono font-bold">
                      CS {stage.carnegieStage}
                    </span>
                  )}
                </div>

                <h4 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {stage.title}
                </h4>

                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {stage.sizeAnalogy}
                </p>

                {isSelected && (
                  <div className="w-full h-0.5 bg-sky-400 rounded-full mt-2.5 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Stage Milestones & Morphogens Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/90 border border-slate-800 p-4 rounded-xl text-xs">
        {/* Key Morphogenetic Events with Connected Timeline Nodes */}
        <div className="md:col-span-2 space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Key Morphogenetic Milestones (Week {currentStage.week} • {currentStage.title})
          </span>
          <div className="space-y-2 relative pl-4 border-l border-sky-500/30 ml-2">
            {currentStage.keyEvents.map((evt, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.8)]" />
                <p className="text-slate-300 leading-relaxed font-medium">{evt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Master Morphogens & Clinical Highlight */}
        <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Master Signaling Gradients:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentStage.morphogens.map((m, i) => (
                <span 
                  key={i}
                  className="bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Monograph Callout Box */}
          <div className="bg-sky-950/20 border border-sky-900/40 rounded-xl p-3">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
              Developmental Note
            </span>
            <p className="text-[11px] text-slate-300 italic leading-snug">
              Critical period for {currentStage.keyEvents[0]?.toLowerCase() || 'tissue differentiation'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
