import React, { useState } from 'react';
import { GERM_LAYER_NODES } from '../data/germLayersData';
import { GermLayerNode } from '../types';
import { GitFork, Layers, AlertCircle, Dna, ShieldAlert, Sparkles } from 'lucide-react';

export const GermLayerFateMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GermLayerNode>(GERM_LAYER_NODES[0]);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Germ Layer Fate Mapping & Embryonic Lineage
            </h3>
            <p className="text-xs text-slate-400">
              Trace adult organ derivation from Ectoderm, Mesoderm, Endoderm, and Neural Crest
            </p>
          </div>
        </div>
      </div>

      {/* Layer Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {GERM_LAYER_NODES.map((node) => {
          const isSelected = node.id === selectedNode.id;
          return (
            <button
              key={node.id}
              id={`btn_layer_${node.id}`}
              onClick={() => setSelectedNode(node)}
              className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-sky-400 ring-1 ring-sky-400/40 shadow-lg'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: node.color }} 
                />
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-300">
                  {node.layer.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{node.name}</h4>
            </button>
          );
        })}
      </div>

      {/* Selected Germ Layer Deep Dive Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 lg:p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: selectedNode.color }} 
              />
              <h4 className="text-base font-bold text-white">{selectedNode.name}</h4>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          {/* Key Induction Genes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-mono uppercase flex items-center gap-1">
              <Dna className="w-3 h-3 text-purple-400" />
              Master Regulators:
            </span>
            {selectedNode.keyGenes.map((gene, idx) => (
              <span 
                key={idx}
                className="bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded-md"
              >
                {gene}
              </span>
            ))}
          </div>
        </div>

        {/* Adult Derivatives Grid */}
        <div>
          <h5 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Adult Organ Derivatives by Anatomical System:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedNode.derivatives.map((deriv, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/90 border border-slate-800/90 p-3 rounded-xl flex flex-col gap-1.5"
              >
                <span className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-1">
                  {deriv.system}
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {deriv.structures.map((s, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="text-sky-400">•</span>
                      <span className="leading-snug">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* High-Yield Clinical Anomalies & Defect Syndromes */}
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3.5 text-xs text-rose-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-rose-300 uppercase tracking-wider text-[11px]">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            High-Yield Clinical Correlates & Congenital Malformations:
          </div>
          <ul className="space-y-1 text-slate-300">
            {selectedNode.clinicalDefects.map((defect, dIdx) => (
              <li key={dIdx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span className="leading-relaxed">{defect}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
