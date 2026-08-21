import React from 'react';
import { HotspotPin } from '../types';
import { X, Sparkles, Dna, ShieldAlert, GitBranch, ArrowRight } from 'lucide-react';

interface Props {
  hotspot: HotspotPin | null;
  onClose: () => void;
  onAskAI: (question: string) => void;
  onOpenGlossary?: (termName: string) => void;
}

export const AnatomyHotspotDetails: React.FC<Props> = ({
  hotspot,
  onClose,
  onAskAI,
  onOpenGlossary
}) => {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-slate-900/98 backdrop-blur-xl border-l border-slate-700 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-slide-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
              {hotspot.germLayer.replace('_', ' ')}
            </span>
            <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              {hotspot.name}
            </h3>
          </div>
          <button
            id="btn_close_hotspot_details"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anatomical Overview */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Embryological Overview:
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            {hotspot.fullDesc}
          </p>
        </div>

        {/* Molecular Signaling Pathway */}
        {hotspot.molecularSignaling && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Dna className="w-3.5 h-3.5" />
              Molecular Signaling & Morphogens:
            </h4>
            <p className="text-xs text-purple-200 leading-relaxed bg-purple-950/30 p-3 rounded-xl border border-purple-500/30 font-mono">
              {hotspot.molecularSignaling}
            </p>
          </div>
        )}

        {/* Clinical Significance */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Clinical Significance & Teratology:
          </h4>
          <p className="text-xs text-rose-200 leading-relaxed bg-rose-950/30 p-3 rounded-xl border border-rose-500/30">
            {hotspot.clinicalSignificance}
          </p>
        </div>

        {/* Adult Organ Fate */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" />
            Adult Organ Derivatives:
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {hotspot.fateAdultOrgans.map((organ, idx) => (
              <span
                key={idx}
                className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] px-2.5 py-1 rounded-lg"
              >
                {organ}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions: Glossary Lookup & Ask AI */}
      <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
        {onOpenGlossary && (
          <button
            id="btn_glossary_lookup_hotspot"
            onClick={() => onOpenGlossary(hotspot.name)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-sky-500/50 text-sky-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Look up "{hotspot.name}" in Glossary</span>
          </button>
        )}

        <button
          id="btn_ask_ai_hotspot"
          onClick={() => onAskAI(`Explain the embryological development, molecular pathways, and clinical anomalies associated with ${hotspot.name}.`)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2"
        >
          <span>Ask AI Embryology Tutor about {hotspot.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
