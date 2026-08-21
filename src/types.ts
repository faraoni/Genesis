export type GermLayer = 'ectoderm' | 'mesoderm' | 'endoderm' | 'neural_crest' | 'extraembryonic';

export type Trimester = 'Pre-Embryonic' | 'Embryonic' | 'First Trimester' | 'Second Trimester' | 'Third Trimester';

export interface HotspotPin {
  id: string;
  name: string;
  position: [number, number, number]; // 3D coordinates
  germLayer: GermLayer;
  shortDesc: string;
  fullDesc: string;
  clinicalSignificance: string;
  molecularSignaling?: string;
  fateAdultOrgans: string[];
}

export interface EmbryoStage {
  id: string;
  week: number;
  dayStart: number;
  dayEnd: number;
  carnegieStage?: number | string;
  title: string;
  subtitle: string;
  trimester: Trimester;
  crlMm: number; // Crown-Rump Length in mm
  weightGrams?: number;
  heartRateBpm?: number;
  sizeAnalogy: string;
  sizeAnalogyIcon?: string;
  keyEvents: string[];
  morphogens: string[];
  germLayerHighlights: {
    ectoderm: string;
    mesoderm: string;
    endoderm: string;
    neuralCrest?: string;
  };
  ultrasoundFeatures: {
    visibleStructures: string[];
    bpdMm?: number; // Biparietal diameter
    crlMm?: number;
    gestationalSacMm?: number;
    dopplerNotes: string;
  };
  hotspots: HotspotPin[];
  modelType: 
    | 'zygote'
    | 'cleavage'
    | 'morula'
    | 'blastocyst'
    | 'bilaminar'
    | 'trilaminar_gastrula'
    | 'neurula_week4'
    | 'organogenesis_week5'
    | 'organogenesis_week6'
    | 'fetus_week8'
    | 'fetus_week12'
    | 'fetus_week20'
    | 'fetus_week28'
    | 'term_week38';
}

export interface GermLayerNode {
  id: string;
  name: string;
  layer: GermLayer;
  color: string;
  description: string;
  derivatives: {
    system: string;
    structures: string[];
  }[];
  keyGenes: string[];
  clinicalDefects: string[];
}

export interface ClinicalCondition {
  id: string;
  name: string;
  category: 'Cardiovascular' | 'Neural & Craniofacial' | 'Gastrointestinal' | 'Urogenital' | 'Musculoskeletal' | 'Teratology';
  criticalPeriodWeeks: string;
  incidence: string;
  embryologicalBasis: string;
  clinicalPresentation: string;
  ultrasoundOrDiagnosticFindings: string[];
  molecularMechanism: string;
  associatedGenesOrTeratogens: string[];
}

export interface QuizQuestion {
  id: string;
  vignette: string;
  imageHint?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  embryologicalMilestone: string;
  highYieldFact: string;
}

export interface ViewerSettings {
  showEctoderm: boolean;
  showMesoderm: boolean;
  showEndoderm: boolean;
  showCardiovascular: boolean;
  showNervousSystem: boolean;
  showHotspots: boolean;
  wireframe: boolean;
  cutawayPlane: 'none' | 'sagittal' | 'transverse' | 'coronal';
  cutawayOffset: number;
  ultrasoundMode: boolean;
  ultrasoundGain: number;
  autoRotate: boolean;
  heartbeatAnimate: boolean;
  lightingPreset: 'surgical' | 'warm_lab' | 'ultrasound_luminescence' | 'high_contrast';
}
