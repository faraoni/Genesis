import React, { useState } from 'react';
import { EMBRYO_STAGES } from './data/embryoStagesData';
import { EmbryoStage, HotspotPin, ViewerSettings, GermLayer } from './types';
import { ThreeEmbryoViewer } from './components/ThreeEmbryoViewer';
import { SplitViewAtlas } from './components/SplitViewAtlas';
import { CarnegieStageSearchBar } from './components/CarnegieStageSearchBar';
import { CompareStagesOverlay } from './components/CompareStagesOverlay';
import { AugmentedRealityViewer } from './components/AugmentedRealityViewer';
import { VirtualRealityViewer } from './components/VirtualRealityViewer';
import { CarnegieTimeLapsePlayer } from './components/CarnegieTimeLapsePlayer';
import { EmbryologyGlossaryPanel } from './components/EmbryologyGlossaryPanel';
import { StageTimeline } from './components/StageTimeline';
import { GermLayerFateMap } from './components/GermLayerFateMap';
import { GermLayerRudimentDiagram } from './components/GermLayerRudimentDiagram';
import { UltrasoundViewPanel } from './components/UltrasoundViewPanel';
import { ClinicalCorrelatesModal } from './components/ClinicalCorrelatesModal';
import { EmbryoQuiz } from './components/EmbryoQuiz';
import { EmbryoAITutor } from './components/EmbryoAITutor';
import { AnatomyHotspotDetails } from './components/AnatomyHotspotDetails';
import { OrganSystemsDevelopment } from './components/OrganSystemsDevelopment';
import { 
  Sparkles, 
  Stethoscope, 
  Layers, 
  GitFork, 
  Radio, 
  GraduationCap, 
  Bot, 
  BookOpen, 
  Eye,
  Info,
  ExternalLink,
  Heart,
  ChevronDown,
  Columns2,
  Split,
  Scale,
  Camera,
  Glasses,
  Network,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState<EmbryoStage>(EMBRYO_STAGES[4]); // Default to Week 4 (Neurula & First Heartbeat)
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(null);
  const [isClinicalModalOpen, setIsClinicalModalOpen] = useState(false);
  const [isCompareOverlayOpen, setIsCompareOverlayOpen] = useState(false);
  const [isARModeOpen, setIsARModeOpen] = useState(false);
  const [isVRModeOpen, setIsVRModeOpen] = useState(false);
  const [isTimeLapseOpen, setIsTimeLapseOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossarySearchQuery, setGlossarySearchQuery] = useState('');
  const [compareStageA, setCompareStageA] = useState<EmbryoStage>(EMBRYO_STAGES[4]);
  const [compareStageB, setCompareStageB] = useState<EmbryoStage>(EMBRYO_STAGES[7] || EMBRYO_STAGES[EMBRYO_STAGES.length - 1]);
  const [activeTab, setActiveTab] = useState<'atlas' | 'systems' | 'fatemap' | 'ultrasound' | 'quiz' | 'ai_tutor'>('atlas');
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [aiTutorInitialPrompt, setAiTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [hoveredGermLayer, setHoveredGermLayer] = useState<GermLayer | 'all' | null>(null);

  const [settings, setSettings] = useState<ViewerSettings>({
    showEctoderm: true,
    showMesoderm: true,
    showEndoderm: true,
    showCardiovascular: true,
    showNervousSystem: true,
    showHotspots: true,
    wireframe: false,
    cutawayPlane: 'none',
    cutawayOffset: 0.0,
    ultrasoundMode: false,
    ultrasoundGain: 75,
    autoRotate: false,
    heartbeatAnimate: true,
    lightingPreset: 'surgical'
  });

  const handleUpdateSettings = (newSettings: Partial<ViewerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleAskAIFromHotspot = (question: string) => {
    setAiTutorInitialPrompt(question);
    setActiveTab('ai_tutor');
    setSelectedHotspot(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(14,165,233,0.5)]">
            <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1">
                GENESIS<span className="text-sky-500">VIEW</span>
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-sky-400">
                Atlas 3D
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Human Embryology & Developmental Anatomy Platform
            </p>
          </div>
        </div>

        {/* Center / Right Mode Selector & Quick Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Main Views Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              id="btn_tab_atlas"
              onClick={() => setActiveTab('atlas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'atlas'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(14,165,233,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Atlas</span>
            </button>

            <button
              id="btn_tab_systems"
              onClick={() => setActiveTab('systems')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'systems'
                  ? 'bg-rose-500 text-white font-bold shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Systems & Organs</span>
            </button>

            <button
              id="btn_tab_fatemap"
              onClick={() => setActiveTab('fatemap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'fatemap'
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Fate Map</span>
            </button>

            <button
              id="btn_tab_ultrasound"
              onClick={() => setActiveTab('ultrasound')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ultrasound'
                  ? 'bg-emerald-600 text-white font-bold shadow-[0_0_8px_rgba(5,150,105,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Ultrasound</span>
            </button>

            <button
              id="btn_tab_quiz"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Quizzes</span>
            </button>

            <button
              id="btn_tab_ai_tutor"
              onClick={() => setActiveTab('ai_tutor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ai_tutor'
                  ? 'bg-indigo-600 text-white font-bold shadow-[0_0_8px_rgba(79,70,229,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Tutor</span>
            </button>
          </nav>

          {/* Clinical Correlates Trigger Button */}
          <button
            id="btn_open_clinical_modal"
            onClick={() => setIsClinicalModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all shadow-md"
          >
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Clinical Cases</span>
          </button>

          {/* Quick 23-Stage Time-Lapse Mode Button in Header */}
          <button
            id="btn_open_timelapse_header"
            onClick={() => setIsTimeLapseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 border border-sky-500/50 text-sky-300 font-bold text-xs transition-all shadow-md shadow-sky-950/40"
            title="Launch Automated 23 Carnegie Stages Time-Lapse Playback"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="hidden sm:inline">Time-Lapse</span>
          </button>

          {/* Quick Compare Stages Button in Header */}
          <button
            id="btn_open_compare_overlay_header"
            onClick={() => {
              setCompareStageA(currentStage);
              setIsCompareOverlayOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/40 text-sky-300 font-semibold text-xs transition-all shadow-md"
            title="Open Comparative Chronological Organogenesis Matrix"
          >
            <Scale className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Compare Stages</span>
          </button>

          {/* Quick AR Mode Trigger Button in Header */}
          <button
            id="btn_open_ar_mode_header"
            onClick={() => setIsARModeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 border border-sky-500/50 text-sky-300 font-bold text-xs transition-all shadow-md shadow-sky-950/40"
            title="Project current 3D Embryo into physical environment via camera (Augmented Reality)"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="hidden sm:inline">AR</span>
          </button>

          {/* Quick VR Mode Trigger Button in Header */}
          <button
            id="btn_open_vr_mode_header"
            onClick={() => setIsVRModeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-sky-500/20 hover:from-purple-500/30 hover:to-sky-500/30 border border-purple-500/50 text-purple-300 font-bold text-xs transition-all shadow-md shadow-purple-950/40"
            title="Enter Full-Screen Immersive Virtual Reality (VR) Headset View"
          >
            <Glasses className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">VR Headset</span>
          </button>

          {/* Quick Glossary Trigger Button in Header */}
          <button
            id="btn_open_glossary_header"
            onClick={() => {
              setGlossarySearchQuery('');
              setIsGlossaryOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/40 text-sky-300 font-semibold text-xs transition-all shadow-md"
            title="Open Embryology Glossary & Medical Dictionary"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Glossary</span>
          </button>

          {/* Clinician / Researcher Avatar Badge */}
          <div 
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400 select-none shadow-inner"
            title="Clinician / Research View"
          >
            DR
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Active View Router */}
        {activeTab === 'atlas' && (
          <div className="space-y-5 animate-fade-in">
            {/* View Mode Toggle Header Bar: Search & Mode Select */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 px-4 py-2.5 rounded-2xl shadow-lg">
              {/* Carnegie Stage Search Bar */}
              <div className="w-full md:w-80">
                <CarnegieStageSearchBar
                  stages={EMBRYO_STAGES}
                  currentStage={currentStage}
                  onSelectStage={(stage) => {
                    setCurrentStage(stage);
                    setSelectedHotspot(null);
                  }}
                />
              </div>

              {/* Status and Split View Toggle */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 flex-1">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Active:
                  </span>
                  <span className="text-xs font-semibold text-sky-400">
                    Week {currentStage.week}
                    {currentStage.carnegieStage && ` (CS ${currentStage.carnegieStage})`}
                  </span>
                </div>

                {/* Time-Lapse Trigger */}
                <button
                  id="btn_open_timelapse_atlas"
                  onClick={() => setIsTimeLapseOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-md bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 text-sky-300 border-sky-500/50 shadow-sky-950/40"
                  title="Launch Automated 23 Carnegie Stages Time-Lapse Playback"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  <span>Time-Lapse (23 CS)</span>
                </button>

                {/* Compare Stages Overlay Trigger */}
                <button
                  id="btn_open_compare_stages_atlas"
                  onClick={() => {
                    setCompareStageA(currentStage);
                    setIsCompareOverlayOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-md bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 text-sky-300 border-sky-500/40"
                  title="Open Chronological Organogenesis Comparison Matrix"
                >
                  <Scale className="w-3.5 h-3.5 text-sky-400" />
                  <span>Compare Stages</span>
                </button>

                {/* AR Mode Trigger */}
                <button
                  id="btn_open_ar_mode_atlas"
                  onClick={() => setIsARModeOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-md bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 text-sky-300 border-sky-500/50 shadow-sky-950/40"
                  title="Project Embryo in Augmented Reality using Device Camera"
                >
                  <Camera className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  <span>AR</span>
                </button>

                {/* VR Headset Mode Trigger */}
                <button
                  id="btn_open_vr_mode_atlas"
                  onClick={() => setIsVRModeOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-md bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-sky-500/20 hover:from-purple-500/30 hover:to-sky-500/30 text-purple-300 border-purple-500/50 shadow-purple-950/40"
                  title="Enter Immersive Virtual Reality (VR) Headset Mode"
                >
                  <Glasses className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>VR Headset</span>
                </button>

                {/* Glossary Trigger */}
                <button
                  id="btn_open_glossary_atlas"
                  onClick={() => {
                    setGlossarySearchQuery('');
                    setIsGlossaryOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-md bg-slate-800/90 hover:bg-slate-750 text-sky-300 border-slate-700 hover:border-sky-500/40"
                  title="Browse Embryological Dictionary & Clinical Definitions"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span>Glossary</span>
                </button>

                <button
                  id="btn_toggle_split_view"
                  onClick={() => setIsSplitView(!isSplitView)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-md ${
                    isSplitView
                      ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.5)]'
                      : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700 hover:text-white'
                  }`}
                  title="Toggle Split-View to compare two Carnegie stages side-by-side"
                >
                  <Columns2 className={`w-3.5 h-3.5 ${isSplitView ? 'text-slate-950' : 'text-sky-400'}`} />
                  <span>{isSplitView ? 'Split-View Enabled' : '3D Split-View'}</span>
                </button>
              </div>
            </div>

            {/* Conditional Rendering: Split-View or Single Viewer */}
            {isSplitView ? (
              <SplitViewAtlas
                allStages={EMBRYO_STAGES}
                initialStageA={currentStage}
                onExitSplitView={() => setIsSplitView(false)}
                onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
                selectedHotspotId={selectedHotspot?.id}
                onOpenClinicalModal={() => setIsClinicalModalOpen(true)}
                onOpenCompareOverlay={(stgA, stgB) => {
                  setCompareStageA(stgA);
                  setCompareStageB(stgB);
                  setIsCompareOverlayOpen(true);
                }}
              />
            ) : (
              <>
                {/* 3D WebGL Embryo Stage Viewer */}
                <ThreeEmbryoViewer
                  currentStage={currentStage}
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
                  selectedHotspotId={selectedHotspot?.id}
                  allStages={EMBRYO_STAGES}
                  onStageSelect={(stg) => setCurrentStage(stg)}
                  onOpenARMode={() => setIsARModeOpen(true)}
                  onOpenVRMode={() => setIsVRModeOpen(true)}
                  onOpenTimeLapse={() => setIsTimeLapseOpen(true)}
                />

                {/* Growth Stage Timeline Scrubber */}
                <StageTimeline
                  stages={EMBRYO_STAGES}
                  currentStage={currentStage}
                  onSelectStage={(stage) => {
                    setCurrentStage(stage);
                    setSelectedHotspot(null);
                  }}
                  onOpenCarnegieTimeLapse={() => setIsTimeLapseOpen(true)}
                />

                {/* Germ Layer Specification & Interactive Organ Rudiments Section */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-sky-400" />
                        Germ Layer Specification at Week {currentStage.week} ({currentStage.title})
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Hover over each germ layer card below to dynamically highlight specific organ rudiments on the anatomical embryo map
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Active Layer:
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 transition-all ${
                        hoveredGermLayer === 'ectoderm' ? 'bg-sky-950/80 border-sky-500/60 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.3)]' :
                        hoveredGermLayer === 'mesoderm' ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]' :
                        hoveredGermLayer === 'endoderm' ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_8px_rgba(34,197,94,0.3)]' :
                        hoveredGermLayer === 'neural_crest' ? 'bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)]' :
                        'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}>
                        <span 
                          className="w-1.5 h-1.5 rounded-full animate-pulse" 
                          style={{ 
                            backgroundColor: 
                              hoveredGermLayer === 'ectoderm' ? '#38bdf8' :
                              hoveredGermLayer === 'mesoderm' ? '#f59e0b' :
                              hoveredGermLayer === 'endoderm' ? '#22c55e' :
                              hoveredGermLayer === 'neural_crest' ? '#c084fc' : '#94a3b8'
                          }} 
                        />
                        {hoveredGermLayer ? hoveredGermLayer.replace('_', ' ').toUpperCase() : 'ALL 3 GERM LAYERS'}
                      </span>
                    </div>
                  </div>

                  {/* 4 Interactive Germ Layer Cards with Hover Handlers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Ectoderm Card */}
                    <div 
                      id="card_germ_ectoderm"
                      onMouseEnter={() => setHoveredGermLayer('ectoderm')}
                      onMouseLeave={() => setHoveredGermLayer(null)}
                      className={`p-3.5 rounded-xl flex flex-col gap-1.5 transition-all duration-200 cursor-pointer border ${
                        hoveredGermLayer === 'ectoderm'
                          ? 'bg-sky-950/90 border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_16px_rgba(56,189,248,0.35)] -translate-y-1'
                          : 'bg-sky-950/20 hover:bg-sky-950/40 border-sky-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-sky-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                          <span>Ectoderm & Neuroectoderm</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-sky-900/60 text-sky-200 px-1.5 py-0.5 rounded border border-sky-500/30">
                          Outer
                        </span>
                      </div>
                      <p className="text-slate-300 leading-snug">{currentStage.germLayerHighlights.ectoderm}</p>
                      <div className="mt-auto pt-2 text-[10px] text-sky-400 font-mono flex items-center justify-between border-t border-sky-500/20">
                        <span className="truncate">Brain, Cord, Eye, Epidermis</span>
                        <span className="font-bold text-sky-300 ml-1">Highlight ➔</span>
                      </div>
                    </div>

                    {/* Mesoderm Card */}
                    <div 
                      id="card_germ_mesoderm"
                      onMouseEnter={() => setHoveredGermLayer('mesoderm')}
                      onMouseLeave={() => setHoveredGermLayer(null)}
                      className={`p-3.5 rounded-xl flex flex-col gap-1.5 transition-all duration-200 cursor-pointer border ${
                        hoveredGermLayer === 'mesoderm'
                          ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_16px_rgba(245,158,11,0.35)] -translate-y-1'
                          : 'bg-amber-950/20 hover:bg-amber-950/40 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span>Mesoderm (Somites & Cardio)</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-amber-900/60 text-amber-200 px-1.5 py-0.5 rounded border border-amber-500/30">
                          Middle
                        </span>
                      </div>
                      <p className="text-slate-300 leading-snug">{currentStage.germLayerHighlights.mesoderm}</p>
                      <div className="mt-auto pt-2 text-[10px] text-amber-400 font-mono flex items-center justify-between border-t border-amber-500/20">
                        <span className="truncate">Heart, Somites, Kidneys, Limbs</span>
                        <span className="font-bold text-amber-300 ml-1">Highlight ➔</span>
                      </div>
                    </div>

                    {/* Endoderm Card */}
                    <div 
                      id="card_germ_endoderm"
                      onMouseEnter={() => setHoveredGermLayer('endoderm')}
                      onMouseLeave={() => setHoveredGermLayer(null)}
                      className={`p-3.5 rounded-xl flex flex-col gap-1.5 transition-all duration-200 cursor-pointer border ${
                        hoveredGermLayer === 'endoderm'
                          ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_16px_rgba(34,197,94,0.35)] -translate-y-1'
                          : 'bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span>Endoderm (Gut & Organs)</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          Inner
                        </span>
                      </div>
                      <p className="text-slate-300 leading-snug">{currentStage.germLayerHighlights.endoderm}</p>
                      <div className="mt-auto pt-2 text-[10px] text-emerald-400 font-mono flex items-center justify-between border-t border-emerald-500/20">
                        <span className="truncate">Gut, Lungs, Liver, Pancreas</span>
                        <span className="font-bold text-emerald-300 ml-1">Highlight ➔</span>
                      </div>
                    </div>

                    {/* Neural Crest / Extraembryonic Card */}
                    <div 
                      id="card_germ_neural_crest"
                      onMouseEnter={() => setHoveredGermLayer('neural_crest')}
                      onMouseLeave={() => setHoveredGermLayer(null)}
                      className={`p-3.5 rounded-xl flex flex-col gap-1.5 transition-all duration-200 cursor-pointer border ${
                        hoveredGermLayer === 'neural_crest'
                          ? 'bg-purple-950/90 border-purple-400 ring-2 ring-purple-400/50 shadow-[0_0_16px_rgba(168,85,247,0.35)] -translate-y-1'
                          : 'bg-purple-950/20 hover:bg-purple-950/40 border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-purple-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                          <span>Neural Crest & Streams</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-purple-900/60 text-purple-200 px-1.5 py-0.5 rounded border border-purple-500/30">
                          4th Layer
                        </span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {currentStage.germLayerHighlights.neuralCrest || 'Extraembryonic vascular stalk, amnion & migratory neural crest stream.'}
                      </p>
                      <div className="mt-auto pt-2 text-[10px] text-purple-400 font-mono flex items-center justify-between border-t border-purple-500/20">
                        <span className="truncate">DRG, AP Septum, Adrenal Medulla</span>
                        <span className="font-bold text-purple-300 ml-1">Highlight ➔</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive SVG Organ Rudiments Diagram */}
                  <div className="pt-2">
                    <GermLayerRudimentDiagram
                      currentStage={currentStage}
                      activeHoverLayer={hoveredGermLayer}
                      onHoverLayer={(layer) => setHoveredGermLayer(layer)}
                      onSelectRudiment={(rudiment) => {
                        setSelectedHotspot(null);
                      }}
                    />
                  </div>

                  {/* Systems & Organs Development Deep Dive Link */}
                  <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      <span className="font-medium">
                        Deep dive into sequential organ development for <strong>{currentStage.title}</strong> across all 8 physiological systems.
                      </span>
                    </div>
                    <button
                      id="btn_explore_systems_from_atlas"
                      onClick={() => setActiveTab('systems')}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 hover:from-rose-500/30 hover:to-purple-500/30 border border-rose-500/50 text-rose-300 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto justify-center"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span>Explore Systems & Organs Development</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'systems' && (
          <div className="animate-fade-in">
            <OrganSystemsDevelopment
              onJumpToAtlasStage={(stage) => {
                setCurrentStage(stage);
                setActiveTab('atlas');
              }}
              onOpenGlossary={(termName) => {
                setGlossarySearchQuery(termName);
                setIsGlossaryOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'fatemap' && (
          <div className="animate-fade-in">
            <GermLayerFateMap />
          </div>
        )}

        {activeTab === 'ultrasound' && (
          <div className="animate-fade-in space-y-5">
            <UltrasoundViewPanel currentStage={currentStage} />
            <StageTimeline
              stages={EMBRYO_STAGES}
              currentStage={currentStage}
              onSelectStage={(stage) => setCurrentStage(stage)}
            />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="animate-fade-in">
            <EmbryoQuiz
              onOpenGlossary={(termName) => {
                setGlossarySearchQuery(termName);
                setIsGlossaryOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'ai_tutor' && (
          <div className="animate-fade-in space-y-5">
            <EmbryoAITutor
              currentStage={currentStage}
              initialQuestion={aiTutorInitialPrompt}
            />
          </div>
        )}
      </main>

      {/* Anatomical Landmark Details Drawer */}
      <AnatomyHotspotDetails
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
        onAskAI={handleAskAIFromHotspot}
        onOpenGlossary={(termName) => {
          setGlossarySearchQuery(termName);
          setIsGlossaryOpen(true);
        }}
      />

      {/* Clinical Correlates & Teratogens Encyclopedia Modal */}
      <ClinicalCorrelatesModal
        isOpen={isClinicalModalOpen}
        onClose={() => setIsClinicalModalOpen(false)}
      />

      {/* Embryology Medical Glossary & Dictionary Panel */}
      <EmbryologyGlossaryPanel
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        initialSearchQuery={glossarySearchQuery}
      />

      {/* Floating Persistent Quick Glossary Trigger Button */}
      <button
        id="btn_floating_quick_glossary"
        onClick={() => {
          setGlossarySearchQuery('');
          setIsGlossaryOpen(true);
        }}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-2xl shadow-sky-500/30 border border-sky-400/40 hover:scale-105 active:scale-95 transition-all group"
        title="Open Medical Glossary & Terminology Index"
      >
        <BookOpen className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
        <span className="tracking-wide">Embryology Glossary</span>
      </button>

      {/* Comparative Chronological Organogenesis Overlay */}
      <CompareStagesOverlay
        isOpen={isCompareOverlayOpen}
        onClose={() => setIsCompareOverlayOpen(false)}
        stages={EMBRYO_STAGES}
        initialStageA={compareStageA}
        initialStageB={compareStageB}
        onOpenSplitView={(stgA, stgB) => {
          setCurrentStage(stgA);
          setCompareStageA(stgA);
          setCompareStageB(stgB);
          setIsSplitView(true);
          setActiveTab('atlas');
        }}
        onAskAITutor={(prompt) => {
          setAiTutorInitialPrompt(prompt);
          setActiveTab('ai_tutor');
        }}
      />

      {/* Augmented Reality (AR) 3D Embryo Projection Viewer */}
      <AugmentedRealityViewer
        isOpen={isARModeOpen}
        onClose={() => setIsARModeOpen(false)}
        currentStage={currentStage}
        allStages={EMBRYO_STAGES}
        onSelectStage={(stg) => {
          setCurrentStage(stg);
          setSelectedHotspot(null);
        }}
        onSelectHotspot={(hs) => setSelectedHotspot(hs)}
      />

      {/* Virtual Reality (VR) Immersive Headset 3D Viewer */}
      <VirtualRealityViewer
        isOpen={isVRModeOpen}
        onClose={() => setIsVRModeOpen(false)}
        currentStage={currentStage}
        allStages={EMBRYO_STAGES}
        onSelectStage={(stg) => {
          setCurrentStage(stg);
          setSelectedHotspot(null);
        }}
        onSelectHotspot={(hs) => setSelectedHotspot(hs)}
      />

      {/* Automated 23 Carnegie Stages Time-Lapse Player Overlay */}
      <CarnegieTimeLapsePlayer
        isOpen={isTimeLapseOpen}
        onClose={() => setIsTimeLapseOpen(false)}
        currentStage={currentStage}
        onSelectStage={(stg) => {
          setCurrentStage(stg);
          setSelectedHotspot(null);
        }}
        isAutoOrbit={settings.autoRotate}
        onToggleAutoOrbit={(active) => handleUpdateSettings({ autoRotate: active })}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/90 px-4 lg:px-8 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <p>© 2026 Embryo3D Educational Atlas • Human Embryology, Carnegie Stages & Teratology</p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Carnegie Stages 1–23</span>
            <span>•</span>
            <span>Week 1 to 38+ Milestones</span>
            <span>•</span>
            <span>USMLE / Board-Ready Curriculum</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
