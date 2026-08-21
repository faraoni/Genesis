import React, { useState, useMemo } from 'react';
import { EmbryoStage } from '../types';
import { 
  Scale, 
  X, 
  ArrowRight, 
  ArrowLeftRight, 
  Activity, 
  Brain, 
  Heart, 
  Layers, 
  Dna, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ExternalLink,
  BookOpen,
  Calendar,
  Zap,
  Columns2,
  TrendingUp,
  CheckCircle2,
  GitCommit,
  Stethoscope,
  Info
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stages: EmbryoStage[];
  initialStageA?: EmbryoStage;
  initialStageB?: EmbryoStage;
  onOpenSplitView?: (stageA: EmbryoStage, stageB: EmbryoStage) => void;
  onAskAITutor?: (prompt: string) => void;
}

interface OrganSystemEvolution {
  system: string;
  icon: React.ReactNode;
  colorClass: string;
  borderClass: string;
  stageAState: string;
  stageBState: string;
  morphogeneticDelta: string;
  clinicalRelevance: string;
}

interface PresetComparison {
  title: string;
  tag: string;
  stageAId: string;
  stageBId: string;
  summary: string;
}

export const CompareStagesOverlay: React.FC<Props> = ({
  isOpen,
  onClose,
  stages,
  initialStageA,
  initialStageB,
  onOpenSplitView,
  onAskAITutor,
}) => {
  // Find initial selections
  const defaultA = initialStageA || stages.find(s => s.id === 'stage_w3_gastrula') || stages[0];
  const defaultB = initialStageB || stages.find(s => s.id === 'stage_w8_embryo_term') || stages[stages.length - 1];

  const [selectedStageAId, setSelectedStageAId] = useState<string>(defaultA.id);
  const [selectedStageBId, setSelectedStageBId] = useState<string>(defaultB.id);
  const [activeSystemFilter, setActiveSystemFilter] = useState<string>('All');

  const stageA = useMemo(() => stages.find(s => s.id === selectedStageAId) || stages[0], [stages, selectedStageAId]);
  const stageB = useMemo(() => stages.find(s => s.id === selectedStageBId) || stages[stages.length - 1], [stages, selectedStageBId]);

  if (!isOpen) return null;

  // Chronological Calculations
  const isChronologicalOrder = stageA.dayStart <= stageB.dayStart;
  const earlierStage = isChronologicalOrder ? stageA : stageB;
  const laterStage = isChronologicalOrder ? stageB : stageA;

  const daySpan = Math.abs(stageB.dayStart - stageA.dayStart);
  const weekSpan = Math.abs(stageB.week - stageA.week);
  const crlDelta = Math.abs(stageB.crlMm - stageA.crlMm).toFixed(2);
  const crlMultiplier = earlierStage.crlMm > 0 
    ? (laterStage.crlMm / earlierStage.crlMm).toFixed(1) 
    : 'N/A';

  // Swap baseline and secondary stages
  const handleSwap = () => {
    const temp = selectedStageAId;
    setSelectedStageAId(selectedStageBId);
    setSelectedStageBId(temp);
  };

  // High-Yield Presets
  const PRESETS: PresetComparison[] = [
    {
      title: 'Gastrulation to Neurulation',
      tag: 'Week 3 vs Week 4 (CS 7–12)',
      stageAId: 'stage_w3_gastrula',
      stageBId: 'stage_w4_neurula',
      summary: 'Trilaminar disc formation through the primitive streak transitioning to neural tube fusion and initiation of heartbeat.'
    },
    {
      title: 'Neurulation to Complete Organogenesis',
      tag: 'Week 4 vs Week 8 (CS 10–23)',
      stageAId: 'stage_w4_neurula',
      stageBId: 'stage_w8_embryo_term',
      summary: 'Critical organogenesis window: transformation from primitive somite embryo to human-like fetus with partitioned organs.'
    },
    {
      title: 'Branchial Arches & Cardiac Septation',
      tag: 'Week 4 vs Week 6 (CS 10–17)',
      stageAId: 'stage_w4_neurula',
      stageBId: 'stage_w6_digital_rays',
      summary: 'Pharyngeal arch maturation, cardiac looping into chambers, and upper extremity digital ray separation.'
    },
    {
      title: 'Embryonic to Fetal Period Shift',
      tag: 'Week 8 vs Week 12 (CS 23–Fetal)',
      stageAId: 'stage_w8_embryo_term',
      stageBId: 'stage_w12_early_fetus',
      summary: 'End of high teratogenic vulnerability, primary ossification center development, and physiological gut herniation reduction.'
    },
    {
      title: 'Zygote Cleavage to Implantation',
      tag: 'Week 1 vs Week 2 (CS 1–5)',
      stageAId: 'stage_w1_zygote',
      stageBId: 'stage_w2_bilaminar',
      summary: 'Totipotent cleavage blastomeres segregating into outer trophoblast and inner pluripotent embryoblast disc.'
    }
  ];

  // Helper function to synthesize system-by-system organogenesis descriptions
  const getSystemState = (stage: EmbryoStage, system: string): string => {
    const wk = stage.week;
    if (system === 'Cardiovascular') {
      if (wk <= 2) return 'Primary cardiogenic field specified in splanchnic mesoderm; bilateral angioblastic cords.';
      if (wk === 3) return 'Bilateral endocardial tubes fuse into single primitive tubular heart with peristaltic flow.';
      if (wk === 4) return `Primitive heart tube beats (~65 BPM); initiates D-looping (bulboventricular loop) establishing cardiac polarity.`;
      if (wk <= 6) return `Atrial (septum primum/secundum) and interventricular septation underway; endocardial cushions fuse; heart rate ~110-130 BPM.`;
      if (wk <= 8) return `Definitive 4-chambered heart formed; aorticopulmonary spiral septum divides aorta and pulmonary trunk; ~160 BPM.`;
      return `Mature fetal circulation with patent foramen ovale and ductus arteriosus shunting oxygenated placental blood.`;
    }
    if (system === 'Nervous & Senses') {
      if (wk <= 2) return 'Epiblast pluripotency; no neuroectodermal specification.';
      if (wk === 3) return 'Notochord secretes SHH inducing overlying ectoderm into neural plate; neural folds elevate.';
      if (wk === 4) return 'Neural tube closure (cranial Day 25, caudal Day 28); 3 primary brain vesicles (Pros-, Mes-, Rhombencephalon); optic/otic placodes.';
      if (wk <= 6) return '5 secondary brain vesicles (Tel-, Di-, Mes-, Met-, Myelencephalon); retinal pigment appears; cerebral hemispheres expand.';
      if (wk <= 8) return 'Cerebral cortex lamination begins; primitive brainstem reflexes; cranial nerves I-XII anatomically continuous.';
      return 'Rapid neocortical proliferation; functional myelination begins; eye position migrates ventromedially.';
    }
    if (system === 'Craniofacial & Pharyngeal') {
      if (wk <= 3) return 'Prechordal plate and stomodeum depression established; no pharyngeal arches.';
      if (wk === 4) return 'Pharyngeal arches 1 & 2 prominent; stomodeum lined by ectoderm; maxillary and mandibular prominences diverge.';
      if (wk <= 6) return 'Pharyngeal arches 1-4 active; nasal placodes form medial/lateral prominences; auricle hillocks around 1st pharyngeal cleft.';
      if (wk <= 8) return 'Maxillary prominences fuse with medial nasal prominences forming intermaxillary segment; palatal shelves elevate and fuse.';
      return 'Distinct human facial profile; secondary palate fusion complete; eyelids fuse shut until week 26.';
    }
    if (system === 'Gastrointestinal & Respiratory') {
      if (wk <= 3) return 'Primitive yolk sac cavity; lateral and craniocaudal folding begins to incorporate endoderm into gut tube.';
      if (wk === 4) return 'Primitive gut tube divided into Foregut, Midgut, and Hindgut; respiratory diverticulum (lung bud) branches from foregut.';
      if (wk <= 6) return 'Physiological umbilical herniation of midgut loop into extraembryonic coelom; hepatic cords active in hematopoiesis; pseudoglandular lung stage.';
      if (wk <= 8) return 'Midgut undergoes 270° counterclockwise rotation around superior mesenteric artery; stomach completes 90° clockwise rotation.';
      return 'Midgut loop returns to abdominal cavity (Week 10); cecum descends to right iliac fossa; primary bile secretion.';
    }
    if (system === 'Musculoskeletal & Limbs') {
      if (wk <= 3) return 'Paraxial mesoderm segmentation into initial occipital somites.';
      if (wk === 4) return '42-44 pairs of somites (sclerotome, myotome, dermatome); upper limb buds appear at C5-T1 (Day 26), lower limb buds (Day 28).';
      if (wk <= 6) return 'Paddle-like hand and foot plates; AER directs proximodistal growth; digital rays condensations in mesenchyme.';
      if (wk <= 8) return 'Interdigital apoptosis mediated by BMP-4 separates fingers and toes; primary ossification centers form in long bones (clavicle/femur).';
      return 'Active fetal limb movements (uncoordinated twitches); ossification advances into flat cranial bones; joint cavities functional.';
    }
    if (system === 'Urogenital') {
      if (wk <= 3) return 'Intermediate mesoderm longitudinal nephrogenic cord specification.';
      if (wk === 4) return 'Non-functional Pronephros regresses; Mesonephros and Wolffian duct form interim filtering units.';
      if (wk <= 6) return 'Ureteric bud sprouts from Wolffian duct, penetrating Metanephric blastema (reciprocal induction); indifferent gonad develops.';
      if (wk <= 8) return 'Ascent of kidneys from pelvic to lumbar region; SRY gene triggers Testis-determining factor (or ovary default pathway); external genitalia ambiguous.';
      return 'Functional nephrons begin fetal urine production (contributing to amniotic fluid); sex-specific external genitalia differentiation detectable.';
    }
    return 'Lineage-specific epigenetic maturation and physiological growth.';
  };

  // Build the 6 core organ system comparative objects
  const SYSTEM_EVOLUTIONS: OrganSystemEvolution[] = [
    {
      system: 'Cardiovascular System',
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      borderClass: 'border-rose-500/30',
      stageAState: getSystemState(stageA, 'Cardiovascular'),
      stageBState: getSystemState(stageB, 'Cardiovascular'),
      morphogeneticDelta: `Transition from ${stageA.heartRateBpm ? `${stageA.heartRateBpm} BPM rhythm` : 'pre-cardiac fields'} to ${stageB.heartRateBpm ? `${stageB.heartRateBpm} BPM chambered pump` : 'mature fetal vascular flow'}.`,
      clinicalRelevance: 'Critical window for septation defects (VSD, ASD, Tetralogy of Fallot, Transposition of Great Arteries).'
    },
    {
      system: 'Central Nervous System & Senses',
      icon: <Brain className="w-4 h-4 text-sky-400" />,
      colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      borderClass: 'border-sky-500/30',
      stageAState: getSystemState(stageA, 'Nervous & Senses'),
      stageBState: getSystemState(stageB, 'Nervous & Senses'),
      morphogeneticDelta: `Cranial expansion from ${stageA.title.toLowerCase()} to ${stageB.title.toLowerCase()} with progressive vesicular encephalic subdivision.`,
      clinicalRelevance: 'Folate sensitivity window: Anencephaly (cranial pore defect), Spina Bifida (caudal pore defect), Holoprosencephaly (SHH defect).'
    },
    {
      system: 'Craniofacial & Pharyngeal Apparatus',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      borderClass: 'border-amber-500/30',
      stageAState: getSystemState(stageA, 'Craniofacial & Pharyngeal'),
      stageBState: getSystemState(stageB, 'Craniofacial & Pharyngeal'),
      morphogeneticDelta: 'Transformation of branchial arch bars and facial prominences into fused midline secondary palate and definitive facial features.',
      clinicalRelevance: 'Failure of maxillary + medial nasal prominence fusion causes Cleft Lip; failure of palatine process fusion causes Cleft Palate.'
    },
    {
      system: 'Gastrointestinal & Respiratory',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      borderClass: 'border-emerald-500/30',
      stageAState: getSystemState(stageA, 'Gastrointestinal & Respiratory'),
      stageBState: getSystemState(stageB, 'Gastrointestinal & Respiratory'),
      morphogeneticDelta: 'Primitive endodermal gut tube differentiation, respiratory branching morphogenesis, and midgut rotational dynamics.',
      clinicalRelevance: 'Tracheoesophageal fistula, Omphalocele (failure of midgut return), Gastroschisis, Hirschsprung disease (neural crest migration defect).'
    },
    {
      system: 'Musculoskeletal & Limb Morphogenesis',
      icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
      colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      borderClass: 'border-purple-500/30',
      stageAState: getSystemState(stageA, 'Musculoskeletal & Limbs'),
      stageBState: getSystemState(stageB, 'Musculoskeletal & Limbs'),
      morphogeneticDelta: 'Progression from early somitic myotome/sclerotome signals to paddle condensation, interdigital apoptosis, and primary ossification.',
      clinicalRelevance: 'Thalidomide teratogenicity (Phocomelia/Amelia), Syndactyly (failure of BMP-4 apoptosis), Polydactyly (ectopic ZPA SHH).'
    },
    {
      system: 'Urogenital System',
      icon: <Dna className="w-4 h-4 text-indigo-400" />,
      colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      borderClass: 'border-indigo-500/30',
      stageAState: getSystemState(stageA, 'Urogenital'),
      stageBState: getSystemState(stageB, 'Urogenital'),
      morphogeneticDelta: 'Succession from pronephros/mesonephros to metanephric blastema induction and ascent of functional fetal kidneys.',
      clinicalRelevance: 'Renal agenesis (ureteric bud failure $\\to$ Potter sequence), Horseshoe kidney (inferior mesenteric artery entrapment), Hypospadias.'
    }
  ];

  const filteredSystems = activeSystemFilter === 'All'
    ? SYSTEM_EVOLUTIONS
    : SYSTEM_EVOLUTIONS.filter(s => s.system.toLowerCase().includes(activeSystemFilter.toLowerCase()));

  // Intermediate stages between earlier and later stage
  const intermediateStages = stages.filter(s => 
    s.dayStart >= earlierStage.dayStart && s.dayStart <= laterStage.dayStart
  );

  return (
    <div 
      id="compare_stages_overlay_modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[92vh] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/40 text-sky-400 shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Comparative Organogenesis Chronology
                </h2>
                <span className="bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  Differential Matrix
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyze developmental transitions, signaling pathways, and anatomical transformations between any two Carnegie stages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSplitView && (
              <button
                id="btn_launch_split_from_compare"
                onClick={() => {
                  onOpenSplitView(stageA, stageB);
                  onClose();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-semibold transition-all shadow-md"
                title="Open these two stages side-by-side in 3D Split-View"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Open in 3D Split-View</span>
              </button>
            )}

            <button
              id="btn_close_compare_overlay"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Selection & Metric Ribbon */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Stage A & Stage B Interactive Dropdown Selectors */}
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            {/* Baseline Stage A */}
            <div className="w-full sm:w-1/2 flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Baseline Stage (From)
              </label>
              <select
                id="select_baseline_stage_a"
                value={selectedStageAId}
                onChange={(e) => setSelectedStageAId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-sky-500/40 focus:border-sky-400 rounded-xl text-xs font-semibold text-white outline-none cursor-pointer hover:bg-slate-850 transition-all shadow-inner"
              >
                {stages.map((stg) => (
                  <option key={stg.id} value={stg.id}>
                    Week {stg.week} {stg.carnegieStage ? `(CS ${stg.carnegieStage})` : ''} • {stg.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              id="btn_swap_comparison_stages"
              onClick={handleSwap}
              className="mt-4 sm:mt-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all shadow flex-shrink-0"
              title="Swap Baseline and Secondary Stages"
            >
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
            </button>

            {/* Secondary Stage B */}
            <div className="w-full sm:w-1/2 flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Secondary Stage (To)
              </label>
              <select
                id="select_secondary_stage_b"
                value={selectedStageBId}
                onChange={(e) => setSelectedStageBId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-indigo-500/40 focus:border-indigo-400 rounded-xl text-xs font-semibold text-white outline-none cursor-pointer hover:bg-slate-850 transition-all shadow-inner"
              >
                {stages.map((stg) => (
                  <option key={stg.id} value={stg.id}>
                    Week {stg.week} {stg.carnegieStage ? `(CS ${stg.carnegieStage})` : ''} • {stg.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Morphometric Delta Badge Card */}
          <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center justify-around sm:justify-end gap-5 text-xs shadow-lg flex-shrink-0">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Interval</span>
              <span className="text-sky-300 font-bold font-mono text-xs">
                {daySpan} Days <span className="text-slate-400 font-normal">({weekSpan} wks)</span>
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">CRL Growth</span>
              <span className="text-emerald-300 font-bold font-mono text-xs">
                +{crlDelta} mm <span className="text-slate-400 font-normal">({crlMultiplier}x)</span>
              </span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Cardiac Delta</span>
              <span className="text-rose-400 font-bold font-mono text-xs">
                {stageA.heartRateBpm && stageB.heartRateBpm 
                  ? `${stageA.heartRateBpm} → ${stageB.heartRateBpm} BPM`
                  : stageB.heartRateBpm 
                  ? `${stageB.heartRateBpm} BPM active`
                  : 'Pre-cardiogenic'}
              </span>
            </div>
          </div>
        </div>

        {/* High-Yield Preset Comparison Pills */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 flex-shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Zap className="w-3 h-3 text-amber-400" />
            Presets:
          </span>
          {PRESETS.map((preset, idx) => {
            const isMatch = (selectedStageAId === preset.stageAId && selectedStageBId === preset.stageBId);
            return (
              <button
                key={idx}
                id={`btn_compare_preset_${idx}`}
                onClick={() => {
                  setSelectedStageAId(preset.stageAId);
                  setSelectedStageBId(preset.stageBId);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                  isMatch
                    ? 'bg-sky-500/20 text-sky-300 font-bold border-sky-500/40 shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-750'
                }`}
                title={preset.summary}
              >
                <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-900 rounded text-amber-300">
                  {preset.tag.split(' ')[0]}
                </span>
                <span>{preset.title}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Main Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">

          {/* Chronological Milestone Span Tracker (Sequential Visual Flow) */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-sky-400" />
                Chronological Milestone Trajectory ({intermediateStages.length} developmental stages spanned)
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                Day {earlierStage.dayStart} → Day {laterStage.dayEnd}
              </span>
            </div>

            {/* Horizontal Milestone Chain */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
              {intermediateStages.map((stg, i) => {
                const isSelectedEndpoint = stg.id === stageA.id || stg.id === stageB.id;
                return (
                  <div key={stg.id} className="flex items-center flex-shrink-0">
                    <div 
                      className={`p-3 rounded-xl border flex flex-col gap-1 w-48 sm:w-52 transition-all ${
                        isSelectedEndpoint
                          ? 'bg-slate-900/90 border-sky-500/60 shadow-lg shadow-sky-950/50'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={`font-bold ${isSelectedEndpoint ? 'text-sky-300' : 'text-slate-400'}`}>
                          Week {stg.week}
                        </span>
                        {stg.carnegieStage && (
                          <span className="px-1.5 py-0.2 bg-slate-950 rounded text-amber-300 font-bold">
                            CS {stg.carnegieStage}
                          </span>
                        )}
                        <span className="text-slate-500">{stg.crlMm}mm</span>
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{stg.title}</span>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {stg.keyEvents[0]}
                      </p>
                    </div>
                    {i < intermediateStages.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-600 mx-1 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 mr-1">Filter System:</span>
              {['All', 'Cardiovascular', 'Nervous', 'Craniofacial', 'Gastrointestinal', 'Musculoskeletal', 'Urogenital'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveSystemFilter(filter)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    activeSystemFilter === filter
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {onAskAITutor && (
              <button
                onClick={() => {
                  const prompt = `Can you compare the embryological differences between Carnegie Stage ${stageA.carnegieStage || stageA.week} (Week ${stageA.week}) and Carnegie Stage ${stageB.carnegieStage || stageB.week} (Week ${stageB.week})? Please highlight cardiovascular septation, neural tube development, and teratogenic risk.`;
                  onAskAITutor(prompt);
                  onClose();
                }}
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-3 py-1.5 rounded-xl transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Ask AI Tutor about this comparison</span>
              </button>
            )}
          </div>

          {/* System-by-System Organogenesis Comparison Cards Grid */}
          <div className="space-y-4">
            {filteredSystems.map((sys, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 hover:border-slate-750 transition-all"
              >
                {/* System Title & Differential Transition Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${sys.colorClass}`}>
                      {sys.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">{sys.system}</h4>
                      <p className="text-[11px] text-sky-300/90 font-mono mt-0.5 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-sky-400" />
                        {sys.morphogeneticDelta}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg self-start sm:self-center">
                    ORGANOGENESIS EVOLUTION
                  </span>
                </div>

                {/* 2-Column Comparison: Stage A State vs Stage B State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Stage A State */}
                  <div className="bg-slate-900/80 border border-sky-500/20 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-300 border-b border-slate-800/80 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        Week {stageA.week} {stageA.carnegieStage ? `(CS ${stageA.carnegieStage})` : ''} State
                      </span>
                      <span className="text-slate-400 font-normal">{stageA.title}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {sys.stageAState}
                    </p>
                  </div>

                  {/* Stage B State */}
                  <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-300 border-b border-slate-800/80 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        Week {stageB.week} {stageB.carnegieStage ? `(CS ${stageB.carnegieStage})` : ''} State
                      </span>
                      <span className="text-slate-400 font-normal">{stageB.title}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {sys.stageBState}
                    </p>
                  </div>
                </div>

                {/* Clinical Defect Vulnerability Callout */}
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-300 uppercase tracking-wider text-[10px] block">
                      USMLE High-Yield Teratogenic & Congenital Vulnerability:
                    </span>
                    <span className="text-slate-300 leading-relaxed">{sys.clinicalRelevance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Molecular Morphogen & Signaling Axis Differential Matrix */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Molecular Signaling & Morphogen Shift</h4>
                <p className="text-xs text-slate-400">Gene expression networks and morphogenetic gradient transitions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="font-mono text-sky-400 font-bold block text-[11px]">
                  Week {stageA.week} Expression Profile ({stageA.title})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stageA.morphogens.map((m, i) => (
                    <span key={i} className="px-2 py-1 bg-sky-950/60 border border-sky-500/30 rounded-lg text-sky-300 font-mono text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="font-mono text-indigo-400 font-bold block text-[11px]">
                  Week {stageB.week} Expression Profile ({stageB.title})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stageB.morphogens.map((m, i) => (
                    <span key={i} className="px-2 py-1 bg-indigo-950/60 border border-indigo-500/30 rounded-lg text-indigo-300 font-mono text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Based on Carnegie Institution developmental stages and Langman's Medical Embryology standards.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenSplitView && (
              <button
                onClick={() => {
                  onOpenSplitView(stageA, stageB);
                  onClose();
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-sky-950/50"
              >
                <Columns2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Load in 3D Split-View</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-700"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
