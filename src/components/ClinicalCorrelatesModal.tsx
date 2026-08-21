import React, { useState } from 'react';
import { CLINICAL_CONDITIONS } from '../data/clinicalCorrelatesData';
import { ClinicalCondition } from '../types';
import { Stethoscope, AlertTriangle, ShieldCheck, Heart, Brain, Search, X, Dna } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalCorrelatesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCondition, setActiveCondition] = useState<ClinicalCondition>(CLINICAL_CONDITIONS[0]);

  if (!isOpen) return null;

  const categories = ['All', 'Cardiovascular', 'Neural & Craniofacial', 'Gastrointestinal', 'Urogenital', 'Teratology'];

  const filteredConditions = CLINICAL_CONDITIONS.filter((cond) => {
    const matchesCat = selectedCategory === 'All' || cond.category === selectedCategory;
    const matchesSearch = cond.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cond.embryologicalBasis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cond.clinicalPresentation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 lg:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Clinical Embryology & Congenital Anomalies Reference
              </h2>
              <p className="text-xs text-slate-400">
                USMLE-grade high-yield embryological mechanisms, teratogenic critical windows, and ultrasound signs
              </p>
            </div>
          </div>

          <button
            id="btn_close_clinical_modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`btn_cat_${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input_search_clinical"
              type="text"
              placeholder="Search anomalies or genes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Main Content: Left List & Right Detail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Condition Cards List */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
            {filteredConditions.map((cond) => {
              const isSelected = cond.id === activeCondition.id;
              return (
                <button
                  key={cond.id}
                  id={`btn_cond_${cond.id}`}
                  onClick={() => setActiveCondition(cond)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50 ring-1 ring-rose-500/30'
                      : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">
                      {cond.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">
                      {cond.criticalPeriodWeeks}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{cond.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{cond.embryologicalBasis}</p>
                </button>
              );
            })}
          </div>

          {/* Right Column: In-Depth Clinical Monograph */}
          <div className="md:col-span-7 p-5 overflow-y-auto space-y-4 bg-slate-900/60">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {activeCondition.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Critical Period: {activeCondition.criticalPeriodWeeks}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5">{activeCondition.name}</h3>
              <p className="text-xs text-rose-400/90 font-mono mt-0.5">Incidence: {activeCondition.incidence}</p>
            </div>

            {/* Embryological Basis */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Fundamental Embryological Basis:
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {activeCondition.embryologicalBasis}
              </p>
            </div>

            {/* Clinical Presentation & Signs */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Clinical Presentation & Examination:
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {activeCondition.clinicalPresentation}
              </p>
            </div>

            {/* Ultrasound & Diagnostic Findings */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ultrasound & Antenatal Diagnostic Criteria:
              </h4>
              <ul className="space-y-1 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                {activeCondition.ultrasoundOrDiagnosticFindings.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Molecular & Genetic Mechanism */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5" />
                Molecular Signaling & Teratogens:
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                {activeCondition.molecularMechanism}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCondition.associatedGenesOrTeratogens.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
