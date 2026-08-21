import React, { useState, useMemo } from 'react';
import { 
  ORGAN_SYSTEMS_DATA, 
  OrganSystemData, 
  OrganSystemId, 
  SystemDevelopmentStage, 
  OrganDerivativeItem, 
  CongenitalDefectItem 
} from '../data/organSystemsData';
import { GermLayer, EmbryoStage } from '../types';
import { EMBRYO_STAGES } from '../data/embryoStagesData';
import { 
  Heart, 
  Brain, 
  Utensils, 
  Wind, 
  Activity, 
  Smile, 
  Bone, 
  Droplets, 
  Search, 
  Dna, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  BookOpen, 
  Layers, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  Check, 
  ExternalLink,
  Info,
  Flame,
  ShieldCheck,
  Stethoscope,
  Microscope,
  Eye,
  GitPullRequest,
  Split,
  CircleDot
} from 'lucide-react';

interface OrganSystemsDevelopmentProps {
  onJumpToAtlasStage?: (stage: EmbryoStage) => void;
  onOpenGlossary?: (term: string) => void;
}

export const OrganSystemsDevelopment: React.FC<OrganSystemsDevelopmentProps> = ({
  onJumpToAtlasStage,
  onOpenGlossary
}) => {
  const [selectedSystemId, setSelectedSystemId] = useState<OrganSystemId>('cardiovascular');
  const [activeSection, setActiveSection] = useState<'stages' | 'derivatives' | 'anomalies' | 'special_topics' | 'board_pearls'>('stages');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGermLayer, setFilterGermLayer] = useState<GermLayer | 'all'>('all');
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>({});

  const currentSystem: OrganSystemData = useMemo(() => {
    return ORGAN_SYSTEMS_DATA.find(s => s.id === selectedSystemId) || ORGAN_SYSTEMS_DATA[0];
  }, [selectedSystemId]);

  const handleSystemChange = (id: OrganSystemId) => {
    setSelectedSystemId(id);
    setSelectedStageIndex(0);
    setSearchQuery('');
  };

  const getSystemIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'Heart': return <Heart className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Smile': return <Smile className={className} />;
      case 'Bone': return <Bone className={className} />;
      case 'Droplets': return <Droplets className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const getGermLayerBadge = (layer: GermLayer) => {
    switch (layer) {
      case 'ectoderm':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">Ectoderm</span>;
      case 'mesoderm':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Mesoderm</span>;
      case 'endoderm':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Endoderm</span>;
      case 'neural_crest':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Neural Crest</span>;
      case 'extraembryonic':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">Extraembryonic</span>;
    }
  };

  // Filtered lists for search
  const filteredDerivatives = useMemo(() => {
    return currentSystem.derivativesMatrix.filter(item => {
      const matchesSearch = 
        searchQuery === '' ||
        item.embryonicStructure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.adultDerivative.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.clinicalSignificance && item.clinicalSignificance.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLayer = filterGermLayer === 'all' || item.germLayer === filterGermLayer;
      return matchesSearch && matchesLayer;
    });
  }, [currentSystem, searchQuery, filterGermLayer]);

  const filteredDefects = useMemo(() => {
    return currentSystem.congenitalDefects.filter(item => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.embryologicalBasis.toLowerCase().includes(q) ||
        item.presentation.toLowerCase().includes(q) ||
        item.usmlePearl.toLowerCase().includes(q)
      );
    });
  }, [currentSystem, searchQuery]);

  const activeStage = currentSystem.stages[selectedStageIndex] || currentSystem.stages[0];

  const handleJumpToStage = (embryoStageId?: string) => {
    if (!embryoStageId || !onJumpToAtlasStage) return;
    const targetStage = EMBRYO_STAGES.find(s => s.id === embryoStageId);
    if (targetStage) {
      onJumpToAtlasStage(targetStage);
    }
  };

  const toggleChecklist = (key: string) => {
    setCheckedChecklistItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-48 h-48 rounded-full bg-rose-500/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Special Embryology & Organogenesis
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                8 Organ Systems
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Stages of Systems & Organs Development
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Explore step-by-step organogenesis, master signaling genes (SHH, FGF, Wnt, BMP), germ layer adult derivatives, and USMLE high-yield congenital malformations across all 8 major human physiological systems.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl self-start md:self-auto shadow-inner">
            <div className="text-center px-2">
              <div className="text-lg font-black text-rose-400">8</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Systems</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-lg font-black text-sky-400">38+</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Stages</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-lg font-black text-emerald-400">75+</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Derivatives</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8-System Selection Grid / Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {ORGAN_SYSTEMS_DATA.map((sys) => {
          const isSelected = sys.id === selectedSystemId;
          return (
            <button
              key={sys.id}
              id={`btn_sys_${sys.id}`}
              onClick={() => handleSystemChange(sys.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 group relative ${
                isSelected
                  ? `${sys.color.bg} ${sys.color.border} ${sys.color.glow} text-white shadow-lg ring-1 ring-white/20`
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div 
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${
                  isSelected ? `${sys.color.text} bg-slate-950/80` : 'text-slate-400 bg-slate-950/40'
                }`}
              >
                {getSystemIcon(sys.iconName, "w-5 h-5")}
              </div>
              <span className={`text-xs font-bold leading-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {sys.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                {sys.stages.length} Stages
              </span>
              {isSelected && (
                <div className="absolute -bottom-1 w-6 h-1 rounded-full bg-white shadow-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active System Master Header Card */}
      <div className={`p-5 rounded-2xl border ${currentSystem.color.border} ${currentSystem.color.bg} backdrop-blur-md relative overflow-hidden shadow-xl`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 text-white">
                {getSystemIcon(currentSystem.iconName, "w-4 h-4 " + currentSystem.color.text)}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {currentSystem.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300">
                {currentSystem.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {currentSystem.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400">Germ Layers:</span>
              {currentSystem.germLayers.map(gl => (
                <React.Fragment key={gl}>{getGermLayerBadge(gl)}</React.Fragment>
              ))}
              <span className="text-xs font-bold text-slate-400 ml-2">Critical Period:</span>
              <span className="text-xs font-mono font-semibold text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/50">
                {currentSystem.criticalPeriod}
              </span>
            </div>
          </div>

          {/* Master Genes Bar */}
          <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl max-w-md">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1">
              <Dna className="w-3.5 h-3.5" />
              <span>Master Regulators & Signaling Cascades</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentSystem.masterGenes.map((gene, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenGlossary && onOpenGlossary(gene.split(' ')[0])}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:border-sky-500 hover:text-sky-300 transition-colors"
                  title={`Lookup ${gene} in Embryology Glossary`}
                >
                  {gene}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Internal Sub-View Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          id="tab_system_stages"
          onClick={() => setActiveSection('stages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'stages'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Developmental Stages Timeline ({currentSystem.stages.length})</span>
        </button>

        <button
          id="tab_system_derivatives"
          onClick={() => setActiveSection('derivatives')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'derivatives'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Adult Derivatives Matrix ({currentSystem.derivativesMatrix.length})</span>
        </button>

        <button
          id="tab_system_anomalies"
          onClick={() => setActiveSection('anomalies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'anomalies'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Congenital Defects & USMLE ({currentSystem.congenitalDefects.length})</span>
        </button>

        {currentSystem.fetalCirculationOrSpecialTopics && (
          <button
            id="tab_system_special_topics"
            onClick={() => setActiveSection('special_topics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === 'special_topics'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentSystem.fetalCirculationOrSpecialTopics.topicTitle}</span>
          </button>
        )}

        <button
          id="tab_system_board_pearls"
          onClick={() => setActiveSection('board_pearls')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'board_pearls'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>High-Yield Board Review</span>
        </button>
      </div>

      {/* SECTION 1: DEVELOPMENTAL STAGES STEPPER & DETAIL */}
      {activeSection === 'stages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Stage Stepper List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sequential Stages
              </span>
              <span className="text-xs font-mono text-sky-400">
                Stage {selectedStageIndex + 1} of {currentSystem.stages.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {currentSystem.stages.map((stg, index) => {
                const isSelected = index === selectedStageIndex;
                return (
                  <button
                    key={stg.stageId}
                    id={`btn_stage_item_${stg.stageId}`}
                    onClick={() => setSelectedStageIndex(index)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 relative group ${
                      isSelected
                        ? 'bg-slate-900 border-sky-500/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    {/* Stage number circle badge */}
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'bg-sky-500 text-slate-950 font-black' 
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold leading-snug line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {stg.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono font-semibold text-sky-300">
                          {stg.timeframe}
                        </span>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {stg.carnegieStage}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {stg.overview}
                      </p>
                    </div>

                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-sky-400 flex-shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Stage In-Depth Inspector */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 space-y-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 blur-3xl pointer-events-none" />

              {/* Stage Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Stage {selectedStageIndex + 1} • {activeStage.timeframe}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                      {activeStage.carnegieStage}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono text-purple-300 bg-purple-950/40 border border-purple-800/40">
                      Week {activeStage.week}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {activeStage.title}
                  </h3>
                </div>

                {/* 3D Atlas Stage Jump Button */}
                {activeStage.embryoStageId && onJumpToAtlasStage && (
                  <button
                    id="btn_jump_to_atlas_from_stage"
                    onClick={() => handleJumpToStage(activeStage.embryoStageId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 border border-sky-500/50 text-sky-300 font-bold text-xs transition-all shadow-md self-start sm:self-auto"
                    title="Open this developmental stage in the 3D Interactive Embryo Atlas"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>View in 3D Atlas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Stage Overview Description */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeStage.overview}
                </p>
              </div>

              {/* Morphological / Anatomical Events Checklist */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Key Morphological & Anatomical Transformations</span>
                </div>
                <div className="space-y-2">
                  {activeStage.anatomicalEvents.map((evt, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 leading-relaxed"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div className="flex-1">{evt}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Molecular Signaling Cascade */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Dna className="w-4 h-4 text-sky-400" />
                  <span>Molecular Signaling & Master Morphogens</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeStage.molecularSignaling.map((mol, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sky-300">
                          {mol.gene}
                        </span>
                        <button
                          onClick={() => onOpenGlossary && onOpenGlossary(mol.gene.split(' ')[0])}
                          className="text-[10px] text-slate-500 hover:text-sky-400 flex items-center gap-0.5"
                          title="Lookup gene"
                        >
                          <BookOpen className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {mol.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Significance / Pathology Note */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    Clinical Malformation Risk
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    {activeStage.clinicalNotes}
                  </p>
                </div>
              </div>

              {/* Prev / Next Stage Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => setSelectedStageIndex(Math.max(0, selectedStageIndex - 1))}
                  disabled={selectedStageIndex === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-300 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Stage</span>
                </button>

                <span className="text-xs text-slate-400 font-mono">
                  {selectedStageIndex + 1} / {currentSystem.stages.length}
                </span>

                <button
                  onClick={() => setSelectedStageIndex(Math.min(currentSystem.stages.length - 1, selectedStageIndex + 1))}
                  disabled={selectedStageIndex === currentSystem.stages.length - 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-300 transition-all"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ADULT DERIVATIVES MATRIX */}
      {activeSection === 'derivatives' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search embryonic structures or adult organs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Filter Layer:</span>
              <button
                onClick={() => setFilterGermLayer('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  filterGermLayer === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                All ({currentSystem.derivativesMatrix.length})
              </button>
              <button
                onClick={() => setFilterGermLayer('ectoderm')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  filterGermLayer === 'ectoderm' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Ectoderm
              </button>
              <button
                onClick={() => setFilterGermLayer('mesoderm')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  filterGermLayer === 'mesoderm' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Mesoderm
              </button>
              <button
                onClick={() => setFilterGermLayer('endoderm')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  filterGermLayer === 'endoderm' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Endoderm
              </button>
              <button
                onClick={() => setFilterGermLayer('neural_crest')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  filterGermLayer === 'neural_crest' ? 'bg-purple-500 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Neural Crest
              </button>
            </div>
          </div>

          {/* Derivatives Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3.5">Embryonic Precursor Structure</th>
                    <th className="p-3.5">Germ Layer Origin</th>
                    <th className="p-3.5">Definitive Adult Derivative</th>
                    <th className="p-3.5">Clinical Defect or USMLE Clue</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDerivatives.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <CircleDot className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span>{item.embryonicStructure}</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        {getGermLayerBadge(item.germLayer)}
                      </td>
                      <td className="p-3.5 font-semibold text-emerald-300">
                        {item.adultDerivative}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {item.clinicalSignificance ? (
                          <span className="text-rose-300 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/40">
                            {item.clinicalSignificance}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenGlossary && onOpenGlossary(item.embryonicStructure)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3 text-sky-400" />
                          <span>Glossary</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredDerivatives.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No structures match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CONGENITAL MALFORMATIONS & USMLE CLINICAL CORRELATES */}
      {activeSection === 'anomalies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDefects.map((defect, index) => (
              <div 
                key={index}
                className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 space-y-3.5 transition-all duration-200 hover:shadow-xl hover:shadow-rose-950/20 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {defect.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/50 text-rose-300 border border-rose-800/50 whitespace-nowrap">
                      Congenital
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Incidence: {defect.incidence}
                  </div>

                  {/* Embryological Pathogenesis */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                      <Microscope className="w-3 h-3" />
                      <span>Embryological Defect Mechanism</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {defect.embryologicalBasis}
                    </p>
                  </div>

                  {/* Clinical Presentation */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" />
                      <span>Presentation & Diagnostic Clues</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {defect.presentation}
                    </p>
                  </div>
                </div>

                {/* USMLE Board Pearl Box */}
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200/90 leading-snug flex items-start gap-2 mt-2">
                  <Flame className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-300 uppercase tracking-wider text-[10px] block">
                      High-Yield USMLE Pearl
                    </span>
                    {defect.usmlePearl}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: FETAL CIRCULATION & SPECIAL TOPICS EXPLORER */}
      {activeSection === 'special_topics' && currentSystem.fetalCirculationOrSpecialTopics && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {currentSystem.fetalCirculationOrSpecialTopics.topicTitle}
              </h3>
              <p className="text-xs text-slate-400">
                Detailed physiological pathways, prenatal functions, postnatal closure triggers, and remnant ligaments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSystem.fetalCirculationOrSpecialTopics.items.map((item, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-300">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    Shunt / Vessel
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    In Utero Prenatal Role:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.prenatalRole}
                  </p>
                </div>

                <div className="space-y-1 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    Adult Postnatal Remnant:
                  </div>
                  <p className="text-xs font-bold text-white">
                    {item.postnatalRemnant}
                  </p>
                </div>

                {item.defectIfPatent && (
                  <div className="text-[11px] text-rose-300 bg-rose-950/20 p-2 rounded-lg border border-rose-900/30">
                    <span className="font-bold">If Patent:</span> {item.defectIfPatent}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: HIGH-YIELD BOARD REVIEW & SELF-ASSESSMENT CHECKLIST */}
      {activeSection === 'board_pearls' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                <Flame className="w-4 h-4" />
                <span>USMLE Step 1 & Medical Embryology High-Yield Pearls</span>
              </div>

              <div className="space-y-2.5">
                {currentSystem.highYieldBoardPearls.map((pearl, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                      {idx + 1}
                    </div>
                    <div className="flex-1 font-medium">
                      {pearl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mastery Self-Recall Checklist */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Mastery Checklist</span>
                </div>
                <span className="text-xs font-mono text-sky-400 font-bold">
                  {Object.values(checkedChecklistItems).filter(Boolean).length} / {currentSystem.stages.length + 3} Checked
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Test your active recall on this organ system. Check off milestones you can explain from memory:
              </p>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {currentSystem.stages.map((stg, idx) => {
                  const itemKey = `${currentSystem.id}_stage_${stg.stageId}`;
                  const isChecked = !!checkedChecklistItems[itemKey];
                  return (
                    <button
                      key={stg.stageId}
                      onClick={() => toggleChecklist(itemKey)}
                      className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all ${
                        isChecked
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-200'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                          isChecked 
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className={`font-bold ${isChecked ? 'text-emerald-300' : 'text-slate-300'}`}>
                          {stg.title} ({stg.timeframe})
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {stg.overview}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Additional Concept Checkpoints */}
                <button
                  onClick={() => toggleChecklist(`${currentSystem.id}_derivatives`)}
                  className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    checkedChecklistItems[`${currentSystem.id}_derivatives`]
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                      checkedChecklistItems[`${currentSystem.id}_derivatives`]
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {checkedChecklistItems[`${currentSystem.id}_derivatives`] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className={`font-bold ${checkedChecklistItems[`${currentSystem.id}_derivatives`] ? 'text-emerald-300' : 'text-slate-300'}`}>
                      Adult Derivatives Recall
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Can list all embryonic precursors to adult organs
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => toggleChecklist(`${currentSystem.id}_anomalies`)}
                  className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    checkedChecklistItems[`${currentSystem.id}_anomalies`]
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                      checkedChecklistItems[`${currentSystem.id}_anomalies`]
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {checkedChecklistItems[`${currentSystem.id}_anomalies`] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className={`font-bold ${checkedChecklistItems[`${currentSystem.id}_anomalies`] ? 'text-emerald-300' : 'text-slate-300'}`}>
                      Congenital Malformations & Gene Mutations
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Can explain pathological mechanisms for board questions
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
