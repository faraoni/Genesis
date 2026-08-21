import React, { useState } from 'react';
import { GermLayer, EmbryoStage } from '../types';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Info, 
  Activity, 
  Dna, 
  CheckCircle2, 
  Maximize2,
  Compass
} from 'lucide-react';

export interface OrganRudiment {
  id: string;
  name: string;
  germLayer: GermLayer;
  subCategory: string;
  weekEmergence: number;
  carnegieStage: number | string;
  description: string;
  adultDerivatives: string[];
  keyMolecularSignals: string[];
  clinicalSignificance: string;
  svgPos: { x: number; y: number }; // Anchor coordinates for labels/tooltips
}

export const ORGAN_RUDIMENTS: OrganRudiment[] = [
  // ECTODERM & NEUROECTODERM
  {
    id: 'forebrain_vesicle',
    name: 'Telencephalon & Diencephalon (Prosencephalon)',
    germLayer: 'ectoderm',
    subCategory: 'Neuroectoderm (Neural Tube)',
    weekEmergence: 4,
    carnegieStage: 'CS 10-13',
    description: 'Cranial expansion of the neural tube forming cerebral hemispheres, thalamus, hypothalamus, and epithalamus.',
    adultDerivatives: ['Cerebral cortex & subcortical nuclei', 'Thalamus, Hypothalamus & Epithalamus', 'Optic vesicles & neuroretina'],
    keyMolecularSignals: ['SHH (ventralizing)', 'Wnt / BMP (dorsalizing)', 'FGF8 (anterior organizer)'],
    clinicalSignificance: 'Holoprosencephaly (failure of forebrain hemisphere bifurcation due to SHH mutations or cyclopamine teratogen).',
    svgPos: { x: 230, y: 110 }
  },
  {
    id: 'midbrain_vesicle',
    name: 'Mesencephalon (Midbrain)',
    germLayer: 'ectoderm',
    subCategory: 'Neuroectoderm (Neural Tube)',
    weekEmergence: 4,
    carnegieStage: 'CS 11-13',
    description: 'Middle brain vesicle giving rise to superior and inferior colliculi, cerebral peduncles, and the cerebral aqueduct of Sylvius.',
    adultDerivatives: ['Superior and inferior colliculi', 'Substantia nigra & Red nucleus', 'Cerebral aqueduct'],
    keyMolecularSignals: ['FGF8 / WNT1 (Isthmic organizer)', 'PAX2/PAX5'],
    clinicalSignificance: 'Aqueductal Stenosis leading to non-communicating congenital hydrocephalus.',
    svgPos: { x: 320, y: 80 }
  },
  {
    id: 'hindbrain_vesicle',
    name: 'Rhombencephalon (Pons, Cerebellum, Medulla)',
    germLayer: 'ectoderm',
    subCategory: 'Neuroectoderm (Neural Tube)',
    weekEmergence: 4,
    carnegieStage: 'CS 10-14',
    description: 'Subdivided into Metencephalon (pons and cerebellum) and Myelencephalon (medulla oblongata) with 8 rhombomeres.',
    adultDerivatives: ['Cerebellar hemispheres & vermis', 'Pons & Medulla oblongata', '4th ventricle & choroid plexus'],
    keyMolecularSignals: ['HOX gene combinatorial code (rhombomeric segmentation)', 'Retinoic Acid gradient'],
    clinicalSignificance: 'Dandy-Walker malformation (agenesis of cerebellar vermis & cystic dilation of 4th ventricle); Chiari malformations.',
    svgPos: { x: 420, y: 110 }
  },
  {
    id: 'neural_tube_spinal_cord',
    name: 'Neural Tube & Primitive Spinal Cord',
    germLayer: 'ectoderm',
    subCategory: 'Neuroectoderm (Neural Tube)',
    weekEmergence: 3,
    carnegieStage: 'CS 9-12',
    description: 'Closed dorsal cylinder with alar (sensory) and basal (motor) plates separated by the sulcus limitans.',
    adultDerivatives: ['Spinal cord gray & white matter', 'Motor neurons of ventral horn', 'Central canal ependymal lining'],
    keyMolecularSignals: ['Notochord SHH (floor plate)', 'Ectodermal BMP4/7 (roof plate)'],
    clinicalSignificance: 'Neural Tube Defects (Spina bifida occulta, meningocele, myelomeningocele) due to folate deficiency or maternal hyperglycemia.',
    svgPos: { x: 470, y: 220 }
  },
  {
    id: 'optic_cup_placode',
    name: 'Optic Cup & Lens Placode',
    germLayer: 'ectoderm',
    subCategory: 'Sensory Ectoderm & Neuroectoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 11-14',
    description: 'Evagination of the diencephalic neuroectoderm induces overlying surface ectoderm to form the lens vesicle.',
    adultDerivatives: ['Retina (sensory & pigment layer)', 'Optic nerve', 'Crystalline lens & corneal epithelium'],
    keyMolecularSignals: ['PAX6 (master eye gene)', 'SOX2', 'FGF signaling'],
    clinicalSignificance: 'Anophthalmia, Microphthalmia, Congenital cataracts (Rubella teratogenesis), Coloboma (optic fissure closure failure).',
    svgPos: { x: 190, y: 155 }
  },
  {
    id: 'otic_vesicle',
    name: 'Otic Placode & Otocyst (Inner Ear)',
    germLayer: 'ectoderm',
    subCategory: 'Surface Ectoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 10-12',
    description: 'Thickened surface ectoderm invaginating into the otocyst to form the membranous labyrinth of the inner ear.',
    adultDerivatives: ['Cochlear duct (Organ of Corti)', 'Semicircular canals, Utricle & Saccule', 'Endolymphatic sac'],
    keyMolecularSignals: ['FGF3 / FGF10 (hindbrain induction)', 'PAX2'],
    clinicalSignificance: 'Congenital sensorineural deafness (CMV infection, rubella, Pendred syndrome, GJB2/connexin 26 mutations).',
    svgPos: { x: 360, y: 145 }
  },
  {
    id: 'surface_epidermis_rathke',
    name: 'Surface Ectoderm & Rathke\'s Pouch',
    germLayer: 'ectoderm',
    subCategory: 'Surface Ectoderm',
    weekEmergence: 3,
    carnegieStage: 'CS 10-14',
    description: 'External embryonic covering and stomodeum roof evagination toward the infundibulum.',
    adultDerivatives: ['Epidermis of skin, hair, nails, sweat glands', 'Anterior pituitary (Adenohypophysis)', 'Tooth enamel'],
    keyMolecularSignals: ['BMP4', 'p63', 'EDAR / Ectodysplasin'],
    clinicalSignificance: 'Craniopharyngioma (benign suprasellar tumor with motor oil fluid from Rathke pouch remnants); Ectodermal dysplasia.',
    svgPos: { x: 235, y: 195 }
  },

  // MESODERM
  {
    id: 'cardiogenic_heart_tube',
    name: 'Primary Heart Tube & Cardiogenic Field',
    germLayer: 'mesoderm',
    subCategory: 'Lateral Plate Splanchnic Mesoderm',
    weekEmergence: 3,
    carnegieStage: 'CS 9-11',
    description: 'Splanchnic mesoderm forming endocardial tubes that fuse into a pulsating single tube with 5 primitive chambers.',
    adultDerivatives: ['Endocardium, Myocardium, Epicardium', 'Left & Right Ventricles & Atria', 'Ascending Aorta & Pulmonary Trunk'],
    keyMolecularSignals: ['NKX2-5 (master cardiac regulator)', 'GATA4', 'MEF2C', 'TBX5', 'BMP2/FGF8'],
    clinicalSignificance: 'Ventricular Septal Defect (VSD), Transposition of Great Arteries, D-looping failure (Dextrocardia in Kartagener syndrome).',
    svgPos: { x: 275, y: 265 }
  },
  {
    id: 'aortic_arches_mesoderm',
    name: 'Aortic Arches & Dorsal Aortae',
    germLayer: 'mesoderm',
    subCategory: 'Lateral Plate & Branchial Mesoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 11-15',
    description: 'Six pairs of arterial arches remodeling into the definitive systemic and pulmonary arterial vasculature.',
    adultDerivatives: ['Arch of Aorta (left 4th)', 'Pulmonary Arteries & Ductus Arteriosus (left 6th)', 'Common Carotid Arteries (3rd arch)'],
    keyMolecularSignals: ['VEGF / VEGFR2', 'PDGF', 'Notch signaling'],
    clinicalSignificance: 'Coarctation of the Aorta, Patent Ductus Arteriosus (PDA), Double Aortic Arch (tracheoesophageal vascular ring).',
    svgPos: { x: 335, y: 235 }
  },
  {
    id: 'paraxial_somites',
    name: 'Paraxial Somites (Sclerotome, Myotome, Dermatome)',
    germLayer: 'mesoderm',
    subCategory: 'Paraxial Mesoderm',
    weekEmergence: 3,
    carnegieStage: 'CS 9-14',
    description: 'Segmented blocks alongside neural tube giving rise to axial skeleton, skeletal musculature, and dorsal dermis.',
    adultDerivatives: ['Vertebrae & ribs (Sclerotome)', 'Axial and limb skeletal muscle (Myotome)', 'Dermis of back (Dermatome)'],
    keyMolecularSignals: ['Notch/HES1 (segmentation clock)', 'PAX1 (sclerotome)', 'MYOD1 / MYF5 (myotome)'],
    clinicalSignificance: 'Congenital scoliosis, Hemivertebrae, Klippel-Feil anomaly, Poland anomaly.',
    svgPos: { x: 440, y: 270 }
  },
  {
    id: 'intermediate_mesonephros',
    name: 'Intermediate Mesoderm (Nephrogenic Cord & Mesonephros)',
    germLayer: 'mesoderm',
    subCategory: 'Intermediate Mesoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 10-15',
    description: 'Urogenital ridge forming pronephros, mesonephros (with Wolffian duct), and metanephric blastema for definitive kidneys.',
    adultDerivatives: ['Metanephric kidneys (glomeruli & nephrons)', 'Ureter, renal pelvis, calyces (via ureteric bud)', 'Testes/Ovaries & male reproductive ducts'],
    keyMolecularSignals: ['WT1 (Wilms tumor 1)', 'PAX2', 'GDNF / c-RET (ureteric bud branching)', 'Lim1'],
    clinicalSignificance: 'Potter Sequence & Renal Agenesis, Horseshoe Kidney (trapped under IMA), Duplex collecting system.',
    svgPos: { x: 375, y: 315 }
  },
  {
    id: 'limb_buds_mesoderm',
    name: 'Upper & Lower Limb Buds (AER & ZPA)',
    germLayer: 'mesoderm',
    subCategory: 'Lateral Plate Somatic Mesoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 12-14',
    description: 'Somatic lateral plate mesenchyme core with overlying Apical Ectodermal Ridge (AER) and Zone of Polarizing Activity (ZPA).',
    adultDerivatives: ['Limb skeleton (humerus, radius, ulna, femur, tibia, fibula)', 'Joints, tendons, and deep fascia of extremities'],
    keyMolecularSignals: ['FGF8/FGF4 (AER: proximal-distal)', 'SHH (ZPA: anterior-posterior)', 'WNT7A (dorsal-ventral)'],
    clinicalSignificance: 'Phocomelia / Amelia (Thalidomide teratogenesis inhibiting FGF/angiogenesis), Polydactyly, Syndactyly (apoptosis failure).',
    svgPos: { x: 295, y: 360 }
  },

  // ENDODERM
  {
    id: 'pharyngeal_pouches_endoderm',
    name: 'Pharyngeal Pouches (1st to 4th)',
    germLayer: 'endoderm',
    subCategory: 'Foregut Cranial Endoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 10-14',
    description: 'Lateral endodermal outpocketings of the primitive pharynx lining the inner branchial apparatus.',
    adultDerivatives: ['Eustachian tube & middle ear (Pouch 1)', 'Palatine tonsil crypts (Pouch 2)', 'Thymus & Inferior Parathyroids (Pouch 3)', 'Superior Parathyroids & Ultimobranchial body (Pouch 4)'],
    keyMolecularSignals: ['FGF8', 'SHH', 'PAX9', 'HOX genes'],
    clinicalSignificance: 'DiGeorge Syndrome (22q11 deletion with 3rd/4th pouch aplasia -> hypocalcemia & absent T-cell immunity); Branchial fistulas.',
    svgPos: { x: 260, y: 200 }
  },
  {
    id: 'thyroid_diverticulum',
    name: 'Thyroid Diverticulum',
    germLayer: 'endoderm',
    subCategory: 'Foregut Pharyngeal Endoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 10-12',
    description: 'Epithelial proliferation in the floor of the pharynx at the foramen cecum that migrates down the thyroglossal duct.',
    adultDerivatives: ['Follicular cells of Thyroid Gland (T3/T4 hormone production)'],
    keyMolecularSignals: ['TTF-1 (NKX2-1)', 'PAX8', 'FOXE1'],
    clinicalSignificance: 'Thyroglossal Duct Cyst (midline neck mass moving with tongue protrusion), Lingual Thyroid, Congenital Hypothyroidism.',
    svgPos: { x: 285, y: 220 }
  },
  {
    id: 'lung_buds_respiratory',
    name: 'Laryngotracheal Diverticulum & Lung Buds',
    germLayer: 'endoderm',
    subCategory: 'Foregut Ventral Endoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 11-13',
    description: 'Ventral outpouching of foregut partitioned by the tracheoesophageal septum into trachea and bilateral bronchial buds.',
    adultDerivatives: ['Epithelium of Larynx, Trachea, Bronchi', 'Alveolar Type I & Type II Pneumocytes (Surfactant production)'],
    keyMolecularSignals: ['TBX4 (lung bud induction)', 'FGF10 (bronchial branching)', 'SHH/BMP4 (epithelial-mesenchymal cross-talk)'],
    clinicalSignificance: 'Tracheoesophageal Fistula (TEF) with Esophageal Atresia (Type C with distal fistula causing polyhydramnios and choking on first feed).',
    svgPos: { x: 310, y: 275 }
  },
  {
    id: 'foregut_stomach_liver_pancreas',
    name: 'Foregut: Stomach, Liver Bud & Pancreatic Buds',
    germLayer: 'endoderm',
    subCategory: 'Foregut & Midgut Endoderm',
    weekEmergence: 4,
    carnegieStage: 'CS 11-14',
    description: 'Foregut dilation rotating 90° clockwise, hepatic diverticulum invading septum transversum, and ventral/dorsal pancreatic buds.',
    adultDerivatives: ['Esophagus, Stomach, Duodenum (1st & 2nd parts)', 'Hepatocytes & Gallbladder epithelium', 'Pancreatic Acinar cells & Islets of Langerhans'],
    keyMolecularSignals: ['PDX1 (pancreas master regulator)', 'FOXA2', 'HNF4A (hepatic differentiation)'],
    clinicalSignificance: 'Annular Pancreas (bifid ventral bud encircling duodenum -> non-bilious/bilious vomiting), Biliary Atresia, Duodenal Atresia.',
    svgPos: { x: 330, y: 340 }
  },
  {
    id: 'midgut_hindgut_loops',
    name: 'Midgut Loop, Vitelline Duct & Hindgut Cloaca',
    germLayer: 'endoderm',
    subCategory: 'Midgut & Hindgut Endoderm',
    weekEmergence: 5,
    carnegieStage: 'CS 13-16',
    description: 'U-shaped midgut loop herniating through umbilical ring at week 6, rotating 270° counter-clockwise before returning by week 10.',
    adultDerivatives: ['Jejunum, Ileum, Cecum, Appendix, Ascending colon, Proximal 2/3 of Transverse colon', 'Descending colon, Sigmoid colon, Rectum (upper 2/3)'],
    keyMolecularSignals: ['PITX2 (gut looping chirality)', 'SHH', 'CDX2 (intestinal specification)'],
    clinicalSignificance: 'Omphalocele (failure of herniated midgut to return to abdominal cavity covered by peritoneal sac), Gastroschisis, Meckel Diverticulum.',
    svgPos: { x: 345, y: 395 }
  },

  // NEURAL CREST
  {
    id: 'neural_crest_migratory',
    name: 'Neural Crest Migratory Streams & Ganglia',
    germLayer: 'neural_crest',
    subCategory: 'Neural Crest ("4th Germ Layer")',
    weekEmergence: 4,
    carnegieStage: 'CS 9-13',
    description: 'Multipotent cells undergoing epithelial-to-mesenchymal transition (EMT) migrating into branchial arches, trunk, and gut.',
    adultDerivatives: ['Dorsal Root Ganglia (DRG) & Autonomic Sympathetic Chain', 'Aorticopulmonary Spiral Septum of Heart', 'Adrenal Medulla (Chromaffin cells)', 'Melanocytes & Schwann cells', 'Craniofacial bone & dentine'],
    keyMolecularSignals: ['SNAIL / SLUG (EMT triggers)', 'SOX10', 'TWIST', 'PAX3'],
    clinicalSignificance: 'DiGeorge Syndrome (conotruncal heart defects & facial dysmorphism), Hirschsprung Disease (aganglionic megacolon), Neuroblastoma.',
    svgPos: { x: 375, y: 180 }
  }
];

