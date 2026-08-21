import React, { useState, useCallback } from 'react';
import { EmbryoStage, HotspotPin, ViewerSettings } from '../types';
import { ThreeEmbryoViewer } from './ThreeEmbryoViewer';
import { 
  Columns2, 
  Link2, 
  Unlink2, 
  ArrowLeftRight, 
  Sparkles, 
  Activity, 
  Layers, 
  Scale, 
  Dna, 
  Baby, 
  Check, 
  ChevronRight, 
  Info,
  Maximize2,
  X,
  Zap,
  Split
} from 'lucide-react';

interface Props {
  allStages: EmbryoStage[];
  initialStageA: EmbryoStage;
  initialStageB?: EmbryoStage;
  onExitSplitView: () => void;
  onSelectHotspot: (hotspot: HotspotPin) => void;
  selectedHotspotId?: string;
  onOpenClinicalModal?: () => void;
  onOpenCompareOverlay?: (stageA: EmbryoStage, stageB: EmbryoStage) => void;
}

interface CameraSyncState {
  position: [number, number, number];
  target: [number, number, number];
  senderId: string;
}

interface PresetComparison {
  title: string;
  stageAId: string;
  stageBId: string;
  tag: string;
  description: string;
}

export const SplitViewAtlas: React.FC<Props> = ({
  allStages,
  initialStageA,
  initialStageB,
  onExitSplitView,
  onSelectHotspot,
  selectedHotspotId,
  onOpenClinicalModal,
  onOpenCompareOverlay
}) => {
  // Find default stage B (e.g. Week 8 Embryonic Period Term or another stage)
  const defaultStageB = initialStageB || 
    allStages.find((s) => s.id === 'stage_w8_embryo_term') || 
    allStages[allStages.length - 1];

  const [stageA, setStageA] = useState<EmbryoStage>(initialStageA);
  const [stageB, setStageB] = useState<EmbryoStage>(defaultStageB);
  const [isSyncCamera, setIsSyncCamera] = useState<boolean>(true);
  const [cameraSyncState, setCameraSyncState] = useState<CameraSyncState | null>(null);

  // Viewer Settings for Left and Right Viewers
  const [settingsA, setSettingsA] = useState<ViewerSettings>({
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

  const [settingsB, setSettingsB] = useState<ViewerSettings>({
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

  // Camera change sync handler
  const handleCameraChange = useCallback((camState: { position: [number, number, number]; target: [number, number, number]; senderId: string }) => {
    if (!isSyncCamera) return;
    setCameraSyncState(camState);
  }, [isSyncCamera]);

  // Swap Stage A and Stage B
  const handleSwapStages = () => {
    const tempStage = stageA;
    setStageA(stageB);
    setStageB(tempStage);
  };

  // Preset Comparisons
  const PRESET_COMPARISONS: PresetComparison[] = [
    {
      title: 'Week 3 vs Week 4: Gastrulation to Neurulation',
      tag: 'CS 7-8 vs CS 10-12',
      stageAId: 'stage_w3_gastrula',
      stageBId: 'stage_w4_neurula',
      description: 'Trilaminar disc conversion to neural tube closure and first rhythmic cardiovascular contractions.'
    },
    {
      title: 'Week 4 vs Week 8: Organogenesis Span',
      tag: 'CS 10 vs CS 23',
      stageAId: 'stage_w4_neurula',
      stageBId: 'stage_w8_embryo_term',
      description: 'Primitive C-shaped embryonic body with pharyngeal arches transforming into recognizably human fetal phenotype with separated digits.'
    },
    {
      title: 'Week 4 vs Week 6: Branchial & Cardiac Looping',
      tag: 'CS 10 vs CS 17',
      stageAId: 'stage_w4_neurula',
      stageBId: 'stage_w6_digital_rays',
      description: 'Primitive tubular heart and somites advancing to septating cardiac chambers, paddle buds, and retinal pigment.'
    },
    {
      title: 'Week 8 vs Week 12: Embryonic to Fetal Transition',
      tag: 'CS 23 vs Fetal Wk 12',
      stageAId: 'stage_w8_embryo_term',
      stageBId: 'stage_w12_early_fetus',
      description: 'Completion of primary organogenesis to active fetal movement, primary ossification centers, and secondary palate fusion.'
    },
    {
      title: 'Week 1 vs Week 2: Cleavage to Bilaminar Disc',
      tag: 'CS 1 vs CS 5',
      stageAId: 'stage_w1_zygote',
      stageBId: 'stage_w2_bilaminar',
      description: 'Totipotent cleavage zygote to rule-of-twos bilaminar embryonic disc and implantation.'
    }
  ];

  const applyPreset = (preset: PresetComparison) => {
    const sA = allStages.find((s) => s.id === preset.stageAId);
    const sB = allStages.find((s) => s.id === preset.stageBId);
    if (sA) setStageA(sA);
    if (sB) setStageB(sB);
  };

  // Comparative Morphometric Calculations
  const crlDelta = (stageB.crlMm - stageA.crlMm).toFixed(2);
  const crlGrowthRatio = stageA.crlMm > 0 
    ? ((stageB.crlMm / stageA.crlMm)).toFixed(1)
    : 'N/A';
  const weekDelta = Math.abs(stageB.week - stageA.week);
  const daysDelta = Math.abs(stageB.dayStart - stageA.dayStart);

  return (
    <div id="split_view_container" className="space-y-6">
      {/* Top Split-View Action Header */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-inner">
            <Columns2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">Comparative Dual-Embryo Split-View</h2>
              <span className="bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active Compare
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side synchronized 3D morphometric comparison of Carnegie developmental stages.
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Synchronize 3D Camera Rotation Toggle */}
          <button
            id="btn_toggle_sync_camera"
            onClick={() => setIsSyncCamera(!isSyncCamera)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-lg ${
              isSyncCamera
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sky-950/40'
                : 'bg-slate-800/90 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isSyncCamera ? "Cameras are synchronized in 3D orbit" : "Cameras rotate independently"}
          >
            {isSyncCamera ? (
              <>
                <Link2 className="w-3.5 h-3.5 text-sky-400" />
                <span>3D Cameras Synced</span>
              </>
            ) : (
              <>
                <Unlink2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Independent Orbits</span>
              </>
            )}
          </button>

          {/* Swap Stage A & Stage B */}
          <button
            id="btn_swap_stages"
            onClick={handleSwapStages}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-md"
            title="Swap Stage A and Stage B positions"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Swap Stages</span>
          </button>

          {/* Open Full Organogenesis Comparison Overlay */}
          {onOpenCompareOverlay && (
            <button
              id="btn_open_compare_overlay_from_split"
              onClick={() => onOpenCompareOverlay(stageA, stageB)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-semibold transition-all shadow-md"
              title="Open scrollable chronological organogenesis comparison matrix"
            >
              <Scale className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Comparison Matrix</span>
            </button>
          )}

          {/* Exit Split-View */}
          <button
            id="btn_exit_split_view"
            onClick={onExitSplitView}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-md"
            title="Return to standard single embryo view"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>Close Split-View</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Comparisons Bar */}
      <div className="bg-slate-900/60 border border-slate-800/90 p-3 rounded-xl flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
        <span className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5 flex-shrink-0 px-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          High-Yield Case Presets:
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {PRESET_COMPARISONS.map((p, idx) => {
            const isCurrentMatch = 
              (stageA.id === p.stageAId && stageB.id === p.stageBId) ||
              (stageA.id === p.stageBId && stageB.id === p.stageAId);
            return (
              <button
                key={idx}
                id={`btn_preset_${idx}`}
                onClick={() => applyPreset(p)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                  isCurrentMatch
                    ? 'bg-sky-500/20 text-sky-300 font-bold border-sky-500/40 shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-750 hover:text-white'
                }`}
                title={p.description}
              >
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950/60 rounded text-amber-300 font-bold">
                  {p.tag}
                </span>
                <span>{p.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Dual 3D Viewers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Panel A: Stage A Viewer */}
        <div id="split_panel_a" className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300">
                PANE A (STAGE 1)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {stageA.carnegieStage ? `Carnegie Stage ${stageA.carnegieStage}` : stageA.trimester}
            </span>
          </div>

          <ThreeEmbryoViewer
            currentStage={stageA}
            settings={settingsA}
            onUpdateSettings={(newSettings) => setSettingsA((prev) => ({ ...prev, ...newSettings }))}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
            viewerId="viewer_a"
            viewerLabel="PANE_A_VIEWPORT"
            isSplitView={true}
            onCameraChange={handleCameraChange}
            cameraSyncState={cameraSyncState}
            onStageSelect={setStageA}
            allStages={allStages}
          />
        </div>

        {/* Panel B: Stage B Viewer */}
        <div id="split_panel_b" className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                PANE B (STAGE 2)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {stageB.carnegieStage ? `Carnegie Stage ${stageB.carnegieStage}` : stageB.trimester}
            </span>
          </div>

          <ThreeEmbryoViewer
            currentStage={stageB}
            settings={settingsB}
            onUpdateSettings={(newSettings) => setSettingsB((prev) => ({ ...prev, ...newSettings }))}
            onSelectHotspot={onSelectHotspot}
            selectedHotspotId={selectedHotspotId}
            viewerId="viewer_b"
            viewerLabel="PANE_B_VIEWPORT"
            isSplitView={true}
            onCameraChange={handleCameraChange}
            cameraSyncState={cameraSyncState}
            onStageSelect={setStageB}
            allStages={allStages}
          />
        </div>
      </div>

      {/* Comparative Morphological Differential Analysis Matrix */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Morphological Differential Matrix
                <span className="text-xs font-mono font-normal text-slate-400">
                  (Week {stageA.week} vs Week {stageB.week})
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparative analysis of anatomical transformations, signaling morphogens, and clinical embryology milestones.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 uppercase text-[10px]">Delta:</span>
              <span className="text-sky-300 font-bold">+{weekDelta} Weeks ({daysDelta} Days)</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 uppercase text-[10px]">CRL Factor:</span>
              <span className="text-emerald-300 font-bold">{crlGrowthRatio}x ({crlDelta} mm)</span>
            </div>
          </div>
        </div>

        {/* Detailed Side-by-Side Milestone Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stage A Breakdown Card */}
          <div className="bg-slate-950/70 border border-sky-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-mono text-[11px] font-bold rounded">
                  Pane A • Week {stageA.week}
                </span>
                {stageA.carnegieStage && (
                  <span className="px-2 py-0.5 bg-slate-800 text-amber-300 font-mono text-[11px] rounded">
                    CS {stageA.carnegieStage}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-white font-mono">{stageA.crlMm} mm</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">{stageA.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{stageA.subtitle}</p>
            </div>

            {/* Key Developmental Events */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Hallmark Developmental Events:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {stageA.keyEvents.map((evt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cardiovascular & Molecular Profile */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-rose-400" />
                  Heart Rhythm:
                </span>
                <span className="font-mono text-white font-semibold">
                  {stageA.heartRateBpm ? `${stageA.heartRateBpm} BPM` : 'Pre-Cardiogenic'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                  <Dna className="w-3 h-3 text-amber-400" />
                  Key Morphogens:
                </span>
                <span className="font-mono text-[11px] text-amber-300 text-right">
                  {stageA.morphogens.join(', ')}
                </span>
              </div>
            </div>

            {/* Germ Layer Specifications */}
            <div className="space-y-1 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Germ Layer Lineages:</span>
              <p><strong className="text-sky-300 font-medium">Ectoderm:</strong> <span className="text-slate-300">{stageA.germLayerHighlights.ectoderm}</span></p>
              <p><strong className="text-amber-300 font-medium">Mesoderm:</strong> <span className="text-slate-300">{stageA.germLayerHighlights.mesoderm}</span></p>
              <p><strong className="text-emerald-300 font-medium">Endoderm:</strong> <span className="text-slate-300">{stageA.germLayerHighlights.endoderm}</span></p>
            </div>
          </div>

          {/* Stage B Breakdown Card */}
          <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold rounded">
                  Pane B • Week {stageB.week}
                </span>
                {stageB.carnegieStage && (
                  <span className="px-2 py-0.5 bg-slate-800 text-amber-300 font-mono text-[11px] rounded">
                    CS {stageB.carnegieStage}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-white font-mono">{stageB.crlMm} mm</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">{stageB.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{stageB.subtitle}</p>
            </div>

            {/* Key Developmental Events */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Hallmark Developmental Events:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {stageB.keyEvents.map((evt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cardiovascular & Molecular Profile */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-rose-400" />
                  Heart Rhythm:
                </span>
                <span className="font-mono text-white font-semibold">
                  {stageB.heartRateBpm ? `${stageB.heartRateBpm} BPM` : 'Pre-Cardiogenic'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-400 text-[11px] flex items-center gap-1.5 flex-shrink-0">
                  <Dna className="w-3 h-3 text-amber-400" />
                  Key Morphogens:
                </span>
                <span className="font-mono text-[11px] text-amber-300 text-right">
                  {stageB.morphogens.join(', ')}
                </span>
              </div>
            </div>

            {/* Germ Layer Specifications */}
            <div className="space-y-1 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Germ Layer Lineages:</span>
              <p><strong className="text-sky-300 font-medium">Ectoderm:</strong> <span className="text-slate-300">{stageB.germLayerHighlights.ectoderm}</span></p>
              <p><strong className="text-amber-300 font-medium">Mesoderm:</strong> <span className="text-slate-300">{stageB.germLayerHighlights.mesoderm}</span></p>
              <p><strong className="text-emerald-300 font-medium">Endoderm:</strong> <span className="text-slate-300">{stageB.germLayerHighlights.endoderm}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
