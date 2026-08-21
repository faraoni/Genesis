import React, { useState } from 'react';
import { EmbryoStage } from '../types';
import { Radio, Activity, Ruler, Heart, Shield, Waves, FileText } from 'lucide-react';

interface Props {
  currentStage: EmbryoStage;
}

export const UltrasoundViewPanel: React.FC<Props> = ({ currentStage }) => {
  const [gain, setGain] = useState<number>(75);
  const [activeMeasurement, setActiveMeasurement] = useState<'CRL' | 'BPD' | 'NT' | 'FHR'>('CRL');

  const { ultrasoundFeatures } = currentStage;

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Clinical Ultrasound & Fetal Biometry (Week {currentStage.week})
            </h3>
            <p className="text-xs text-slate-400">
              Acoustic sonography features, biometric caliper benchmarks, and spectral Doppler analysis
            </p>
          </div>
        </div>

        {/* Ultrasound Gain Slider */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <span className="text-[11px] font-mono text-emerald-400 font-bold">Acoustic Gain: {gain}%</span>
          <input
            id="slider_acoustic_gain"
            type="range"
            min="20"
            max="100"
            value={gain}
            onChange={(e) => setGain(parseInt(e.target.value))}
            className="w-20 accent-emerald-500 cursor-pointer h-1.5 bg-slate-850 rounded"
          />
        </div>
      </div>

      {/* Main Sonographic Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Caliper Biometric Benchmarks */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5" />
            Standard Biometric Calipers:
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-850">
              <span className="text-slate-400 font-mono">Crown-Rump Length (CRL)</span>
              <span className="font-bold text-emerald-400 font-mono">{currentStage.crlMm} mm</span>
            </div>

            {ultrasoundFeatures.bpdMm && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-850">
                <span className="text-slate-400 font-mono">Biparietal Diameter (BPD)</span>
                <span className="font-bold text-emerald-400 font-mono">{ultrasoundFeatures.bpdMm} mm</span>
              </div>
            )}

            {ultrasoundFeatures.gestationalSacMm && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-850">
                <span className="text-slate-400 font-mono">Gestational Sac (GS)</span>
                <span className="font-bold text-emerald-400 font-mono">{ultrasoundFeatures.gestationalSacMm} mm</span>
              </div>
            )}

            {currentStage.heartRateBpm && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-850">
                <span className="text-slate-400 font-mono flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                  Fetal Heart Rate (FHR)
                </span>
                <span className="font-bold text-red-400 font-mono">{currentStage.heartRateBpm} BPM</span>
              </div>
            )}
          </div>
        </div>

        {/* Sonographic Visible Structures */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Echogenic Anatomical Structures:
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {ultrasoundFeatures.visibleStructures.map((struct, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span className="leading-snug">{struct}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Spectral Doppler & Hemodynamics */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" />
              Doppler Hemodynamics:
            </span>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {ultrasoundFeatures.dopplerNotes}
            </p>
          </div>

          {/* Animated Doppler Waveform Simulation */}
          <div className="h-16 bg-slate-900 rounded-lg border border-slate-850 p-2 relative overflow-hidden flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
            <svg className="w-full h-full text-emerald-400" viewBox="0 0 200 40">
              <path
                d="M 0 35 Q 20 5, 35 15 T 70 35 T 100 5 T 135 15 T 170 35 T 200 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute top-1 right-2 text-[9px] font-mono text-emerald-500">
              Pulsatility Index: 0.95
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