interface GermLayerRudimentDiagramProps {
  currentStage: EmbryoStage;
  activeHoverLayer: GermLayer | 'all' | null;
  onHoverLayer: (layer: GermLayer | 'all' | null) => void;
  onSelectRudiment?: (rudiment: OrganRudiment) => void;
}

export const GermLayerRudimentDiagram: React.FC<GermLayerRudimentDiagramProps> = ({
  currentStage,
  activeHoverLayer,
  onHoverLayer,
  onSelectRudiment
}) => {
  const [hoveredRudiment, setHoveredRudiment] = useState<OrganRudiment | null>(null);
  const [selectedRudiment, setSelectedRudiment] = useState<OrganRudiment | null>(null);
  const [viewMode, setViewMode] = useState<'sagittal' | 'transverse'>('sagittal');
  const [filterLayer, setFilterLayer] = useState<GermLayer | 'all'>('all');

  // Determine effective highlight layer (from prop or local filter)
  const effectiveLayer = activeHoverLayer !== null && activeHoverLayer !== 'all' 
    ? activeHoverLayer 
    : (filterLayer !== 'all' ? filterLayer : null);

  const getLayerColor = (layer: GermLayer) => {
    switch (layer) {
      case 'ectoderm': return '#38bdf8'; // Sky blue
      case 'mesoderm': return '#f59e0b'; // Amber
      case 'endoderm': return '#22c55e'; // Emerald green
      case 'neural_crest': return '#c084fc'; // Purple
      default: return '#94a3b8';
    }
  };

  const isRudimentHighlighted = (rudiment: OrganRudiment) => {
    if (hoveredRudiment && hoveredRudiment.id === rudiment.id) return true;
    if (selectedRudiment && selectedRudiment.id === rudiment.id) return true;
    if (!effectiveLayer) return true;
    return rudiment.germLayer === effectiveLayer;
  };

  const getRudimentOpacity = (rudiment: OrganRudiment) => {
    if (hoveredRudiment) {
      return hoveredRudiment.id === rudiment.id ? 1 : 0.25;
    }
    if (!effectiveLayer) return 0.95;
    return rudiment.germLayer === effectiveLayer ? 1 : 0.15;
  };

  const activeOrganCount = ORGAN_RUDIMENTS.filter(r => 
    !effectiveLayer || r.germLayer === effectiveLayer
  ).length;

  const handleSelectRudimentInternal = (rudiment: OrganRudiment) => {
    setSelectedRudiment(rudiment);
    if (onSelectRudiment) {
      onSelectRudiment(rudiment);
    }
  };

  return (
    <div 
      id="germ_layer_organ_rudiments_diagram"
      className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Interactive Organ Rudiments Derivation Diagram
              </h4>
              <span className="bg-sky-950/60 border border-sky-500/40 text-sky-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                Carnegie Stage 10–14 Focus
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hover over germ layer cards or anatomical nodes to illuminate developing organ buds
            </p>
          </div>
        </div>

        {/* View Controls & Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layer Filter Pills */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              id="btn_filter_all_rudiments"
              onClick={() => { setFilterLayer('all'); onHoverLayer(null); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                (!effectiveLayer) 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Layers ({ORGAN_RUDIMENTS.length})
            </button>
            <button
              id="btn_filter_ectoderm_rudiments"
              onMouseEnter={() => onHoverLayer('ectoderm')}
              onMouseLeave={() => onHoverLayer(null)}
              onClick={() => setFilterLayer(filterLayer === 'ectoderm' ? 'all' : 'ectoderm')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                effectiveLayer === 'ectoderm'
                  ? 'bg-sky-500 text-white shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                  : 'text-sky-400 hover:bg-sky-950/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Ectoderm
            </button>
            <button
              id="btn_filter_mesoderm_rudiments"
              onMouseEnter={() => onHoverLayer('mesoderm')}
              onMouseLeave={() => onHoverLayer(null)}
              onClick={() => setFilterLayer(filterLayer === 'mesoderm' ? 'all' : 'mesoderm')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                effectiveLayer === 'mesoderm'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'text-amber-400 hover:bg-amber-950/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Mesoderm
            </button>
            <button
              id="btn_filter_endoderm_rudiments"
              onMouseEnter={() => onHoverLayer('endoderm')}
              onMouseLeave={() => onHoverLayer(null)}
              onClick={() => setFilterLayer(filterLayer === 'endoderm' ? 'all' : 'endoderm')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                effectiveLayer === 'endoderm'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                  : 'text-emerald-400 hover:bg-emerald-950/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Endoderm
            </button>
            <button
              id="btn_filter_neural_crest_rudiments"
              onMouseEnter={() => onHoverLayer('neural_crest')}
              onMouseLeave={() => onHoverLayer(null)}
              onClick={() => setFilterLayer(filterLayer === 'neural_crest' ? 'all' : 'neural_crest')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                effectiveLayer === 'neural_crest'
                  ? 'bg-purple-500 text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                  : 'text-purple-400 hover:bg-purple-950/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Neural Crest
            </button>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              id="btn_view_sagittal"
              onClick={() => setViewMode('sagittal')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === 'sagittal'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sagittal Profile
            </button>
            <button
              id="btn_view_transverse"
              onClick={() => setViewMode('transverse')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === 'transverse'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Transverse Section
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagram Area with SVG & Side Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start relative z-10">
        
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800/90 rounded-xl p-3 shadow-inner relative flex flex-col items-center justify-center min-h-[440px]">
          
          {/* Status Overlay Badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 backdrop-blur-md ${
              effectiveLayer === 'ectoderm' ? 'bg-sky-950/80 border-sky-500/60 text-sky-300' :
              effectiveLayer === 'mesoderm' ? 'bg-amber-950/80 border-amber-500/60 text-amber-300' :
              effectiveLayer === 'endoderm' ? 'bg-emerald-950/80 border-endoderm-500/60 text-emerald-300' :
              effectiveLayer === 'neural_crest' ? 'bg-purple-950/80 border-purple-500/60 text-purple-300' :
              'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: effectiveLayer ? getLayerColor(effectiveLayer) : '#38bdf8' }} />
              {effectiveLayer 
                ? `Highlighting: ${effectiveLayer.replace('_', ' ').toUpperCase()} (${activeOrganCount} Rudiments)`
                : `Showing All ${ORGAN_RUDIMENTS.length} Organ Rudiments`}
            </span>
          </div>

          {/* SAGITTAL 4-WEEK EMBRYO VIEW */}
          {viewMode === 'sagittal' ? (
            <svg
              id="svg_embryo_sagittal_rudiments"
              viewBox="0 0 720 480"
              className="w-full h-auto max-h-[440px] select-none"
              style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))' }}
            >
              <defs>
                {/* Glow Filters */}
                <filter id="glow-sky" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Embryo Silhouette Gradients */}
                <linearGradient id="embryoBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#0f172a" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="neuralTubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>

                <linearGradient id="gutTubeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>

                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Anatomical Grid Reference Lines (Subtle) */}
              <g opacity="0.12" stroke="#475569" strokeWidth="0.75" strokeDasharray="3 3">
                <line x1="100" y1="240" x2="620" y2="240" />
                <line x1="360" y1="40" x2="360" y2="440" />
                <circle cx="360" cy="240" r="180" fill="none" />
              </g>

              {/* 1. Embryo Outer Anatomical Silhouette (C-Shaped 4-5 Week Embryo) */}
              <path
                id="path_embryo_silhouette"
                d="M 210,130 
                   C 190,70 300,30 400,45 
                   C 510,60 560,150 540,260 
                   C 525,340 450,420 370,430 
                   C 320,435 280,390 285,340 
                   C 260,340 220,310 215,260 
                   C 210,210 240,180 210,130 Z"
                fill="url(#embryoBodyGrad)"
                stroke="#334155"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              {/* Amniotic Cavity Dotted Halo */}
              <path
                d="M 180,120 C 160,50 300,10 430,25 C 550,45 600,150 575,280 C 555,380 470,455 370,460 C 300,465 250,410 255,350"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={effectiveLayer === 'ectoderm' ? 0.6 : 0.15}
              />

              {/* ---------------------------------------------------- */}
              {/* GROUP: ECTODERM & NEUROECTODERM                      */}
              {/* ---------------------------------------------------- */}
              <g 
                id="grp_ectoderm_structures"
                className="transition-all duration-300 cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[0])}
                style={{
                  filter: effectiveLayer === 'ectoderm' ? 'url(#glow-sky)' : undefined
                }}
              >
                {/* Dorsal Neural Tube & Brain Vesicles Path */}
                {/* Telencephalon / Forebrain */}
                <path
                  id="path_rudiment_forebrain"
                  d="M 220,130 C 205,95 260,70 300,80 C 310,95 290,135 250,140 Z"
                  fill="#38bdf8"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[0]) ? 0.85 : 0.3}
                  stroke="#38bdf8"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[0]) ? 2.5 : 1}
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[0])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[0])}
                />

                {/* Mesencephalon / Midbrain */}
                <path
                  id="path_rudiment_midbrain"
                  d="M 300,80 C 330,65 375,65 395,85 C 385,110 345,115 310,95 Z"
                  fill="#60a5fa"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[1]) ? 0.85 : 0.3}
                  stroke="#60a5fa"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[1]) ? 2.5 : 1}
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[1])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[1])}
                />

                {/* Rhombencephalon / Hindbrain */}
                <path
                  id="path_rudiment_hindbrain"
                  d="M 395,85 C 440,95 480,130 490,175 C 465,185 435,145 390,120 Z"
                  fill="#38bdf8"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[2]) ? 0.85 : 0.3}
                  stroke="#38bdf8"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[2]) ? 2.5 : 1}
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[2])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[2])}
                />

                {/* Dorsal Spinal Cord Strip */}
                <path
                  id="path_rudiment_spinal_cord"
                  d="M 490,175 C 510,230 495,310 445,365 C 405,405 355,405 340,395 C 360,375 425,350 455,290 C 475,240 465,185 490,175 Z"
                  fill="url(#neuralTubeGrad)"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[3]) ? 0.9 : 0.35}
                  stroke="#60a5fa"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[3]) ? 2.5 : 1.2}
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[3])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[3])}
                />

                {/* Optic Placode / Cup (Eye) */}
                <circle
                  id="circle_rudiment_optic"
                  cx="235"
                  cy="130"
                  r="7"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="animate-pulse"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[4])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[4])}
                />
                <circle cx="235" cy="130" r="2.5" fill="#bae6fd" pointerEvents="none" />

                {/* Otic Placode (Ear) */}
                <circle
                  id="circle_rudiment_otic"
                  cx="375"
                  cy="125"
                  r="6"
                  fill="#0369a1"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[5])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[5])}
                />

                {/* Surface Ectoderm Outline Band */}
                <path
                  d="M 210,130 C 190,70 300,30 400,45 C 510,60 560,150 540,260 C 525,340 450,420 370,430"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={effectiveLayer === 'ectoderm' ? 3 : 1}
                  strokeOpacity={effectiveLayer === 'ectoderm' ? 0.9 : 0.25}
                  strokeDasharray="6 3"
                  pointerEvents="none"
                />
              </g>

              {/* ---------------------------------------------------- */}
              {/* GROUP: MESODERM STRUCTURES                           */}
              {/* ---------------------------------------------------- */}
              <g 
                id="grp_mesoderm_structures"
                className="transition-all duration-300 cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[7])}
                style={{
                  filter: effectiveLayer === 'mesoderm' ? 'url(#glow-amber)' : undefined
                }}
              >
                {/* Somites Chain (Paraxial Mesoderm) along dorsal curvature */}
                <g 
                  id="grp_somite_chain"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[9])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[9])}
                >
                  {[
                    { cx: 435, cy: 155 },
                    { cx: 455, cy: 180 },
                    { cx: 470, cy: 210 },
                    { cx: 475, cy: 245 },
                    { cx: 468, cy: 280 },
                    { cx: 450, cy: 315 },
                    { cx: 425, cy: 345 },
                    { cx: 395, cy: 370 },
                    { cx: 360, cy: 385 }
                  ].map((s, i) => (
                    <rect
                      key={i}
                      x={s.cx - 5}
                      y={s.cy - 5}
                      width="10"
                      height="10"
                      rx="2.5"
                      fill="#f59e0b"
                      fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[9]) ? 0.9 : 0.3}
                      stroke="#d97706"
                      strokeWidth="1.2"
                    />
                  ))}
                </g>

                {/* Cardiogenic Heart Tube (Bulbus Cordis, Ventricle, Atrium Loop) */}
                <path
                  id="path_rudiment_heart_tube"
                  d="M 255,225 C 240,250 245,290 280,295 C 310,295 320,265 295,235 C 280,215 265,215 255,225 Z"
                  fill="url(#heartGrad)"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[7]) ? 0.95 : 0.35}
                  stroke="#f43f5e"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[7]) ? 2.5 : 1}
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[7])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[7])}
                />

                {/* Aortic Arches (Branchial Arteries 1-6) */}
                <g
                  id="grp_aortic_arches"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[8])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[8])}
                >
                  <path
                    d="M 285,230 C 315,210 360,205 385,225"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[8]) ? 3 : 1.5}
                    strokeLinecap="round"
                  />
                  <path
                    d="M 275,225 C 300,195 350,190 380,215"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[8]) ? 2.5 : 1.2}
                    strokeLinecap="round"
                  />
                </g>

                {/* Intermediate Mesoderm / Nephrogenic Cord */}
                <path
                  id="path_rudiment_mesonephros"
                  d="M 420,230 C 440,270 415,330 375,350 C 365,345 390,290 395,250 Z"
                  fill="#eab308"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[10]) ? 0.85 : 0.3}
                  stroke="#ca8a04"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[10]) ? 2.5 : 1}
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[10])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[10])}
                />

                {/* Upper Limb Bud (Forelimb) */}
                <ellipse
                  id="ellipse_rudiment_forelimb"
                  cx="320"
                  cy="310"
                  rx="18"
                  ry="12"
                  transform="rotate(25 320 310)"
                  fill="#f59e0b"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[11]) ? 0.9 : 0.35}
                  stroke="#b45309"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[11])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[11])}
                />

                {/* Lower Limb Bud (Hindlimb) */}
                <ellipse
                  id="ellipse_rudiment_hindlimb"
                  cx="360"
                  cy="395"
                  rx="16"
                  ry="10"
                  transform="rotate(-20 360 395)"
                  fill="#f59e0b"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[11]) ? 0.9 : 0.35}
                  stroke="#b45309"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[11])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[11])}
                />
              </g>

              {/* ---------------------------------------------------- */}
              {/* GROUP: ENDODERM & GUT DERIVATIVES                    */}
              {/* ---------------------------------------------------- */}
              <g 
                id="grp_endoderm_structures"
                className="transition-all duration-300 cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[12])}
                style={{
                  filter: effectiveLayer === 'endoderm' ? 'url(#glow-emerald)' : undefined
                }}
              >
                {/* Pharyngeal Pouches 1-4 */}
                <g 
                  id="grp_pharyngeal_pouches"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[12])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[12])}
                >
                  <path d="M 270,170 Q 285,175 295,170" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 275,182 Q 290,187 300,182" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 280,194 Q 295,199 305,194" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 285,206 Q 300,211 310,206" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>

                {/* Thyroid Diverticulum */}
                <circle
                  id="circle_rudiment_thyroid"
                  cx="295"
                  cy="200"
                  r="5"
                  fill="#16a34a"
                  stroke="#4ade80"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[13])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[13])}
                />

                {/* Laryngotracheal Bud & Lung Buds */}
                <g
                  id="grp_lung_buds"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[14])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[14])}
                >
                  <path
                    d="M 315,240 Q 335,260 345,255 Q 355,270 345,280"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[14]) ? 3.5 : 2}
                  />
                  <circle cx="348" cy="275" r="5" fill="#4ade80" stroke="#166534" strokeWidth="1" />
                  <circle cx="340" cy="285" r="4.5" fill="#4ade80" stroke="#166534" strokeWidth="1" />
                </g>

                {/* Foregut (Esophagus, Primitive Stomach) */}
                <path
                  id="path_rudiment_foregut_stomach"
                  d="M 305,215 C 320,240 330,290 350,305 C 365,315 355,335 340,335 C 330,335 320,280 305,215 Z"
                  fill="url(#gutTubeGrad)"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[15]) ? 0.9 : 0.35}
                  stroke="#22c55e"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[15]) ? 2.5 : 1}
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[15])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[15])}
                />

                {/* Liver Diverticulum (Hepatic Bud) & Gallbladder */}
                <path
                  id="path_rudiment_liver_bud"
                  d="M 330,320 C 310,330 300,360 325,370 C 345,365 345,340 330,320 Z"
                  fill="#15803d"
                  fillOpacity={isRudimentHighlighted(ORGAN_RUDIMENTS[15]) ? 0.9 : 0.35}
                  stroke="#4ade80"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[15])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[15])}
                />

                {/* Ventral & Dorsal Pancreatic Buds */}
                <circle cx="348" cy="335" r="4" fill="#86efac" stroke="#166534" strokeWidth="1" />
                <circle cx="355" cy="328" r="3.5" fill="#86efac" stroke="#166534" strokeWidth="1" />

                {/* Midgut Loop & Vitelline Connection */}
                <path
                  id="path_rudiment_midgut_loop"
                  d="M 340,335 C 360,355 355,395 330,410 C 310,405 315,360 330,345"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[16]) ? 3.5 : 2}
                  onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[16])}
                  onMouseLeave={() => setHoveredRudiment(null)}
                  onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[16])}
                />

                {/* Hindgut & Cloaca / Allantois */}
                <path
                  id="path_rudiment_hindgut"
                  d="M 330,410 C 315,425 295,410 290,385"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[16]) ? 3 : 1.5}
                />
              </g>

              {/* ---------------------------------------------------- */}
              {/* GROUP: NEURAL CREST STREAM                           */}
              {/* ---------------------------------------------------- */}
              <g 
                id="grp_neural_crest_stream"
                className="transition-all duration-300 cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[17])}
                style={{
                  filter: effectiveLayer === 'neural_crest' ? 'url(#glow-purple)' : undefined
                }}
                onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[17])}
                onMouseLeave={() => setHoveredRudiment(null)}
                onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[17])}
              >
                {/* Migratory Neural Crest Dots Streams */}
                {[
                  { cx: 310, cy: 155 },
                  { cx: 330, cy: 175 },
                  { cx: 355, cy: 195 },
                  { cx: 380, cy: 220 },
                  { cx: 405, cy: 250 },
                  { cx: 415, cy: 285 },
                  { cx: 395, cy: 320 }
                ].map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="3.5"
                    fill="#c084fc"
                    stroke="#7e22ce"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                ))}

                {/* Cardiac Neural Crest Stream into Truncus */}
                <path
                  d="M 320,180 Q 300,210 280,230"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="2"
                  strokeDasharray="2 3"
                />
              </g>

              {/* ---------------------------------------------------- */}
              {/* INTERACTIVE CALLOUT POINTERS                         */}
              {/* ---------------------------------------------------- */}
              {ORGAN_RUDIMENTS.map((rudiment) => {
                const isHovered = hoveredRudiment?.id === rudiment.id;
                const isSelected = selectedRudiment?.id === rudiment.id;
                const layerCol = getLayerColor(rudiment.germLayer);

                if (!isHovered && !isSelected && effectiveLayer && effectiveLayer !== rudiment.germLayer) {
                  return null;
                }

                return (
                  <g 
                    key={rudiment.id}
                    className="transition-all duration-200 cursor-pointer pointer-events-auto"
                    onMouseEnter={() => setHoveredRudiment(rudiment)}
                    onMouseLeave={() => setHoveredRudiment(null)}
                    onClick={() => handleSelectRudimentInternal(rudiment)}
                  >
                    {/* Pulsing ring on active */}
                    {(isHovered || isSelected) && (
                      <circle
                        cx={rudiment.svgPos.x}
                        cy={rudiment.svgPos.y}
                        r="14"
                        fill="none"
                        stroke={layerCol}
                        strokeWidth="2"
                        className="animate-ping"
                        opacity="0.75"
                      />
                    )}

                    {/* Central Anchor Node */}
                    <circle
                      cx={rudiment.svgPos.x}
                      cy={rudiment.svgPos.y}
                      r={isHovered || isSelected ? 6.5 : 4}
                      fill={layerCol}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all"
                    />

                    {/* Compact Label */}
                    {(isHovered || isSelected || effectiveLayer === rudiment.germLayer) && (
                      <g transform={`translate(${rudiment.svgPos.x + 8}, ${rudiment.svgPos.y - 4})`}>
                        <rect
                          x="0"
                          y="-10"
                          width={rudiment.name.length * 5.6 + 12}
                          height="18"
                          rx="4"
                          fill="#090d16"
                          fillOpacity="0.92"
                          stroke={layerCol}
                          strokeWidth="1"
                        />
                        <text
                          x="6"
                          y="3"
                          fill="#f8fafc"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="ui-monospace, monospace"
                        >
                          {rudiment.name.length > 26 ? rudiment.name.slice(0, 24) + '…' : rudiment.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          ) : (
            /* TRANSVERSE TRILAMINAR CROSS SECTION VIEW */
            <svg
              id="svg_embryo_transverse_rudiments"
              viewBox="0 0 720 480"
              className="w-full h-auto max-h-[440px] select-none"
            >
              <defs>
                <linearGradient id="somiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* Title within SVG */}
              <text x="360" y="35" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                TRANSVERSE CROSS-SECTION (CARNEGIE STAGE 11 / WEEK 4)
              </text>

              {/* Outer Body Wall (Ectoderm + Somatic Mesoderm) */}
              <ellipse 
                cx="360" 
                cy="260" 
                rx="240" 
                ry="170" 
                fill="#0f172a" 
                stroke="#334155" 
                strokeWidth="2" 
              />

              {/* Surface Ectoderm Outer Ring */}
              <ellipse 
                cx="360" 
                cy="260" 
                rx="240" 
                ry="170" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth={effectiveLayer === 'ectoderm' ? 4 : 2}
                strokeOpacity={effectiveLayer === 'ectoderm' ? 1 : 0.4}
              />

              {/* Neural Tube (Dorsal) */}
              <g 
                className="cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[3])}
                onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[3])}
                onMouseLeave={() => setHoveredRudiment(null)}
                onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[3])}
              >
                <circle 
                  cx="360" 
                  cy="150" 
                  r="35" 
                  fill="#0284c7" 
                  stroke="#38bdf8" 
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[3]) ? 3.5 : 2} 
                />
                <circle cx="360" cy="150" r="10" fill="#0369a1" />
                <text x="360" y="154" textAnchor="middle" fill="#bae6fd" fontSize="9" fontWeight="bold">Neural Tube</text>
              </g>

              {/* Neural Crest Cells (Dorsolateral to Neural Tube) */}
              <g 
                className="cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[17])}
                onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[17])}
                onMouseLeave={() => setHoveredRudiment(null)}
                onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[17])}
              >
                <circle cx="310" cy="130" r="8" fill="#c084fc" stroke="#7e22ce" strokeWidth="1.5" />
                <circle cx="410" cy="130" r="8" fill="#c084fc" stroke="#7e22ce" strokeWidth="1.5" />
                <text x="310" y="115" textAnchor="middle" fill="#e9d5ff" fontSize="8" fontWeight="bold">Neural Crest</text>
              </g>

              {/* Notochord (Ventral to Neural Tube) */}
              <circle cx="360" cy="205" r="9" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1.5" />
              <text x="360" y="209" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">CHORD</text>

              {/* Paraxial Mesoderm (Somites - Bilateral) */}
              <g 
                className="cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[9])}
                onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[9])}
                onMouseLeave={() => setHoveredRudiment(null)}
                onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[9])}
              >
                <rect x="255" y="135" width="50" height="45" rx="8" fill="url(#somiteGrad)" stroke="#d97706" strokeWidth="2" />
                <rect x="415" y="135" width="50" height="45" rx="8" fill="url(#somiteGrad)" stroke="#d97706" strokeWidth="2" />
                <text x="280" y="162" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Somite</text>
                <text x="440" y="162" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Somite</text>
              </g>

              {/* Intermediate Mesoderm (Nephrogenic Cord) */}
              <g 
                className="cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[10])}
                onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[10])}
                onMouseLeave={() => setHoveredRudiment(null)}
                onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[10])}
              >
                <ellipse cx="215" cy="195" rx="18" ry="14" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                <ellipse cx="505" cy="195" rx="18" ry="14" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                <text x="215" y="198" textAnchor="middle" fill="#000" fontSize="7" fontWeight="black">Intermed.</text>
                <text x="505" y="198" textAnchor="middle" fill="#000" fontSize="7" fontWeight="black">Intermed.</text>
              </g>

              {/* Intraembryonic Coelom Cavity */}
              <path
                d="M 180,240 C 180,310 240,360 360,360 C 480,360 540,310 540,240"
                fill="none"
                stroke="#475569"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Endodermal Primitive Gut Tube (Ventral) */}
              <g 
                className="cursor-pointer"
                opacity={getRudimentOpacity(ORGAN_RUDIMENTS[15])}
                onMouseEnter={() => setHoveredRudiment(ORGAN_RUDIMENTS[15])}
                onMouseLeave={() => setHoveredRudiment(null)}
                onClick={() => handleSelectRudimentInternal(ORGAN_RUDIMENTS[15])}
              >
                <ellipse 
                  cx="360" 
                  cy="295" 
                  rx="45" 
                  ry="35" 
                  fill="#22c55e" 
                  stroke="#15803d" 
                  strokeWidth={isRudimentHighlighted(ORGAN_RUDIMENTS[15]) ? 3.5 : 2} 
                />
                <ellipse cx="360" cy="295" rx="20" ry="15" fill="#166534" />
                <text x="360" y="299" textAnchor="middle" fill="#f0fdf4" fontSize="10" fontWeight="bold">Gut Tube (Endoderm)</text>
              </g>

              {/* Splanchnic Mesoderm (Surrounding Gut Tube) */}
              <ellipse 
                cx="360" 
                cy="295" 
                rx="58" 
                ry="46" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2" 
                strokeDasharray="3 3"
              />

              {/* Dorsal Mesentery */}
              <line x1="360" y1="214" x2="360" y2="250" stroke="#f59e0b" strokeWidth="3" />
            </svg>
          )}

          {/* Interactive Legend Bar inside canvas */}
          <div className="w-full mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>Ectoderm (Neural & Surface)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Mesoderm (Somite / Cardio / Renal)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Endoderm (Gut & Glands)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Neural Crest</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Click node to pin details
            </span>
          </div>
        </div>

        {/* Dynamic Detail Inspector Card */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {(() => {
            const activeRudiment = hoveredRudiment || selectedRudiment || ORGAN_RUDIMENTS[0];
            const layerColor = getLayerColor(activeRudiment.germLayer);

            return (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col gap-3.5 shadow-xl transition-all">
                {/* Active Organ Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: layerColor }} 
                      />
                      <span 
                        className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{ 
                          color: layerColor, 
                          backgroundColor: `${layerColor}15`,
                          border: `1px solid ${layerColor}35`
                        }}
                      >
                        {activeRudiment.germLayer.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeRudiment.carnegieStage}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {activeRudiment.name}
                    </h4>
                  </div>

                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md font-mono whitespace-nowrap">
                    Wk {activeRudiment.weekEmergence}+
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeRudiment.description}
                </p>

                {/* Master Molecular Signals */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Dna className="w-3 h-3 text-purple-400" />
                    Master Molecular Signals:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRudiment.keyMolecularSignals.map((signal, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300 font-medium"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Adult Organ Derivatives */}
                <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Definitive Adult Derivatives:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-200">
                    {activeRudiment.adultDerivatives.map((deriv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-sky-400 text-xs leading-none mt-1">•</span>
                        <span className="leading-snug">{deriv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clinical High Yield Correlation */}
                <div className="bg-rose-950/20 border border-rose-500/30 p-2.5 rounded-lg text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Clinical High-Yield Pearl:
                  </span>
                  <p className="text-rose-200 text-[11px] leading-relaxed">
                    {activeRudiment.clinicalSignificance}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
};
