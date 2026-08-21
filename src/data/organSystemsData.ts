import { GermLayer } from '../types';

export type OrganSystemId = 
  | 'cardiovascular'
  | 'nervous'
  | 'gastrointestinal'
  | 'respiratory'
  | 'urogenital'
  | 'pharyngeal_craniofacial'
  | 'musculoskeletal'
  | 'endocrine_hematopoietic';

export interface SystemDevelopmentStage {
  stageId: string;
  title: string;
  timeframe: string;
  carnegieStage: string;
  week: number;
  embryoStageId?: string; // Links to 3D Atlas stage
  overview: string;
  anatomicalEvents: string[];
  molecularSignaling: { gene: string; role: string }[];
  clinicalNotes: string;
  keyVisualKey: string;
}

export interface OrganDerivativeItem {
  embryonicStructure: string;
  germLayer: GermLayer;
  adultDerivative: string;
  clinicalSignificance?: string;
}

export interface CongenitalDefectItem {
  name: string;
  embryologicalBasis: string;
  incidence: string;
  presentation: string;
  diagnosticFinding: string;
  usmlePearl: string;
}

export interface OrganSystemData {
  id: OrganSystemId;
  name: string;
  subtitle: string;
  iconName: string;
  badge: string;
  color: {
    primary: string;
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
  germLayers: GermLayer[];
  masterGenes: string[];
  systemOverview: string;
  criticalPeriod: string;
  stages: SystemDevelopmentStage[];
  derivativesMatrix: OrganDerivativeItem[];
  congenitalDefects: CongenitalDefectItem[];
  fetalCirculationOrSpecialTopics?: {
    topicTitle: string;
    items: { label: string; prenatalRole: string; postnatalRemnant: string; defectIfPatent?: string }[];
  };
  highYieldBoardPearls: string[];
}

export const ORGAN_SYSTEMS_DATA: OrganSystemData[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    subtitle: 'Heart Tube Looping, Chamber Septation, Aortic Arches & Fetal Circulation',
    iconName: 'Heart',
    badge: 'First Functional Organ System (Day 21-22)',
    color: {
      primary: 'rgb(244, 63, 94)',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]'
    },
    germLayers: ['mesoderm', 'neural_crest'],
    masterGenes: ['NKX2-5 (Tinman homolog)', 'TBX5 (Holt-Oram)', 'HAND1 & HAND2', 'GATA4', 'PITX2 (Left-Right asymmetry)', 'VEGF & FGF'],
    systemOverview: 'The cardiovascular system is the first organ system to reach a functional state in the human embryo. Primitive cardiogenic mesoderm gives rise to a single pulsating tube that undergoes precise dextral looping, endocardial cushion growth, atrial and ventricular septation, and aortic arch remodeling.',
    criticalPeriod: 'Day 15 to Week 8 (Carnegie Stages 7-23)',
    stages: [
      {
        stageId: 'cv_stage_1',
        title: 'Primary & Secondary Heart Fields',
        timeframe: 'Days 15 - 19',
        carnegieStage: 'Stage 7 - 8',
        week: 3,
        embryoStageId: 'stage_w3',
        overview: 'Cardiogenic progenitor cells in the epiblast migrate through the primitive streak into the splanchnic layer of lateral plate mesoderm to form the horseshoe-shaped primary heart field (PHF).',
        anatomicalEvents: [
          'PHF cells specified by endodermal Wnt inhibitors and BMP signaling.',
          'Secondary Heart Field (SHF) forms medial to PHF; contributes to right ventricle and outflow tract (conus arteriosus & truncus arteriosus).',
          'Lateral and cranial embryonic folding moves heart tubes ventrally and caudally into the thoracic cavity.'
        ],
        molecularSignaling: [
          { gene: 'NKX2-5', role: 'Master transcription factor for cardiac cell lineage commitment and chamber specification.' },
          { gene: 'BMP2/4', role: 'Secreted by adjacent endoderm to stimulate cardiac crescent gene activation.' },
          { gene: 'WNT antagonists (Crescent, Dkk1)', role: 'Inhibit canonical Wnt signaling in anterior region to allow cardiogenesis.' }
        ],
        clinicalNotes: 'Mutations in NKX2-5 cause familiar atrial septal defects (ASD) and atrioventricular conduction block.',
        keyVisualKey: 'cardiogenic_crescent'
      },
      {
        stageId: 'cv_stage_2',
        title: 'Straight Heart Tube & First Coordinated Beats',
        timeframe: 'Days 20 - 22',
        carnegieStage: 'Stage 9 - 10',
        week: 4,
        embryoStageId: 'stage_w4',
        overview: 'Paired endocardial tubes fuse along the midline to form a single continuous heart tube consisting of Truncus Arteriosus, Bulbus Cordis, Primitive Ventricle, Primitive Atrium, and Sinus Venosus.',
        anatomicalEvents: [
          'Fusion of endocardial heart tubes begins cranially and proceeds caudally.',
          'Cardiac jelly (gelatinous extracellular matrix) secretes between inner endothelial tube and outer myocardium.',
          'First peristaltic contractions begin on Day 21-22, propelling blood craniad through aortic arches to dorsal aortae.'
        ],
        molecularSignaling: [
          { gene: 'GATA4', role: 'Regulates expression of cardiac structural proteins and sarcomeric assembly.' },
          { gene: 'VEGF', role: 'Governs endocardial differentiation and coronary vascular budding.' }
        ],
        clinicalNotes: 'Cardiac jelly expansion is critical for subsequent valve and septal cushion formation. Defects cause primitive tube arrest.',
        keyVisualKey: 'linear_heart_tube'
      },
      {
        stageId: 'cv_stage_3',
        title: 'Cardiac D-Looping & Chamber Positioning',
        timeframe: 'Days 23 - 28',
        carnegieStage: 'Stage 10 - 12',
        week: 4,
        embryoStageId: 'stage_w4',
        overview: 'Because the heart tube elongates rapidly within the constrained pericardial cavity, it loops to the right (D-looping), bending the bulbus cordis ventrally, caudally, and to the right, while the primitive atrium moves dorsocranially and to the left.',
        anatomicalEvents: [
          'D-looping establishes fundamental left-right spatial orientation of cardiac chambers.',
          'Bulbus cordis gives rise to right ventricle (smooth and trabeculated parts).',
          'Primitive ventricle develops into trabeculated left ventricle.',
          'Primitive atrium shifts dorsal to the outflow tract.'
        ],
        molecularSignaling: [
          { gene: 'PITX2c', role: 'Master left-sided transcription factor downstream of Nodal and Lefty-2 that coordinates rightward looping.' },
          { gene: 'HAND1 / HAND2', role: 'HAND1 is restricted to primitive left ventricle; HAND2 is restricted to right ventricle & outflow tract.' },
          { gene: 'Cilia Dynein (DNAH5/DNAH11)', role: 'Nodal flow at primitive node drives asymmetric Pitx2 expression.' }
        ],
        clinicalNotes: 'Defects in dynein cilia cause Kartagener syndrome / Primary Ciliary Dyskinesia leading to L-looping (Dextrocardia / Situs Inversus).',
        keyVisualKey: 'd_looping'
      },
      {
        stageId: 'cv_stage_4',
        title: 'Atrial & Ventricular Septation & Endocardial Cushions',
        timeframe: 'Days 27 - 37',
        carnegieStage: 'Stage 12 - 16',
        week: 5,
        embryoStageId: 'stage_w5',
        overview: 'Complex simultaneous septation partitions the common atrium into right and left atria, and divides the atrioventricular canal via superior and inferior endocardial cushions.',
        anatomicalEvents: [
          'Septum primum grows down toward endocardial cushions, leaving ostium primum.',
          'Apoptosis creates ostium secundum in septum primum before ostium primum completely closes.',
          'Thick, muscular Septum secundum grows to the right of septum primum, leaving an open foramen ovale.',
          'Muscular interventricular septum grows craniad toward AV cushions, leaving an interventricular foramen.',
          'Superior and inferior AV cushions fuse to form right (tricuspid) and left (mitral) AV orifices.'
        ],
        molecularSignaling: [
          { gene: 'TBX5', role: 'Coordinates atrial and ventricular septation; haploinsufficiency causes Holt-Oram syndrome (ASD + upper limb phocomelia).' },
          { gene: 'TGF-beta & Notch', role: 'Induce endothelial-to-mesenchymal transition (EndMT) in endocardial cushion formation.' }
        ],
        clinicalNotes: 'Ostium secundum ASD is the most common atrial defect (90%), caused by excessive resorption of septum primum or deficient septum secundum. Endocardial cushion defects are classically seen in Down syndrome (Trisomy 21).',
        keyVisualKey: 'atrial_septation'
      },
      {
        stageId: 'cv_stage_5',
        title: 'Conotruncal Septation & Neural Crest Influx',
        timeframe: 'Weeks 5 - 8',
        carnegieStage: 'Stage 15 - 20',
        week: 6,
        embryoStageId: 'stage_w6',
        overview: 'Cardiac neural crest cells migrate through pharyngeal arches 4 and 6 to populate the conotruncal swellings. These swellings grow in a 180° spiral orientation, fusing to divide the truncus arteriosus into the ascending aorta and pulmonary trunk.',
        anatomicalEvents: [
          'Aorticopulmonary (AP) spiral septum forms from fused right and left truncal and conal cushions.',
          'Membranous interventricular septum forms by fusion of: (1) Muscular IV septum, (2) Inferior endocardial cushion, and (3) AP conotruncal septum.',
          'Aortic arches 3, 4, and 6 remodel into common carotids, aortic arch/right subclavian, and ductus arteriosus/pulmonary arteries.'
        ],
        molecularSignaling: [
          { gene: 'PAX3 / FOXC2', role: 'Required for cardiac neural crest survival, migration, and outflow tract colonization.' },
          { gene: 'Semaphorin / Plexin', role: 'Guides neural crest navigation into the branchial arches and conotruncus.' },
          { gene: '22q11.2 (TBX1)', role: 'Master regulator of pharyngeal arch & neural crest development (DiGeorge / Velocardiofacial syndrome).' }
        ],
        clinicalNotes: 'Conotruncal septation defects include: Tetralogy of Fallot (anterior displacement of infundibular septum), Transposition of the Great Arteries (failure of spiral rotation), Persistent Truncus Arteriosus (failure of AP septum to form).',
        keyVisualKey: 'conotruncal_spiral'
      },
      {
        stageId: 'cv_stage_6',
        title: 'Aortic Arches Remodeling & Fetal Shunts',
        timeframe: 'Weeks 6 - 8 (Carnegie 16-23) to Birth',
        carnegieStage: 'Stage 17 - 23',
        week: 8,
        embryoStageId: 'stage_w8',
        overview: 'Six pairs of pharyngeal aortic arches branch off the aortic sac and undergo stereotypic regression and preservation to establish the definitive adult arterial tree and fetal vascular shunts.',
        anatomicalEvents: [
          '1st Arch: Maxillary artery branch.',
          '2nd Arch: Stapedial artery and hyoid artery.',
          '3rd Arch: Common Carotid artery and proximal Internal Carotid artery.',
          '4th Arch: Left forms Definitive Aortic Arch; Right forms proximal Right Subclavian artery.',
          '6th Arch: Left forms Left Pulmonary artery and Ductus Arteriosus; Right forms Right Pulmonary artery.',
          'Recurrent laryngeal nerve loops under 6th arch on left (Ductus arteriosus/ligamentum arteriosum) and under 4th arch on right (subclavian).'
        ],
        molecularSignaling: [
          { gene: 'Prostaglandin E2 (PGE2)', role: 'Produced by placenta and low fetal pO2 to maintain Ductus Arteriosus patency in utero.' },
          { gene: 'Indomethacin / NSAIDs', role: 'Inhibit COX enzymes to promote closure of patent ductus arteriosus (PDA).' }
        ],
        clinicalNotes: 'Coarctation of the aorta is often localized near the ligamentum arteriosum (juxtaductal). Associated with Turner syndrome (45,XO).',
        keyVisualKey: 'aortic_arches'
      }
    ],
    derivativesMatrix: [
      { embryonicStructure: 'Truncus Arteriosus', germLayer: 'mesoderm', adultDerivative: 'Ascending Aorta & Pulmonary Trunk', clinicalSignificance: 'Persistent Truncus Arteriosus if AP septum fails' },
      { embryonicStructure: 'Bulbus Cordis', germLayer: 'mesoderm', adultDerivative: 'Smooth parts of Left & Right Ventricles (Aortic vestibule & Infundibulum/Conus arteriosus)', clinicalSignificance: 'Tetralogy of Fallot infundibular stenosis' },
      { embryonicStructure: 'Primitive Ventricle', germLayer: 'mesoderm', adultDerivative: 'Trabeculated part of Left Ventricle', clinicalSignificance: 'Ventricular Septal Defects (VSD) in muscular septum' },
      { embryonicStructure: 'Primitive Atrium', germLayer: 'mesoderm', adultDerivative: 'Trabeculated parts of Left & Right Atria (pectinate muscles & auricles)', clinicalSignificance: 'Atrial Septal Defects (ASD)' },
      { embryonicStructure: 'Sinus Venosus (Right Horn)', germLayer: 'mesoderm', adultDerivative: 'Smooth part of Right Atrium (Sinus Venarum)', clinicalSignificance: 'Crista terminalis marks boundary with trabeculated atrium' },
      { embryonicStructure: 'Sinus Venosus (Left Horn)', germLayer: 'mesoderm', adultDerivative: 'Coronary Sinus & Oblique Vein of Left Atrium', clinicalSignificance: 'Persistent left superior vena cava' },
      { embryonicStructure: 'Primitive Pulmonary Vein', germLayer: 'mesoderm', adultDerivative: 'Smooth part of Left Atrium', clinicalSignificance: 'Total anomalous pulmonary venous return (TAPVR)' },
      { embryonicStructure: 'Endocardial Cushions', germLayer: 'mesoderm', adultDerivative: 'Atrial septum (primum), Membranous IV septum, Mitral & Tricuspid valves', clinicalSignificance: 'AV Canal defect in Down syndrome' },
      { embryonicStructure: 'Cardiac Neural Crest', germLayer: 'neural_crest', adultDerivative: 'Aorticopulmonary (AP) septum & Spiral truncal cushions', clinicalSignificance: 'DiGeorge syndrome (22q11 deletion)' }
    ],
    fetalCirculationOrSpecialTopics: {
      topicTitle: 'Fetal Vascular Shunts & Postnatal Remnants',
      items: [
        { label: 'Ductus Venosus', prenatalRole: 'Shunts oxygenated umbilical vein blood directly past fetal liver into IVC', postnatalRemnant: 'Ligamentum Venosum', defectIfPatent: 'Patent ductus venosus (portal bypass)' },
        { label: 'Foramen Ovale', prenatalRole: 'Shunts high-oxygen blood from IVC straight from Right Atrium to Left Atrium', postnatalRemnant: 'Fossa Ovalis (limbus from septum secundum, valve from primum)', defectIfPatent: 'Patent Foramen Ovale (paradoxical emboli risk)' },
        { label: 'Ductus Arteriosus', prenatalRole: 'Shunts desaturated RV blood from pulmonary artery to descending aorta, bypassing lungs', postnatalRemnant: 'Ligamentum Arteriosum', defectIfPatent: 'Patent Ductus Arteriosus (continuous machine-like murmur)' },
        { label: 'Umbilical Vein (Single)', prenatalRole: 'Carries 80% oxygenated blood from placenta to fetal liver/IVC', postnatalRemnant: 'Ligamentum Teres Hepatis (Round ligament of liver)', defectIfPatent: 'Cruveilhier-Baumgarten syndrome' },
        { label: 'Umbilical Arteries (Paired)', prenatalRole: 'Return deoxygenated blood from internal iliacs to placenta', postnatalRemnant: 'Medial Umbilical Ligaments & Superior Vesical Arteries', defectIfPatent: 'Single umbilical artery (2-vessel cord on US)' }
      ]
    },
    congenitalDefects: [
      {
        name: 'Tetralogy of Fallot (ToF)',
        embryologicalBasis: 'Anterosuperior displacement of the infundibular (conal) septum during conotruncal septation.',
        incidence: '1 in 2,500 live births (Most common cyanotic heart disease in infancy)',
        presentation: 'Cyanotic "tet spells" relieved by squatting (increases SVR, decreases R-to-L shunt). 4 Features: (1) Pulmonary infundibular stenosis, (2) RV hypertrophy, (3) Overriding aorta, (4) VSD (PROVe).',
        diagnosticFinding: 'CXR reveals classic "Boot-shaped heart" (coeur en sabot) with decreased pulmonary vascular markings.',
        usmlePearl: 'Squatting kinks femoral arteries, increasing systemic vascular resistance and forcing blood through the stenotic pulmonary outflow tract.'
      },
      {
        name: 'Transposition of the Great Arteries (d-TGA)',
        embryologicalBasis: 'Failure of the aorticopulmonary (AP) spiral septum to rotate 180°; truncus arteriosus divides straight.',
        incidence: '1 in 3,300 live births',
        presentation: 'Severe early cyanosis immediately after birth; incompatible with life unless a mixing shunt (PDA, VSD, or PFO) exists. Egg-on-a-string appearance on CXR.',
        diagnosticFinding: 'Aorta arises anteriorly from RV; Pulmonary trunk arises posteriorly from LV. PGE1 infusion keeps ductus open.',
        usmlePearl: 'Strongly associated with pregestational maternal diabetes mellitus.'
      },
      {
        name: 'Patent Ductus Arteriosus (PDA)',
        embryologicalBasis: 'Failure of 6th aortic arch derivative to constrict after birth in response to increased alveolar pO2 and drop in maternal PGE2.',
        incidence: '1 in 2,000 full term; up to 60% in extreme preterm infants',
        presentation: 'Continuous "machine-like" murmur loudest at left infraclavicular area; wide pulse pressure and bounding pulses.',
        diagnosticFinding: 'Echocardiogram reveals persistent left-to-right flow from descending aorta into main pulmonary artery.',
        usmlePearl: 'Administer Indomethacin/Ibuprofen (COX inhibitors) to close; administer PGE1 (Alprostadil) to maintain patency in ductal-dependent cyanotic lesions.'
      }
    ],
    highYieldBoardPearls: [
      'Heart begins beating at Day 21-22 (Week 4, Carnegie Stage 9-10).',
      'The left recurrent laryngeal nerve loops around the aortic arch / ligamentum arteriosum (6th arch), while right loops around right subclavian (4th arch).',
      'Dextrocardia is caused by abnormal leftward looping (L-looping) due to dynein arm mutations in Kartagener syndrome.',
      'Ostium secundum ASD is due to excessive resorption of septum primum or deficient septum secundum.',
      'Ostium primum ASD + Cleft mitral valve = Endocardial cushion defect, strongly associated with Trisomy 21 (Down syndrome).'
    ]
  },
  {
    id: 'nervous',
    name: 'Nervous System & Special Senses',
    subtitle: 'Neurulation, Brain Vesicle Subdivisions, Neural Crest Migration, Eye & Ear Organogenesis',
    iconName: 'Brain',
    badge: 'Primary & Secondary Neurulation (Weeks 3 - 8)',
    color: {
      primary: 'rgb(147, 51, 234)',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_15px_rgba(147,51,234,0.3)]'
    },
    germLayers: ['ectoderm', 'neural_crest'],
    masterGenes: ['SHH (Ventral floor plate)', 'BMP4/7 & Wnt (Dorsal roof plate)', 'PAX6 (Eye & Forebrain)', 'HOX genes (Hindbrain rhombomeres)', 'OTX2 & EMX2', 'FGF8 (Isthmic organizer)'],
    systemOverview: 'The nervous system develops from the neural plate, induced by the underlying notochord. Neural tube closure occurs in Week 4, followed by the formation of 3 primary and then 5 secondary brain vesicles, alongside extensive neural crest migration and placode morphogenesis.',
    criticalPeriod: 'Day 17 to Week 8 (Neural Tube closes by Day 28)',
    stages: [
      {
        stageId: 'ns_stage_1',
        title: 'Neural Induction & Neural Plate',
        timeframe: 'Days 17 - 19',
        carnegieStage: 'Stage 8',
        week: 3,
        embryoStageId: 'stage_w3',
        overview: 'Notochord secretes Noggin, Chordin, and Follistatin which inhibit BMP-4, neuralizing the overlying ectoderm to form the neural plate.',
        anatomicalEvents: [
          'Neural plate broadens cranially (future brain) and narrows caudally (future spinal cord).',
          'Lateral edges of neural plate elevate to form neural folds flanking the central neural groove.',
          'Neural crest cells specify at the junction of neural plate and surface ectoderm.'
        ],
        molecularSignaling: [
          { gene: 'Noggin / Chordin / Follistatin', role: 'Antagonize BMP-4 to prevent epidermal fate and induce default neuroectoderm.' },
          { gene: 'FGF3/8', role: 'Posteriorize neural tube into spinal cord and hindbrain.' }
        ],
        clinicalNotes: 'Failure of primitive node induction leads to anencephaly or failure of axial neural specification.',
        keyVisualKey: 'neural_plate'
      },
      {
        stageId: 'ns_stage_2',
        title: 'Primary Neurulation & Neuropore Closure',
        timeframe: 'Days 20 - 28',
        carnegieStage: 'Stage 9 - 12',
        week: 4,
        embryoStageId: 'stage_w4',
        overview: 'Neural folds meet and fuse in the midline starting at the level of the 5th somite (cervical region) and proceed bidirectionally like a zipper.',
        anatomicalEvents: [
          'Cranial (Anterior) Neuropore closes at Day 24-25 (Carnegie Stage 11).',
          'Caudal (Posterior) Neuropore closes at Day 27-28 (Carnegie Stage 12).',
          'Secondary neurulation forms sacral and coccygeal spinal cord from caudal eminence / tail bud mesenchyme.'
        ],
        molecularSignaling: [
          { gene: 'Folate (Vitamin B9)', role: 'Essential for DNA synthesis and epigenetic methylation during rapid neural tube zippering.' },
          { gene: 'Planar Cell Polarity (VANGL1, CELSR1)', role: 'Regulates convergent extension narrowing and elongation of neural tube.' }
        ],
        clinicalNotes: 'Failure of cranial neuropore closure = Anencephaly / Craniorachischisis. Failure of caudal neuropore closure = Spina Bifida (occulta, meningocele, myelomeningocele). Maternal folate 400 mcg - 4 mg/day prevents 70% of NTDs.',
        keyVisualKey: 'neuropore_closure'
      },
      {
        stageId: 'ns_stage_3',
        title: '3 Primary to 5 Secondary Brain Vesicles',
        timeframe: 'Weeks 5 - 6',
        carnegieStage: 'Stage 13 - 16',
        week: 5,
        embryoStageId: 'stage_w5',
        overview: 'The cranial neural tube expands into 3 primary vesicles (Prosencephalon, Mesencephalon, Rhombencephalon), which subdivide into 5 secondary vesicles.',
        anatomicalEvents: [
          'Prosencephalon -> Telencephalon (Cerebral hemispheres, Lateral ventricles) + Diencephalon (Thalamus, Hypothalamus, Retina, Epithalamus, 3rd Ventricle).',
          'Mesencephalon -> Midbrain (Tectum, Tegmentum, Cerebral Aqueduct of Sylvius).',
          'Rhombencephalon -> Metencephalon (Pons, Cerebellum, upper 4th Ventricle) + Myelencephalon (Medulla Oblongata, lower 4th Ventricle).',
          'Cervical, Cephalic, and Pontine flexures fold the developing neuraxis.'
        ],
        molecularSignaling: [
          { gene: 'Sonic Hedgehog (SHH)', role: 'Secreted by notochord & prechordal plate to split forebrain field into bilateral hemispheres.' },
          { gene: 'FGF8 (Isthmus organizer)', role: 'Directs midbrain-hindbrain boundary and cerebellar development.' },
          { gene: 'HOX genes', role: 'Confer segmented identity to the 8 rhombomeres of the hindbrain.' }
        ],
        clinicalNotes: 'Mutation in SHH or maternal cholesterol synthesis defects (Smith-Lemli-Opitz) cause Holoprosencephaly (cyclopia, single ventricle). Aqueductal stenosis causes non-communicating congenital hydrocephalus.',
        keyVisualKey: 'brain_vesicles'
      },
      {
        stageId: 'ns_stage_4',
        title: 'Neural Crest Epithelial-Mesenchymal Migration',
        timeframe: 'Weeks 4 - 7',
        carnegieStage: 'Stage 10 - 18',
        week: 6,
        embryoStageId: 'stage_w6',
        overview: 'Neural crest cells undergo EMT, delaminating from the dorsal neuroectoderm and migrating along dorsolateral and ventromedial pathways throughout the entire embryo.',
        anatomicalEvents: [
          'Cranial Crest: Pharyngeal arch skeletons, frontonasal bones, melanocytes, cranial sensory ganglia (V, VII, IX, X), corneal stroma.',
          'Cardiac Crest: Aorticopulmonary spiral septum, conotruncal cushions.',
          'Trunk Crest: Dorsal Root Ganglia (DRG), Sympathetic chain ganglia, Prevertebral ganglia, Adrenal Medulla chromaffin cells, Schwann cells.',
          'Vagal & Sacral Crest: Enteric Nervous System (Myenteric / Auerbach & Submucosal / Meissner plexuses).'
        ],
        molecularSignaling: [
          { gene: 'RET proto-oncogene & GDNF', role: 'Guide vagal neural crest cell migration into the distal colon.' },
          { gene: 'SNAIL & SLUG', role: 'Repress E-cadherin to facilitate neural crest delamination and EMT.' },
          { gene: 'Endothelin-3 & EDNRB', role: 'Regulate enteric crest migration and melanocyte differentiation.' }
        ],
        clinicalNotes: 'Failure of neural crest migration to distal colon = Hirschsprung Disease (Congenital aganglionic megacolon, RET gene mutation). Neuroblastoma arises from neural crest in adrenal medulla / sympathetic chain.',
        keyVisualKey: 'neural_crest_migration'
      },
      {
        stageId: 'ns_stage_5',
        title: 'Special Senses: Optic & Otic Morphogenesis',
        timeframe: 'Weeks 4 - 8',
        carnegieStage: 'Stage 11 - 22',
        week: 7,
        embryoStageId: 'stage_w8',
        overview: 'The eye arises from diencephalic neuroectoderm (optic cup/retina), surface ectoderm (lens placode/corneal epithelium), and mesenchyme. The ear arises from the otic placode (inner ear), 1st/2nd pharyngeal arches (middle ear), and 1st pharyngeal cleft (external canal).',
        anatomicalEvents: [
          'Optic vesicle evaginates from diencephalon, induces surface ectoderm to form lens placode -> lens vesicle.',
          'Optic cup double layer forms neural retina and retinal pigment epithelium (RPE).',
          'Choroid fissure closes over hyaloid artery/vein (distal remnant becomes central retinal artery).',
          'Otic placode invaginates to form otic vesicle (otocyst) -> utricle, saccule, semicircular canals, and cochlear duct.'
        ],
        molecularSignaling: [
          { gene: 'PAX6', role: 'Master control gene for eye morphogenesis; mutations cause Aniridia and Peters anomaly.' },
          { gene: 'PAX2', role: 'Specifies optic stalk and ventral optic cup; controls choroid fissure closure.' }
        ],
        clinicalNotes: 'Failure of choroid fissure closure = Coloboma of the iris and retina (key-hole defect). Congenital rubella causes cataracts, sensorineural deafness, and PDA.',
        keyVisualKey: 'optic_otic_cups'
      }
    ],
    derivativesMatrix: [
      { embryonicStructure: 'Telencephalon (Neuroectoderm)', germLayer: 'ectoderm', adultDerivative: 'Cerebral cortex, Basal ganglia, Hippocampus, Lateral Ventricles', clinicalSignificance: 'Holoprosencephaly' },
      { embryonicStructure: 'Diencephalon (Neuroectoderm)', germLayer: 'ectoderm', adultDerivative: 'Thalamus, Hypothalamus, Epithalamus, Neurohypophysis, Retina, 3rd Ventricle', clinicalSignificance: 'Optic nerve hypoplasia' },
      { embryonicStructure: 'Mesencephalon (Neuroectoderm)', germLayer: 'ectoderm', adultDerivative: 'Midbrain, Superior/Inferior Colliculi, Cerebral Aqueduct', clinicalSignificance: 'Aqueductal stenosis hydrocephalus' },
      { embryonicStructure: 'Metencephalon (Neuroectoderm)', germLayer: 'ectoderm', adultDerivative: 'Pons, Cerebellum, Upper 4th Ventricle', clinicalSignificance: 'Dandy-Walker malformation (cerebellar vermis agenesis)' },
      { embryonicStructure: 'Myelencephalon (Neuroectoderm)', germLayer: 'ectoderm', adultDerivative: 'Medulla Oblongata, Lower 4th Ventricle', clinicalSignificance: 'Chiari II malformation' },
      { embryonicStructure: 'Neural Tube (Caudal)', germLayer: 'ectoderm', adultDerivative: 'Spinal cord (motor neurons, interneurons, ependymal canal)', clinicalSignificance: 'Poliomyelitis & Spinal Muscular Atrophy targets' },
      { embryonicStructure: 'Neural Crest (Cranial)', germLayer: 'neural_crest', adultDerivative: 'Cranial nerve sensory ganglia, Branchial arch bones/cartilage, Odontoblasts', clinicalSignificance: 'Treacher Collins syndrome' },
      { embryonicStructure: 'Neural Crest (Trunk)', germLayer: 'neural_crest', adultDerivative: 'Dorsal Root Ganglia, Sympathetic Chain, Adrenal Medulla Chromaffin cells, Schwann cells, Melanocytes', clinicalSignificance: 'Pheochromocytoma, Neuroblastoma, Albinism' },
      { embryonicStructure: 'Neural Crest (Enteric)', germLayer: 'neural_crest', adultDerivative: 'Myenteric (Auerbach) & Submucosal (Meissner) plexuses of GI tract', clinicalSignificance: 'Hirschsprung disease' }
    ],
    congenitalDefects: [
      {
        name: 'Neural Tube Defects (NTDs): Anencephaly & Spina Bifida',
        embryologicalBasis: 'Failure of the cranial (anencephaly) or caudal (spina bifida) neuropore to close by Day 25 or 28.',
        incidence: '1 in 1,000 live births (reduced by >70% with periconceptional folic acid)',
        presentation: 'Anencephaly: Absent calvarium/forebrain, polyhydramnios (inability to swallow). Spina Bifida Occulta: Tuft of hair/dimple over lower lumbar spine. Myelomeningocele: Herniation of meninges and neural tissue through vertebral defect.',
        diagnosticFinding: 'Elevated maternal serum alpha-fetoprotein (MSAFP) and amniotic acetylcholinesterase (AChE). Lemon and banana signs on fetal ultrasound.',
        usmlePearl: 'Meningocele contains ONLY meninges; Myelomeningocele contains meninges + spinal cord/nerve roots and is strongly associated with Chiari II malformation.'
      },
      {
        name: 'Holoprosencephaly (HPE)',
        embryologicalBasis: 'Failure of prosencephalon to cleave into right and left cerebral hemispheres due to defective SHH signaling or prechordal mesoderm deficiency.',
        incidence: '1 in 10,000 live births; 1 in 250 miscarriages',
        presentation: 'Spectrum of craniofacial midline anomalies: Cyclopia, proboscis, single central incisor, severe cleft lip/palate, fused thalami with single monoventricle.',
        diagnosticFinding: 'Brain MRI reveals absence of midline structures (corpus callosum, septum pellucidum) and single monoventricular cavity. Associated with Trisomy 13 (Patau) and maternal diabetes.',
        usmlePearl: 'Classic triad: Midline facial cleft + Holoprosencephaly + Polydactyly = Trisomy 13 (Patau syndrome).'
      },
      {
        name: 'Hirschsprung Disease (Congenital Aganglionic Megacolon)',
        embryologicalBasis: 'Failure of vagal neural crest cells to complete craniocaudal migration into the distal bowel (rectum and sigmoid colon).',
        incidence: '1 in 5,000 live births (4:1 male predominance)',
        presentation: 'Failure to pass meconium within first 48 hours of life, bilious vomiting, abdominal distension. Explosive expulsion of gas/stool on rectal exam ("squirt sign").',
        diagnosticFinding: 'Rectal suction biopsy (includes submucosa) demonstrates absence of ganglion cells and elevated acetylcholinesterase staining.',
        usmlePearl: 'Mutations in RET receptor tyrosine kinase are present in ~50% of familial cases. The aganglionic segment is CONSTRICTED; proximal normal bowel is DILATED (megacolon).'
      }
    ],
    highYieldBoardPearls: [
      'Cranial neuropore closes at Day 25; Caudal neuropore closes at Day 28.',
      'Elevated AFP in maternal serum + elevated Acetylcholinesterase (AChE) in amniotic fluid confirms open neural tube defects.',
      'Alar plate (dorsal) = Sensory (regulated by TGF-beta/BMP); Basal plate (ventral) = Motor (regulated by SHH from notochord).',
      'Dandy-Walker Malformation: Agenesis of cerebellar vermis + cystic dilation of 4th ventricle + enlarged posterior fossa.',
      'Chiari I: Herniation of cerebellar tonsils into foramen magnum (associated with syringomyelia); Chiari II: Herniation of vermis & tonsils + lumbosacral myelomeningocele.'
    ]
  },
  {
    id: 'gastrointestinal',
    name: 'Gastrointestinal System & Abdominal Organs',
    subtitle: 'Foregut, Midgut Herniation & 270° Rotation, Hindgut Septation, Liver & Pancreas Budding',
    iconName: 'Utensils',
    badge: 'Gut Tube Folding & 270° Rotation (Weeks 4 - 10)',
    color: {
      primary: 'rgb(245, 158, 11)',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]'
    },
    germLayers: ['endoderm', 'mesoderm', 'neural_crest'],
    masterGenes: ['SHH (Endoderm-mesenchyme signaling)', 'SOX2 (Esophagus/Stomach)', 'PDX1 (Pancreas specification)', 'CDX2 (Intestine)', 'PITX2 (Stomach rotation asymmetry)', 'HOX genes (Craniocaudal regionalization)'],
    systemOverview: 'The primitive gut tube forms during lateral and craniocaudal folding from the endodermal roof of the yolk sac. It divides into Foregut (celiac artery), Midgut (SMA), and Hindgut (IMA). Remarkable processes include midgut physiological herniation with 270° counter-clockwise rotation and dual pancreatic bud fusion.',
    criticalPeriod: 'Week 4 to Week 12 (Physiological umbilical herniation: Weeks 6-10)',
    stages: [
      {
        stageId: 'gi_stage_1',
        title: 'Primitive Gut Tube Formation & Subdivisions',
        timeframe: 'Week 4 (Days 22 - 28)',
        carnegieStage: 'Stage 10 - 12',
        week: 4,
        embryoStageId: 'stage_w4',
        overview: 'Craniocaudal and lateral embryonic folding incorporates the dorsal portion of the yolk sac into the embryo, creating a blind-ended tubular gut lined by endoderm.',
        anatomicalEvents: [
          'Foregut extends from oropharyngeal membrane to the liver bud outpocketing (celiac trunk supply).',
          'Midgut extends from liver bud to junction of right 2/3 and left 1/3 of transverse colon (SMA supply); temporarily communicates with yolk sac via Vitelline Duct (omphalomesenteric duct).',
          'Hindgut extends to cloacal membrane (IMA supply).'
        ],
        molecularSignaling: [
          { gene: 'SHH gradient', role: 'Secreted by endoderm to pattern surrounding splanchnic mesoderm into smooth muscle and enteric connective tissue.' },
          { gene: 'SOX2 / CDX2', role: 'SOX2 specifies anterior foregut (esophagus/stomach); CDX2 specifies midgut and hindgut intestinal epithelium.' }
        ],
        clinicalNotes: 'Persistence of the vitelline duct produces a Meckel Diverticulum (rule of 2s: 2% population, 2 feet from ileocecal valve, 2 inches long, 2 types of ectopic mucosa [gastric & pancreatic]).',
        keyVisualKey: 'primitive_gut_subdivisions'
      },
      {
        stageId: 'gi_stage_2',
        title: 'Stomach 90° Clockwise Rotation & Omental Bursa',
        timeframe: 'Weeks 5 - 6',
        carnegieStage: 'Stage 14 - 16',
        week: 5,
        embryoStageId: 'stage_w5',
        overview: 'The spindle-shaped stomach dilates and rotates 90° clockwise around its longitudinal axis. Posterior wall grows faster than anterior wall, creating the greater and lesser curvatures.',
        anatomicalEvents: [
          '90° Clockwise rotation moves original left side to anterior, and original right side to posterior.',
          'Left vagus nerve becomes Anterior Vagal Trunk; Right vagus nerve becomes Posterior Vagal Trunk.',
          'Dorsal mesogastrium is pulled to the left, creating the Lesser Sac (Omental Bursa).',
          'Spleen develops within the dorsal mesogastrium (mesodermal origin, supplied by celiac trunk/splenic artery).'
        ],
        molecularSignaling: [
          { gene: 'PITX2 & Barx1', role: 'Drives asymmetric left-sided proliferation of gastric muscularis and pyloric sphincter differentiation.' }
        ],
        clinicalNotes: 'Congenital Hypertrophic Pyloric Stenosis presents at 2-6 weeks of age with non-bilious projectile vomiting, olive-shaped epigastric mass, and hypochloremic hypokalemic metabolic alkalosis.',
        keyVisualKey: 'stomach_rotation'
      },
      {
        stageId: 'gi_stage_3',
        title: 'Liver, Gallbladder & Pancreatic Budding and Fusion',
        timeframe: 'Weeks 5 - 7',
        carnegieStage: 'Stage 13 - 18',
        week: 6,
        embryoStageId: 'stage_w6',
        overview: 'Hepatic diverticulum grows from distal foregut endoderm into the septum transversum. Pancreas arises from dual buds: Ventral bud (with bile duct) and Dorsal bud.',
        anatomicalEvents: [
          'Liver cords (hepatocytes) derive from endoderm; Kupffer cells, hematopoietic cells, and fibrous stroma derive from septum transversum mesoderm.',
          'Duodenum rotates clockwise to the right, causing the Ventral Pancreatic Bud to rotate dorsally behind the duodenum to fuse with the Dorsal Pancreatic Bud.',
          'Ventral bud forms: Uncinate process and inferior part of pancreatic head.',
          'Dorsal bud forms: Superior head, body, tail, and accessory duct of Santorini.',
          'Main pancreatic duct (Wirsung) is formed from ventral duct + distal dorsal duct.'
        ],
        molecularSignaling: [
          { gene: 'PDX1 (Pancreatic & Duodenal Homeobox 1)', role: 'Master gene for pancreatic agenesis vs endocrine/exocrine cell differentiation.' },
          { gene: 'FGF from cardiac mesoderm', role: 'Instructs adjacent foregut endoderm to adopt hepatic fate over ventral pancreas.' }
        ],
        clinicalNotes: 'Annular Pancreas results from bifid ventral pancreatic bud wrapping around the 2nd part of the duodenum, causing duodenal stenosis/atresia (double bubble sign on US/X-ray). Pancreas Divisum results from failure of ventral and dorsal ducts to fuse.',
        keyVisualKey: 'pancreatic_buds_fusion'
      },
      {
        stageId: 'gi_stage_4',
        title: 'Midgut Herniation & 270° Counter-Clockwise Rotation',
        timeframe: 'Weeks 6 - 10',
        carnegieStage: 'Stage 16 - 22',
        week: 7,
        embryoStageId: 'stage_w8',
        overview: 'Because of rapid liver and kidney growth, the elongated midgut loop herniates into the extraembryonic coelom of the umbilical cord at Week 6, undergoing a total 270° counter-clockwise rotation around the Superior Mesenteric Artery (SMA).',
        anatomicalEvents: [
          'Primary midgut loop has Cranial limb (jejunum, upper ileum) and Caudal limb (lower ileum, cecum, appendix, ascending colon, proximal 2/3 transverse colon).',
          'First 90° rotation occurs during herniation into umbilical cord (Week 6).',
          'At Week 10, midgut returns to abdominal cavity, undergoing an additional 180° rotation (total 270° CCW).',
          'Jejunum returns first (occupies upper left); Cecal bud returns last (descends into right lower quadrant).',
          'Dorsal mesenteries of ascending and descending colon fuse with posterior body wall (become secondarily retroperitoneal).'
        ],
        molecularSignaling: [
          { gene: 'FGF8 & Wnt signaling', role: 'Regulate intestinal loop elongation and mesenteric vascular remodeling.' }
        ],
        clinicalNotes: 'Omphalocele: Herniation of abdominal viscera into persistent umbilical cord covered by peritoneal membrane (associated with Trisomy 13, 18, Beckwith-Wiedemann). Gastroschisis: Extrusion of bowel through full-thickness paraumbilical abdominal wall defect without covering sac.',
        keyVisualKey: 'midgut_rotation_herniation'
      },
      {
        stageId: 'gi_stage_5',
        title: 'Hindgut & Cloacal Septation into Rectum and Urogenital Sinus',
        timeframe: 'Weeks 6 - 8',
        carnegieStage: 'Stage 15 - 21',
        week: 7,
        embryoStageId: 'stage_w8',
        overview: 'The Urorectal Septum (mesoderm) grows caudally toward the cloacal membrane, dividing the cloaca into the anterior Urogenital Sinus and posterior Anorectal Canal.',
        anatomicalEvents: [
          'Urorectal septum fuses with cloacal membrane at the Perineal Body by Week 7.',
          'Anal pit (proctodeum) invaginates from surface ectoderm to meet the endodermal anorectal canal.',
          'Pectinate (Dentate) Line marks the embryological junction: Above = Endoderm (superior rectal artery, portal drainage, visceral innervation, internal hemorrhoids); Below = Ectoderm (inferior rectal artery, caval drainage, somatic pudendal nerve, external hemorrhoids).'
        ],
        molecularSignaling: [
          { gene: 'SHH & BMP4', role: 'Coordinate cloacal endoderm apoptosis and perineal body fusion.' }
        ],
        clinicalNotes: 'Imperforate Anus / Anorectal Malformations occur due to abnormal urorectal septum development (often with rectovesical, rectourethral, or rectovaginal fistulas). Part of VACTERL association.',
        keyVisualKey: 'cloacal_septation'
      }
    ],
    derivativesMatrix: [
      { embryonicStructure: 'Pharynx, Esophagus, Stomach', germLayer: 'endoderm', adultDerivative: 'Upper GI tract to proximal duodenum', clinicalSignificance: 'Esophageal atresia with TEF' },
      { embryonicStructure: 'Duodenum (1st & 2nd parts)', germLayer: 'endoderm', adultDerivative: 'Proximal Duodenum (Dual blood supply: Celiac & SMA)', clinicalSignificance: 'Duodenal atresia (Double bubble)' },
      { embryonicStructure: 'Ventral Pancreatic Bud', germLayer: 'endoderm', adultDerivative: 'Uncinate Process & Main Pancreatic Duct (Wirsung)', clinicalSignificance: 'Annular pancreas' },
      { embryonicStructure: 'Dorsal Pancreatic Bud', germLayer: 'endoderm', adultDerivative: 'Head (upper), Body, Tail, & Accessory Duct (Santorini)', clinicalSignificance: 'Pancreas divisum' },
      { embryonicStructure: 'Hepatic Diverticulum (Liver bud)', germLayer: 'endoderm', adultDerivative: 'Hepatocyte cords & Biliary tree', clinicalSignificance: 'Biliary atresia' },
      { embryonicStructure: 'Septum Transversum', germLayer: 'mesoderm', adultDerivative: 'Central tendon of diaphragm, Kupffer cells, Liver hematopoietic stroma', clinicalSignificance: 'Congenital diaphragmatic hernia' },
      { embryonicStructure: 'Midgut Loop (Cranial Limb)', germLayer: 'endoderm', adultDerivative: 'Distal duodenum, Jejunum, Ileum', clinicalSignificance: 'Intestinal malrotation / Midgut volvulus' },
      { embryonicStructure: 'Midgut Loop (Caudal Limb)', germLayer: 'endoderm', adultDerivative: 'Cecum, Appendix, Ascending Colon, Proximal 2/3 Transverse Colon', clinicalSignificance: 'Appendiceal duplication, Malrotation' },
      { embryonicStructure: 'Vitelline Duct (Omphalomesenteric)', germLayer: 'endoderm', adultDerivative: 'Normally obliterates in Week 7', clinicalSignificance: 'Meckel diverticulum, Vitelline fistula, Vitelline cyst' },
      { embryonicStructure: 'Hindgut', germLayer: 'endoderm', adultDerivative: 'Distal 1/3 Transverse Colon, Descending Colon, Sigmoid, Rectum (upper 2/3)', clinicalSignificance: 'Hirschsprung disease, Imperforate anus' }
    ],
    congenitalDefects: [
      {
        name: 'Omphalocele vs. Gastroschisis',
        embryologicalBasis: 'Omphalocele: Failure of lateral ectomesodermal body wall folds to close + midgut fails to return at Week 10. Gastroschisis: Incomplete closure of lateral fold resulting in full-thickness paraumbilical defect (usually right of umbilicus) due to involution of right umbilical vein.',
        incidence: 'Omphalocele: 1 in 4,000; Gastroschisis: 1 in 2,500',
        presentation: 'Omphalocele: Viscera covered by sac (peritoneum & amnion) with umbilical cord inserting at apex; >50% have associated chromosomal/cardiac defects. Gastroschisis: Bare loops of bowel floating free in amniotic fluid without a sac; elevated AFP; usually isolated defect.',
        diagnosticFinding: 'Fetal ultrasound and elevated MSAFP. Omphalocele has midline covered sac; Gastroschisis has free-floating herniated bowel to the right of midline cord.',
        usmlePearl: 'Omphalocele = SEALED with sac (associated with Trisomy 13, 18, Beckwith-Wiedemann); Gastroschisis = GONE naked (no sac, right of cord, intestinal damage from amniotic fluid).'
      },
      {
        name: 'Meckel Diverticulum',
        embryologicalBasis: 'Partial failure of the Vitelline (Omphalomesenteric) Duct to obliterate by Week 7 of gestation.',
        incidence: '2% of the general population',
        presentation: 'Rule of 2s: 2% prevalence, 2:1 male-to-female ratio, 2 feet from ileocecal valve, 2 inches long, presents before 2 years old, contains 2 ectopic tissues (Gastric & Pancreatic). Painless lower GI rectal bleeding (currant jelly stool) or intussusception/diverticulitis.',
        diagnosticFinding: 'Technetium-99m pertechnetate scan ("Meckel scan") identifies ectopic gastric mucosa avidly uptaking pertechnetate.',
        usmlePearl: 'True diverticulum containing all 3 layers of bowel wall (mucosa, submucosa, muscularis externa).'
      },
      {
        name: 'Duodenal Atresia vs. Jejunal/Ileal Atresia',
        embryologicalBasis: 'Duodenal Atresia: Failure of recanalization of duodenal lumen after solid epithelial proliferation in Week 8. Jejunal/Ileal Atresia: Vascular accident (ischemic necrosis) in utero leading to resorption of necrotic bowel and "apple-peel" bowel deformity.',
        incidence: 'Duodenal: 1 in 7,000; Jejunoileal: 1 in 3,000',
        presentation: 'Duodenal: Bilious vomiting within first 24-48 hours of life, associated with Down Syndrome (Trisomy 21). Jejunoileal: Abdominal distension, bilious vomiting, necrotic bowel remnants coiled around SMA.',
        diagnosticFinding: 'Duodenal Atresia: "Double bubble" sign on abdominal X-ray (air in stomach and duodenal bulb). Polyhydramnios in utero.',
        usmlePearl: 'Duodenal atresia = Failure of recanalization + Trisomy 21. Jejunal/ileal atresia = Vascular accident (thrombosis/volvulus).'
      }
    ],
    highYieldBoardPearls: [
      'Midgut undergoes 270° counter-clockwise rotation total (90° during herniation at Wk 6, 180° upon return at Wk 10).',
      'The Pectinate Line divides endoderm (above, painless internal hemorrhoids, celiac/IMA portal flow) from ectoderm (below, somatic painful external hemorrhoids, pudendal nerve).',
      'Annular Pancreas results from failure of ventral pancreatic bud rotation, strangling the 2nd part of the duodenum.',
      'Spleen is mesodermal in origin (derived from dorsal mesogastrium) but supplied by celiac artery (splenic branch).',
      'Epithelial lining of entire GI tract is Endoderm; Smooth muscle, serosa, and blood vessels are Splanchnic Mesoderm; Enteric ganglia are Neural Crest.'
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory System',
    subtitle: 'Laryngotracheal Groove, Lung Bud Branching, 5 Stages of Lung Development & Surfactant',
    iconName: 'Wind',
    badge: '5 Stereotypic Stages: Embryonic to Alveolar (Wk 4 - Postnatal)',
    color: {
      primary: 'rgb(6, 182, 212)',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'
    },
    germLayers: ['endoderm', 'mesoderm'],
    masterGenes: ['NKX2-1 (TTF-1 / Thyroid Transcription Factor 1)', 'FGF10 (Drives branching morphogenesis)', 'BMP4 (Inhibits lateral budding to promote elongation)', 'SHH (Regulates mesenchymal differentiation)', 'VEGF (Pulmonary capillary network)'],
    systemOverview: 'The respiratory diverticulum (lung bud) evaginates from the ventral wall of the foregut endoderm. Branching morphogenesis into surrounding splanchnic mesoderm establishes 23 generations of bronchial divisions across 5 distinct developmental phases: Embryonic, Pseudoglandular, Canalicular, Saccular, and Alveolar.',
    criticalPeriod: 'Week 4 to 8 Years Postnatal (Surfactant mature by Week 35)',
    stages: [
      {
        stageId: 'resp_stage_1',
        title: 'Embryonic Period: Lung Bud Evagination',
        timeframe: 'Weeks 4 - 7',
        carnegieStage: 'Stage 10 - 18',
        week: 4,
        embryoStageId: 'stage_w4',
        overview: 'Respiratory diverticulum emerges from ventral foregut endoderm. Tracheoesophageal ridges fuse to separate the dorsal esophagus from the ventral trachea and lung buds.',
        anatomicalEvents: [
          'Tracheoesophageal septum divides foregut into ventral laryngotracheal tube and dorsal esophagus.',
          'Right lung bud forms 3 secondary bronchial buds (future 3 lobes); Left forms 2 secondary buds (future 2 lobes).',
          'Tertiary (segmental) bronchi form: 10 on right, 8-10 on left.'
        ],
        molecularSignaling: [
          { gene: 'NKX2-1 (TTF-1)', role: 'Essential for lung specification; loss results in tracheoesophageal fistula and pulmonary agenesis.' },
          { gene: 'FGF10', role: 'Secreted by distal mesenchyme to attract advancing endodermal epithelial buds.' }
        ],
        clinicalNotes: 'Incomplete separation by the tracheoesophageal septum causes Tracheoesophageal Fistula (TEF), most commonly Type C (blind upper esophagus with distal TEF).',
        keyVisualKey: 'lung_bud_evagination'
      },
      {
        stageId: 'resp_stage_2',
        title: 'Pseudoglandular Period: Conducting Airway Branching',
        timeframe: 'Weeks 5 - 16',
        carnegieStage: 'Stage 14 - Fetus',
        week: 8,
        embryoStageId: 'stage_w8',
        overview: 'Branching continues up to the formation of terminal bronchioles. Histologically resembles an exocrine gland with simple columnar/cuboidal epithelium. Respiration is impossible; survival outside womb = 0%.',
        anatomicalEvents: [
          'Developing airways are surrounded by a loose vascular mesenchyme.',
          'Cartilage, smooth muscle, and connective tissue differentiate from splanchnic mesoderm.',
          'Diaphragm completes fusion by Week 7 from 4 components: (1) Septum transversum, (2) Pleuroperitoneal membranes, (3) Dorsal mesentery of esophagus, (4) Muscular body wall ingrowth.'
        ],
        molecularSignaling: [
          { gene: 'BMP4 / SHH', role: 'SHH at the bud tip inhibits FGF10, causing the tip to cleft and split into two daughter buds (bifurcation).' }
        ],
        clinicalNotes: 'Congenital Diaphragmatic Hernia (Bochdalek, posterolateral left side) occurs if pleuroperitoneal membrane fails to close, leading to fatal pulmonary hypoplasia.',
        keyVisualKey: 'pseudoglandular_histology'
      },
      {
        stageId: 'resp_stage_3',
        title: 'Canalicular Period: Vascularization & Respiratory Bronchioles',
        timeframe: 'Weeks 16 - 26',
        carnegieStage: 'Fetal Period',
        week: 20,
        embryoStageId: 'stage_w20',
        overview: 'Terminal bronchioles divide into respiratory bronchioles, which divide into alveolar ducts. Prominent vascularization with capillaries approaching the airway epithelium. Respiration becomes marginally possible towards Week 24-25.',
        anatomicalEvents: [
          'Lumens of bronchi and terminal bronchioles enlarge significantly.',
          'Capillaries proliferate in mesenchyme and come into close apposition with endodermal epithelium.',
          'Type I and Type II pneumocytes begin differentiation at ~20 weeks.',
          'Type II pneumocytes begin producing surfactant (dipalmitoylphosphatidylcholine - DPPC) by Week 20-22.'
        ],
        molecularSignaling: [
          { gene: 'VEGF', role: 'Stimulates intense pulmonary angiogenesis to create the future blood-air barrier.' },
          { gene: 'Glucocorticoids (Cortisol)', role: 'Stimulate Type II pneumocyte maturation and accelerate surfactant synthesis.' }
        ],
        clinicalNotes: 'Preterm birth before Week 24 has high mortality due to pulmonary immaturity, inadequate gas exchange surface area, and severe surfactant deficiency.',
        keyVisualKey: 'canalicular_vascularization'
      },
      {
        stageId: 'resp_stage_4',
        title: 'Saccular Period: Primitive Alveoli & Blood-Air Barrier',
        timeframe: 'Weeks 26 - 36',
        carnegieStage: 'Fetal Period',
        week: 28,
        embryoStageId: 'stage_w28',
        overview: 'Terminal sacs (primitive alveoli) develop with very thin epithelium. Capillaries bulge into alveolar sacs to establish the definitive blood-air barrier. Fetal breathing movements condition respiratory muscles.',
        anatomicalEvents: [
          'Type I pneumocytes thin out dramatically to cover 95% of alveolar surface area.',
          'Type II pneumocytes (cuboidal) multiply and secrete surfactant into amniotic fluid.',
          'Amniocentesis Lecithin:Sphingomyelin (L:S) ratio rises; an L:S ratio > 2.0 indicates mature lungs (usually by Week 35).'
        ],
        molecularSignaling: [
          { gene: 'Surfactant Proteins (SP-A, SP-B, SP-C, SP-D)', role: 'SP-B and SP-C lower alveolar surface tension and prevent end-expiratory atelectasis.' }
        ],
        clinicalNotes: 'Neonatal Respiratory Distress Syndrome (NRDS / Hyaline Membrane Disease) is caused by surfactant deficiency in premature infants; treated with maternal betamethasone prenatally and exogenous surfactant postnatally.',
        keyVisualKey: 'saccular_barrier'
      },
      {
        stageId: 'resp_stage_5',
        title: 'Alveolar Period: Secondary Septation',
        timeframe: 'Week 36 to 8 Years Postnatal',
        carnegieStage: 'Late Fetus & Postnatal',
        week: 38,
        embryoStageId: 'stage_term',
        overview: 'Primitive alveoli undergo secondary septation to form true adult mature alveoli. Only 15-20% of adult alveoli are present at birth; remaining 80-85% develop postnatally through age 8.',
        anatomicalEvents: [
          'Secondary septa contain elastin and collagen, dividing saccules into smaller alveoli and increasing gas exchange surface area.',
          'Number of alveoli increases from ~20-50 million at birth to ~300-500 million in adults.'
        ],
        molecularSignaling: [
          { gene: 'PDGF-A', role: 'Essential for myofibroblast migration and secondary crest formation during alveolar septation.' }
        ],
        clinicalNotes: 'Exposure to hyperoxia and mechanical ventilation in premature infants halts alveolar septation, causing Bronchopulmonary Dysplasia (BPD).',
        keyVisualKey: 'alveolar_septation'
      }
    ],
    derivativesMatrix: [
      { embryonicStructure: 'Respiratory Diverticulum Endoderm', germLayer: 'endoderm', adultDerivative: 'Epithelial lining of Larynx, Trachea, Bronchi & Alveoli (Type I & II pneumocytes)', clinicalSignificance: 'Bronchogenic carcinoma cell origin' },
      { embryonicStructure: 'Splanchnic Lateral Plate Mesoderm', germLayer: 'mesoderm', adultDerivative: 'Cartilage, Smooth muscle, Connective tissue, Visceral Pleura & Pulmonary vessels', clinicalSignificance: 'Pulmonary sequestration' },
      { embryonicStructure: 'Somatic Lateral Plate Mesoderm', germLayer: 'mesoderm', adultDerivative: 'Parietal Pleura', clinicalSignificance: 'Pleuritic chest pain (phrenic & intercostal somatic nerves)' },
      { embryonicStructure: 'Septum Transversum', germLayer: 'mesoderm', adultDerivative: 'Central tendon of diaphragm', clinicalSignificance: 'Morgagni hernia' },
      { embryonicStructure: 'Pleuroperitoneal Membranes', germLayer: 'mesoderm', adultDerivative: 'Posterolateral muscular domes of diaphragm', clinicalSignificance: 'Bochdalek hernia (Left > Right)' }
    ],
    congenitalDefects: [
      {
        name: 'Tracheoesophageal Fistula (TEF) & Esophageal Atresia (EA)',
        embryologicalBasis: 'Failure of the tracheoesophageal septum to completely separate the ventral laryngotracheal tube from the dorsal esophagus at Weeks 4-5.',
        incidence: '1 in 3,500 live births',
        presentation: 'Type C (85% of cases): Blind upper esophageal pouch + distal fistula between lower esophagus and trachea. Polyhydramnios in utero; neonate presents with copious frothy oral secretions, choking, coughing, and cyanosis with first feed.',
        diagnosticFinding: 'Inability to pass nasogastric (NG) tube into stomach (coils in upper esophageal pouch on CXR); air-filled stomach and intestines on abdominal X-ray due to distal fistula.',
        usmlePearl: 'Associated with VACTERL association: Vertebral, Anal atresia, Cardiac, TE fistula, Renal, Limb abnormalities.'
      },
      {
        name: 'Congenital Diaphragmatic Hernia (CDH / Bochdalek)',
        embryologicalBasis: 'Failure of the pleuroperitoneal membrane to fuse with the septum transversum and esophageal mesentery at Week 7 (85% on left side).',
        incidence: '1 in 2,500 live births',
        presentation: 'Abdominal contents (stomach, bowel loops, spleen) herniate into thoracic cavity, compressing ipsilateral and contralateral lung buds, causing fatal Pulmonary Hypoplasia and pulmonary hypertension.',
        diagnosticFinding: 'Scaphoid abdomen (sunken), bowel sounds heard over left thorax, severe respiratory distress at birth; CXR shows bowel loops in hemithorax with mediastinal shift.',
        usmlePearl: 'Mortality is determined by the degree of underlying Pulmonary Hypoplasia, not the size of the hernia itself.'
      },
      {
        name: 'Neonatal Respiratory Distress Syndrome (NRDS)',
        embryologicalBasis: 'Surfactant deficiency due to prematurity (<35 weeks) or poorly controlled maternal diabetes (fetal hyperinsulinemia suppresses surfactant synthesis).',
        incidence: '60% of infants born at <28 weeks; 5% born at 34-36 weeks',
        presentation: 'Tachypnea, nasal flaring, intercostal retractions, grunting, and cyanosis within minutes to hours after birth.',
        diagnosticFinding: 'CXR reveals diffuse, uniform "ground-glass" reticulogranular opacities with prominent air bronchograms and low lung volumes.',
        usmlePearl: 'Lecithin (DPPC) to Sphingomyelin ratio (L:S ratio) > 2.0 indicates fetal lung maturity. Treatment: Maternal betamethasone prior to delivery; post-natal intratracheal surfactant.'
      }
    ],
    highYieldBoardPearls: [
      'Mnemonic for 5 stages of lung development: Every Premature Child Sucks Air (Embryonic, Pseudoglandular, Canalicular, Saccular, Alveolar).',
      'Surfactant is produced by Type II pneumocytes starting at Week 20-22, but mature levels are reached only around Week 35.',
      'Type I pneumocytes = 95% of alveolar surface area, gas exchange; Type II pneumocytes = Surfactant synthesis + stem cells for regeneration after injury.',
      'Diaphragm innervation: C3, C4, C5 keep the diaphragm alive (Phrenic nerve) because the septum transversum originated in the cervical region.',
      'Oligohydramnios (e.g., bilateral renal agenesis / Potter sequence) causes severe pulmonary hypoplasia because fetal breathing of amniotic fluid is required for lung expansion.'
    ]
  },
  {
    id: 'urogenital',
    name: 'Urogenital System',
    subtitle: 'Pronephros to Metanephros, Ureteric Bud Branching, Wolffian vs. Müllerian Ducts & Genital Homologies',
    iconName: 'Activity',
    badge: '3 Renal Systems & Sexual Differentiation (Wks 4 - 12)',
    color: {
      primary: 'rgb(16, 185, 129)',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
    },
    germLayers: ['mesoderm', 'endoderm', 'neural_crest'],
    masterGenes: ['SRY / TDF (Y chromosome master switch)', 'SOX9 & SF1 (Sertoli differentiation)', 'WT1 (Wilms tumor suppressor / Metanephric induction)', 'GDNF & RET (Ureteric bud outgrowth)', 'WNT4 / DAX1 (Ovarian determination)', 'AMH / MIS (Müllerian regression)'],
    systemOverview: 'The urogenital system develops from the Intermediate Mesoderm. Three successive kidney systems form: Pronephros (regresses), Mesonephros (interim excretory organ), and Metanephros (definitive adult kidney). Sex determination is driven by SRY on the Y chromosome, controlling internal duct persistence and external genital masculinization.',
    criticalPeriod: 'Week 4 to Week 12 (Definitive urine production begins at Week 10-12)',
    stages: [
      {
        stageId: 'ug_stage_1',
        title: 'Three Renal Systems: Pronephros, Mesonephros & Metanephros',
        timeframe: 'Weeks 4 - 5',
        carnegieStage: 'Stage 10 - 14',
        week: 4,
        embryoStageId: 'stage_w4',
        overview: 'Cranio-caudal progression of 3 renal systems develops in the nephrogenic cord of intermediate mesoderm.',
        anatomicalEvents: [
          'Pronephros: 7-10 cervical nephrotomes appear at Week 4 and completely regress by end of Week 4.',
          'Mesonephros: Functional interim kidney during Weeks 4-8; Mesonephric (Wolffian) duct drains into cloaca; tubules form male genital ducts (ductuli efferentes).',
          'Metanephros: Appears at Week 5 in sacral region as the permanent adult kidney.'
        ],
        molecularSignaling: [
          { gene: 'PAX2 / WT1', role: 'Competence of intermediate mesoderm to undergo nephrogenic condensation.' }
        ],
        clinicalNotes: 'Failure of mesonephric duct regression in females leaves Gartner Ducts / Gartner cysts in the lateral vaginal wall.',
        keyVisualKey: 'three_renal_systems'
      },
      {
        stageId: 'ug_stage_2',
        title: 'Metanephric Induction & Ureteric Bud Branching',
        timeframe: 'Weeks 5 - 8',
        carnegieStage: 'Stage 13 - 22',
        week: 6,
        embryoStageId: 'stage_w6',
        overview: 'Definitive kidney develops via reciprocal inductive signaling between the Ureteric Bud (outgrowth of mesonephric duct) and the Metanephric Mesenchyme (blastema).',
        anatomicalEvents: [
          'Ureteric Bud gives rise to: Ureter, Renal Pelvis, Major & Minor Calyces, and Collecting Ducts (1-3 million collecting tubules).',
          'Metanephric Blastema gives rise to: Glomeruli, Bowman capsule, Proximal Convoluted Tubule, Loop of Henle, and Distal Convoluted Tubule.',
          'Ascensus of the Kidney: Kidneys ascend from sacral pelves (L4-S1) to lumbar region (T12-L3), rotating 90° medially so hilum faces anteromedially.'
        ],
        molecularSignaling: [
          { gene: 'WT1', role: 'Expressed by metanephric mesenchyme to enable response to ureteric induction.' },
          { gene: 'GDNF & HGF', role: 'Secreted by blastema to bind RET and MET receptors on ureteric bud, stimulating bud outgrowth and dichotomous branching.' },
          { gene: 'WNT4 / FGF2', role: 'Synthesized by ureteric bud to induce mesenchyme-to-epithelial transition (MET) into nephrons.' }
        ],
        clinicalNotes: 'Ureteric bud fails to branch = Renal Agenesis (bilateral = Potter Sequence). Early splitting of ureteric bud = Duplex collecting system / Bifid ureter (risk of vesicoureteral reflux). Horseshoe Kidney: Inferior poles fuse in pelvis and get trapped under Inferior Mesenteric Artery (IMA) at L3.',
        keyVisualKey: 'ureteric_bud_induction'
      },
      {
        stageId: 'ug_stage_3',
        title: 'Gonadal Determination: Testes vs. Ovaries',
        timeframe: 'Weeks 6 - 8',
        carnegieStage: 'Stage 16 - 22',
        week: 7,
        embryoStageId: 'stage_w8',
        overview: 'Indifferent gonads develop from genital ridges on the posterior abdominal wall. Primordial Germ Cells (PGCs) migrate from the yolk sac wall along the dorsal mesentery into the genital ridges at Week 6.',
        anatomicalEvents: [
          'If XY (SRY Present): Testis-Determining Factor (TDF) induces medullary cords -> Testis cords / Seminiferous tubules. Sertoli cells produce Anti-Müllerian Hormone (AMH); Leydig cells produce Testosterone.',
          'If XX (SRY Absent): Cortical cords develop into ovarian follicles enclosing primary oocytes.',
          'Testicular descent: Guided by the Gubernaculum and Processus Vaginalis from posterior abdomen into the scrotum by Month 7-9.'
        ],
        molecularSignaling: [
          { gene: 'SRY / SOX9', role: 'Drives Sertoli cell differentiation; activates FGF9 in positive feedback loop to masculinize gonad.' },
          { gene: 'Anti-Müllerian Hormone (AMH / MIS)', role: 'Secreted by Sertoli cells to induce apoptosis of Paramesonephric (Müllerian) ducts.' },
          { gene: 'Testosterone & DHT', role: 'Testosterone stabilizes Wolffian duct (internal); 5-alpha reductase converts T -> DHT to masculinize external genitalia.' },
          { gene: 'WNT4 / DAX1', role: 'Promotes ovarian development and suppresses Sox9 in 46,XX embryos.' }
        ],
        clinicalNotes: 'Cryptorchidism: Failure of one or both testes to descend into the scrotum; increases risk of testicular germ cell tumors and infertility. Hydrocele: Patent processus vaginalis allowing peritoneal fluid into tunica vaginalis (transilluminates on exam).',
        keyVisualKey: 'gonadal_determination'
      },
      {
        stageId: 'ug_stage_4',
        title: 'Internal Genital Ducts: Wolffian vs. Müllerian',
        timeframe: 'Weeks 7 - 10',
        carnegieStage: 'Stage 18 - Fetus',
        week: 8,
        embryoStageId: 'stage_w8',
        overview: 'Both male and female embryos initially possess two pairs of genital ducts: Mesonephric (Wolffian) and Paramesonephric (Müllerian) ducts.',
        anatomicalEvents: [
          'Male (46,XY): AMH causes Müllerian duct regression. Testosterone stimulates Wolffian duct -> Epididymis, Vas deferens, Seminal vesicles, Ejaculatory ducts (SEED).',
          'Female (46,XX): Absence of AMH allows Müllerian ducts to develop into: Fallopian (Uterine) Tubes, Uterus, Cervix, and Upper 1/3 of Vagina. Absence of testosterone causes Wolffian ducts to degenerate.'
        ],
        molecularSignaling: [
          { gene: 'HoxA genes (Hoxa9, 10, 11, 13)', role: 'Pattern craniocaudal subdivisions of female reproductive tract (tubes, uterus, cervix, upper vagina).' }
        ],
        clinicalNotes: 'Müllerian duct fusion defects: Bicornuate uterus (partial failure of fusion), Uterus didelphys (complete failure of fusion), Septate uterus (failure of central resorption). Androgen Insensitivity Syndrome (46,XY with female external phenotype, undescended testes, no uterus/tubes, blind vaginal pouch).',
        keyVisualKey: 'internal_genital_ducts'
      },
      {
        stageId: 'ug_stage_5',
        title: 'External Genitalia Morphogenesis & Homologies',
        timeframe: 'Weeks 9 - 12',
        carnegieStage: 'Stage 22 - Fetal',
        week: 12,
        embryoStageId: 'stage_w12',
        overview: 'Indifferent external genitalia comprise: Genital Tubercle, Urogenital Folds, Labioscrotal Swellings, and Urogenital Sinus.',
        anatomicalEvents: [
          'Male (under DHT): Genital Tubercle -> Glans penis & Corpora cavernosa/spongiosum; Urogenital folds fuse -> Penile (spongy) urethra; Labioscrotal swellings fuse -> Scrotum.',
          'Female (Estrogen): Genital Tubercle -> Clitoris; Urogenital folds remain open -> Labia minora; Labioscrotal swellings remain open -> Labia majora; Urogenital sinus -> Lower 2/3 of Vagina (sinovaginal bulbs) & Greater vestibular (Bartholin) glands.'
        ],
        molecularSignaling: [
          { gene: '5-alpha-Reductase', role: 'Converts Testosterone into Dihydrotestosterone (DHT) in target tissues.' },
          { gene: 'Androgen Receptor (AR)', role: 'Nuclear hormone receptor mediating DHT masculinization of external genitalia.' }
        ],
        clinicalNotes: 'Hypospadias: Failure of urethral folds to fuse ventrally on underside of penis (associated with cryptorchidism). Epispadias: Faulty positioning of genital tubercle, resulting in urethral opening on dorsal surface of penis (associated with Bladder Exstrophy).',
        keyVisualKey: 'external_genitalia_homology'
      }
    ],
    derivativesMatrix: [
      { embryonicStructure: 'Ureteric Bud', germLayer: 'mesoderm', adultDerivative: 'Ureter, Renal Pelvis, Major & Minor Calyces, Collecting Ducts', clinicalSignificance: 'Bifid ureter, Duplex kidney' },
      { embryonicStructure: 'Metanephric Blastema', germLayer: 'mesoderm', adultDerivative: 'Glomerulus, Bowman capsule, PCT, Loop of Henle, DCT', clinicalSignificance: 'Renal agenesis, Wilms tumor' },
      { embryonicStructure: 'Mesonephric (Wolffian) Duct (Male)', germLayer: 'mesoderm', adultDerivative: 'Seminal vesicles, Epididymis, Ejaculatory duct, Ductus deferens (SEED)', clinicalSignificance: 'Congenital bilateral absence of vas deferens (CBAVD) in Cystic Fibrosis' },
      { embryonicStructure: 'Mesonephric Duct (Female Remnant)', germLayer: 'mesoderm', adultDerivative: 'Gartner duct/cyst, Epoophoron, Paroophoron', clinicalSignificance: 'Gartner duct cyst in vaginal wall' },
      { embryonicStructure: 'Paramesonephric (Müllerian) Duct (Female)', germLayer: 'mesoderm', adultDerivative: 'Fallopian tubes, Uterus, Cervix, Upper 1/3 of Vagina', clinicalSignificance: 'Bicornuate / Septate uterus' },
      { embryonicStructure: 'Paramesonephric Duct (Male Remnant)', germLayer: 'mesoderm', adultDerivative: 'Appendix testis, Prostatic utricle', clinicalSignificance: 'Torsion of appendix testis' },
      { embryonicStructure: 'Genital Tubercle', germLayer: 'mesoderm', adultDerivative: 'Male: Glans penis, Corpus cavernosum/spongiosum; Female: Clitoris, Vestibular bulbs', clinicalSignificance: 'Hypospadias, Epispadias' },
      { embryonicStructure: 'Urogenital (Urethral) Folds', germLayer: 'mesoderm', adultDerivative: 'Male: Penile urethra & ventral shaft; Female: Labia minora', clinicalSignificance: 'Hypospadias' },
      { embryonicStructure: 'Labioscrotal (Genital) Swellings', germLayer: 'mesoderm', adultDerivative: 'Male: Scrotum; Female: Labia majora', clinicalSignificance: 'Bifid scrotum' }
    ],
    congenitalDefects: [
      {
        name: 'Potter Sequence (Oligohydramnios Sequence)',
        embryologicalBasis: 'Bilateral renal agenesis (failure of ureteric buds to induce metanephric blastema) or severe urinary tract obstruction (posterior urethral valves).',
        incidence: '1 in 4,000 live births',
        presentation: 'POTTER mnemonic: Pulmonary hypoplasia (cause of death), Oligohydramnios, Twisted face (Potter facies: low-set ears, flattened nose, micrognathia), Extremity defects (clubbed feet), Renal failure in utero.',
        diagnosticFinding: 'Anhydramnios on prenatal ultrasound; absent bilateral renal parenchyma and renal arteries on Doppler.',
        usmlePearl: 'Amniotic fluid is swallowed by fetus and excreted as fetal urine after Week 12; lack of fetal urine causes severe oligohydramnios and fatal pulmonary compression.'
      },
      {
        name: 'Horseshoe Kidney (Renal Ectopia)',
        embryologicalBasis: 'Fusion of the lower (inferior) poles of the metanephroi while still in the pelvis during Weeks 5-8. During ascensus, the fused kidney gets trapped under the Inferior Mesenteric Artery (IMA) at L3.',
        incidence: '1 in 500 live births',
        presentation: 'Usually asymptomatic; increased risk of ureteropelvic junction (UPJ) obstruction, hydronephrosis, nephrolithiasis, and renal cell carcinoma. Strongly associated with Turner syndrome (45,XO) and Trisomy 18.',
        diagnosticFinding: 'CT or US shows U-shaped parenchymal bridge connecting lower poles across midline anterior to the aorta and IVC, anchored at L3 below the origin of the IMA.',
        usmlePearl: 'The ascent of the horseshoe kidney is arrested by the Inferior Mesenteric Artery (IMA), NOT the SMA or celiac trunk.'
      },
      {
        name: '5-alpha-Reductase Deficiency vs. Androgen Insensitivity Syndrome (AIS)',
        embryologicalBasis: '5-alpha-Reductase Deficiency: Inability to convert Testosterone to DHT (Autosomal Recessive, 46,XY). AIS: X-linked recessive defect in Androgen Receptor (46,XY).',
        incidence: 'AIS: 1 in 20,000; 5-alpha: Rare',
        presentation: '5-alpha-reductase: Ambiguous genitalia at birth; at puberty, dramatic surge in testosterone masculinizes voice, body hair, and causes clitoromegaly/phallus growth ("penis-at-12"). AIS: Female external phenotype, scant/absent pubic hair, cryptorchid testes (in labia/abdomen), blind-ending vagina, normal breast development (peripheral aromatization of T to E2).',
        diagnosticFinding: 'Both have 46,XY karyotype and elevated/normal testosterone. AIS has elevated LH; 5-alpha-reductase has high Testosterone:DHT ratio.',
        usmlePearl: 'AIS patients have NO uterus or ovaries because Sertoli cells still secrete AMH (so Müllerian structures regress normally).'
      }
    ],
    highYieldBoardPearls: [
      'Ureteric Bud = Collecting system (Ureter, Pelvis, Calyces, Collecting ducts); Metanephric Blastema = Filtration system (Glomerulus to DCT).',
      'The definitive kidney starts producing urine at Week 10-12, serving as the main contributor to amniotic fluid volume.',
      'Horseshoe kidney is trapped by the Inferior Mesenteric Artery (IMA) at the L3 vertebral level.',
      'Gubernaculum remnant in females = Ovarian ligament and Round ligament of the uterus (passes through inguinal canal to labia majora).',
      'Hypospadias is due to failure of urethral folds to close (ventral defect); Epispadias is due to abnormal position of genital tubercle and is associated with bladder exstrophy (dorsal defect).'
    ]
  },
  {
    id: 'pharyngeal_craniofacial',
    name: 'Pharyngeal Apparatus & Craniofacial Development',
    subtitle: 'Pharyngeal Arches 1-6 (Nerves, Vessels, Muscles & Cartilages), Pouches, Clefts, Palatogenesis & Face',
    iconName: 'Smile',
    badge: 'Branchial Apparatus 1-6, Facial Prominences & Palate (Wks 4 - 10)',
    color: {
      primary: 'rgb(236, 72, 153)',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/40',
      text: 'text-pink-400',
      glow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]'
    },
    germLayers: ['ectoderm', 'endoderm', 'mesoderm', 'neural_crest'],
    masterGenes: ['HOX gene code (Arch patterning)', 'PAX9 / MSX1 (Palatogenesis & tooth buds)', 'SHH (Midfacial fusion)', 'TBX1 / 22q11.2 (3rd & 4th pouch development / DiGeorge)', 'FGF8 (Facial prominence outgrowth)'],
    systemOverview: 'The pharyngeal (branchial) apparatus consists of 4 components: Arches (mesoderm + neural crest core), Pouches (endoderm inside), Clefts/Grooves (ectoderm outside), and Membranes. Together with 5 facial prominences, they form the neck, middle ear, glands (thymus, parathyroids, thyroid), jaw, and face.',
    criticalPeriod: 'Week 4 to Week 10 (Palatal fusion complete by Week 10)',
    stages: [
      {
        stageId: 'ph_stage_1',
        title: 'Pharyngeal Arches Architecture & Neural Crest Colonization',
        timeframe: 'Weeks 4 - 5',
        carnegieStage: 'Stage 10 - 14',
        week: 4,
        embryoStageId: 'stage_w4',
        overview: 'Six pairs of pharyngeal arches develop in craniocaudal sequence (Arch 5 regresses). Each arch contains an aortic arch artery, a specific cranial nerve, a cartilaginous bar, and a muscular component.',
        anatomicalEvents: [
          'Arch 1 (Mandibular): CN V3 (Trigeminal), Muscles of Mastication, Meckel cartilage (Malleus, Incus, Sphenomandibular ligament).',
          'Arch 2 (Hyoid): CN VII (Facial), Muscles of Facial Expression, Stapes, Styloid process, Lesser horn of hyoid.',
          'Arch 3: CN IX (Glossopharyngeal), Stylopharyngeus muscle, Greater horn & body of hyoid, Common & Internal carotid arteries.',
          'Arch 4: CN X (Superior Laryngeal branch), Cricothyroid & pharyngeal constrictors, Laryngeal cartilages, Aortic arch & Right subclavian.',
          'Arch 6: CN X (Recurrent Laryngeal branch), All intrinsic laryngeal muscles except cricothyroid, Ductus arteriosus & Pulmonary arteries.'
        ],
        molecularSignaling: [
          { gene: 'HOX code', role: 'Rhombomere-derived cranial neural crest carries precise HOX combinations to pattern arch identities (Arch 1 is HOX-negative).' }
        ],
        clinicalNotes: 'First Arch Syndromes (Treacher Collins, Pierre Robin sequence) cause micrognathia, mandibular hypoplasia, cleft palate, and hearing loss.',
        keyVisualKey: 'pharyngeal_arches_structure'
      },
      {
        stageId: 'ph_stage_2',
        title: 'Pharyngeal Pouches & Clefts Derivatives',
        timeframe: 'Weeks 5 - 7',
        carnegieStage: 'Stage 13 - 18',
        week: 6,
        embryoStageId: 'stage_w6',
        overview: 'Endodermal pouches invaginate internally; ectodermal clefts indent externally. Cleft 2-4 normally obliterate via downward growth of Arch 2 operculum.',
        anatomicalEvents: [
          '1st Cleft: External auditory meatus; 1st Membrane: Tympanic membrane.',
          '2nd - 4th Clefts: Overgrown by 2nd arch; transient Cervical Sinus of His normally obliterates.',
          '1st Pouch: Middle ear cavity, Eustachian (Auditory) tube, Mastoid air cells.',
          '2nd Pouch: Epithelial lining of Palatine Tonsillar crypts.',
          '3rd Pouch: Inferior Parathyroid glands (dorsal wing) + Thymus (ventral wing) - migrate together caudally.',
          '4th Pouch: Superior Parathyroid glands (dorsal wing) + Ultimopharyngeal body / C-cells of thyroid (ventral wing).'
        ],
        molecularSignaling: [
          { gene: 'TBX1 (22q11.2)', role: 'Directs differentiation of 3rd and 4th pharyngeal pouches into parathyroids, thymus, and aorticopulmonary septum.' }
        ],
        clinicalNotes: 'Persistence of 2nd cleft = Branchial Cleft Cyst (lateral neck mass anterior to sternocleidomastoid). DiGeorge Syndrome (22q11 deletion): Failure of 3rd/4th pouches = absent thymus (T-cell deficiency) + hypocalcemic tetany (absent parathyroids) + conotruncal heart defects.',
        keyVisualKey: 'pouches_clefts_migration'
      },
      {
        stageId: 'ph_stage_3',
        title: 'Facial Prominences & Palatogenesis',
        timeframe: 'Weeks 5 - 10',
        carnegieStage: 'Stage 15 - 23',
        week: 7,
        embryoStageId: 'stage_w8',
        overview: 'The face forms from 5 prominences surrounding the stomodeum: Frontonasal Prominence, paired Maxillary Prominences (Arch 1), and paired Mandibular Prominences (Arch 1).',
        anatomicalEvents: [
          'Nasal placodes invaginate to create Medial and Lateral Nasal Prominences.',
          'Medial Nasal Prominences fuse in midline -> Intermaxillary Segment (Philtrum of upper lip, 4 upper incisor teeth, and Primary Palate).',
          'Maxillary Prominences fuse with Medial Nasal Prominences to form upper lip (failure = Cleft Lip).',
          'Maxillary Prominences give off Palatine Shelves (Secondary Palate) which rotate horizontally and fuse in the midline with each other and nasal septum (failure = Cleft Palate).'
        ],
        molecularSignaling: [
          { gene: 'MSX1 & PAX9', role: 'Required for palatal shelf elevation, horizontal growth, and midline epithelial seam apoptosis.' },
          { gene: 'SHH', role: 'Regulates frontonasal and maxillary prominence proliferation.' }
        ],
        clinicalNotes: 'Cleft Lip: Failure of fusion between Maxillary prominence and Medial nasal prominence (anterior to incisive foramen). Cleft Palate: Failure of fusion of lateral Palatine shelves with each other or primary palate (posterior to incisive foramen).',
        keyVisualKey: 'palatogenesis_facial_fusion'
      },
      {
        stageId: 'ph_stage_4',
        title: 'Thyroid & Tongue Morphogenesis',
        timeframe: 'Weeks 4 - 8',
        carnegieStage: 'Stage 10 - 20',
        week: 6,
        embryoStageId: 'stage_w6',
        overview: 'Thyroid gland forms as an endodermal diverticulum at the foramen cecum on the floor of the pharynx and descends down the thyroglossal duct to its final pre-tracheal location. Tongue develops from lingual swellings of arches 1-4.',
        anatomicalEvents: [
          'Thyroid descends anterior to hyoid bone and thyroid cartilage, reaching definitive location by Week 7; Thyroglossal duct then obliterates.',
          'Tongue Anterior 2/3: Arch 1 (median tuberculum impar + 2 lateral lingual swellings); Sensory: CN V3, Taste: CN VII (Chorda tympani).',
          'Tongue Posterior 1/3: Arch 3 and 4 (copula / hypopharyngeal eminence); Sensory and Taste: CN IX (Arch 3) and CN X (Arch 4).',
          'Tongue Motor: Hypoglossal nerve (CN XII) innervates muscles derived from migrated occipital somite myotomes (except Palatoglossus, CN X).'
        ],
        molecularSignaling: [
          { gene: 'PAX8 & TTF-1/2', role: 'Crucial for thyroid follicular cell differentiation and descent.' }
        ],
        clinicalNotes: 'Thyroglossal Duct Cyst: Midline cystic neck mass that characteristically moves upwards with tongue protrusion or swallowing (distinguishes from lateral branchial cleft cyst). Lingual Thyroid: Failure of thyroid descent, presenting as mass at base of tongue.',
        keyVisualKey: 'thyroid_tongue_descent'
      }
    ],
    derivativesMatrix: [
      { embryonicStructure: '1st Pharyngeal Arch (Mandibular)', germLayer: 'mesoderm', adultDerivative: 'Meckel cartilage (Malleus, Incus), Mandible, Maxilla, Muscles of mastication, Tensor tympani, CN V3', clinicalSignificance: 'Treacher Collins syndrome' },
      { embryonicStructure: '2nd Pharyngeal Arch (Hyoid)', germLayer: 'mesoderm', adultDerivative: 'Reichert cartilage (Stapes, Styloid process, Lesser horn hyoid), Muscles of facial expression, Stapedius, CN VII', clinicalSignificance: 'Hyperacusis (stapedius paralysis)' },
      { embryonicStructure: '3rd Pharyngeal Arch', germLayer: 'mesoderm', adultDerivative: 'Greater horn of hyoid, Stylopharyngeus muscle, Common & Internal Carotid, CN IX', clinicalSignificance: 'Glossopharyngeal neuralgia' },
      { embryonicStructure: '4th Pharyngeal Arch', germLayer: 'mesoderm', adultDerivative: 'Thyroid & laryngeal cartilages, Cricothyroid & pharyngeal constrictors, Aortic arch, CN X (Superior laryngeal)', clinicalSignificance: 'Loss of high pitch voice (external laryngeal nerve)' },
      { embryonicStructure: '6th Pharyngeal Arch', germLayer: 'mesoderm', adultDerivative: 'Intrinsic laryngeal muscles (except cricothyroid), Pulmonary arteries, Ductus arteriosus, CN X (Recurrent laryngeal)', clinicalSignificance: 'Hoarseness (recurrent laryngeal nerve injury)' },
      { embryonicStructure: '1st Pharyngeal Pouch', germLayer: 'endoderm', adultDerivative: 'Epithelium of Middle ear cavity, Eustachian tube, Mastoid air cells', clinicalSignificance: 'Otitis media spread' },
      { embryonicStructure: '2nd Pharyngeal Pouch', germLayer: 'endoderm', adultDerivative: 'Palatine tonsil lining & crypts', clinicalSignificance: 'Tonsillitis' },
      { embryonicStructure: '3rd Pharyngeal Pouch', germLayer: 'endoderm', adultDerivative: 'Inferior Parathyroid Glands & Thymus', clinicalSignificance: 'DiGeorge syndrome (Absent thymus/parathyroids)' },
      { embryonicStructure: '4th Pharyngeal Pouch', germLayer: 'endoderm', adultDerivative: 'Superior Parathyroid Glands & C-Cells (Calcitonin) of Thyroid', clinicalSignificance: 'Medullary thyroid carcinoma' },
      { embryonicStructure: '1st Pharyngeal Cleft', germLayer: 'ectoderm', adultDerivative: 'External Auditory Meatus epithelium', clinicalSignificance: 'Ear canal atresia' },
      { embryonicStructure: '2nd - 4th Pharyngeal Clefts', germLayer: 'ectoderm', adultDerivative: 'Cervical Sinus of His (normally obliterates)', clinicalSignificance: 'Branchial Cleft Cyst (lateral neck mass)' }
    ],
    congenitalDefects: [
      {
        name: 'DiGeorge Syndrome (22q11.2 Deletion / Catch-22)',
        embryologicalBasis: 'Microdeletion on chromosome 22q11.2 (TBX1 gene) leading to defective neural crest migration and failure of the 3rd and 4th pharyngeal pouches to develop.',
        incidence: '1 in 4,000 live births',
        presentation: 'CATCH-22 Mnemonic: Cardiac defects (Truncus arteriosus, Tetralogy of Fallot, Interrupted aortic arch), Abnormal facies (micrognathia, low-set ears), Thymic aplasia (severe T-cell immunodeficiency), Cleft palate, Hypocalcemia / Tetany (absent parathyroid glands).',
        diagnosticFinding: 'Fluorescence in situ hybridization (FISH) or chromosomal microarray confirms 22q11.2 deletion. Absent thymic shadow on neonatal CXR; low serum Ca2+ and undetectable PTH.',
        usmlePearl: 'Inferior parathyroids come from 3rd pouch; Superior parathyroids come from 4th pouch. Both are absent/hypoplastic in DiGeorge.'
      },
      {
        name: 'Thyroglossal Duct Cyst vs. Branchial Cleft Cyst',
        embryologicalBasis: 'Thyroglossal Duct Cyst: Persistence of epithelial tract of descending thyroid from foramen cecum. Branchial Cleft Cyst: Failure of obliteration of the 2nd pharyngeal cleft (cervical sinus).',
        incidence: 'Thyroglossal is most common congenital neck cyst (70%)',
        presentation: 'Thyroglossal Duct Cyst: MIDLINE neck mass (often near hyoid) that MOVES ELEVATING with tongue protrusion or swallowing. Branchial Cleft Cyst: LATERAL neck mass located anterior to the sternocleidomastoid (SCM) that does NOT move with swallowing.',
        diagnosticFinding: 'Ultrasound and radioactive iodine scan (to confirm normal orthotopic thyroid is present before excision).',
        usmlePearl: 'Midline + moves with tongue = Thyroglossal duct cyst. Lateral + anterior to SCM = Branchial cleft cyst (2nd cleft remnant).'
      },
      {
        name: 'Cleft Lip vs. Cleft Palate',
        embryologicalBasis: 'Cleft Lip: Failure of fusion of the Maxillary Prominence with the Medial Nasal Prominence (Arch 1). Cleft Palate: Failure of fusion of the lateral Palatine Shelves (Maxillary prominences) with each other, with the nasal septum, or with the primary palate.',
        incidence: 'Cleft Lip: 1 in 1,000 (more in males); Cleft Palate: 1 in 2,500 (more in females)',
        presentation: 'Cleft Lip: Unilateral or bilateral defect in upper lip anterior to incisive foramen. Cleft Palate: Midline fissure in hard and/or soft palate, uvula (bifid uvula), difficulty with feeding/suction.',
        diagnosticFinding: 'Readily visible on prenatal 2D/3D ultrasound and clinical exam at birth.',
        usmlePearl: 'Incisive foramen is the anatomical boundary: Defects anterior to incisive foramen = Cleft Lip (primary palate); Defects posterior = Cleft Palate (secondary palate).'
      }
    ],
    highYieldBoardPearls: [
      'Arch 1 = CN V3 (Mastication); Arch 2 = CN VII (Facial expression); Arch 3 = CN IX (Stylopharyngeus); Arch 4 = CN X superior laryngeal (Cricothyroid); Arch 6 = CN X recurrent laryngeal (Intrinsic larynx).',
      'Tongue Anterior 2/3: Sensation CN V3, Taste CN VII; Posterior 1/3: Sensation & Taste CN IX; Motor = CN XII (Hypoglossal).',
      '3rd Pouch = Inferior Parathyroid + Thymus (migrate down together); 4th Pouch = Superior Parathyroid + Ultimopharyngeal body.',
      'DiGeorge syndrome is a defect of 3rd and 4th pharyngeal pouches due to 22q11.2 microdeletion.',
      'Branchial cleft cyst is LATERAL (anterior to SCM); Thyroglossal cyst is MIDLINE and moves with tongue protrusion.'
    ]
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal & Limb Development',
    subtitle: 'Somite Differentiation (Sclerotome, Myotome, Dermatome), AER / ZPA Axes, Digit Cleavage & Limb Rotation',
    iconName: 'Bone',
    badge: 'Somitogenesis & 3-Axis Limb Patterning (Wks 4 - 8)',
    color: {
      primary: 'rgb(234, 88, 12)',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/40',
      text: 'text-orange-400',
      glow: 'shadow-[0_0_15px_rgba(234,88,12,0.3)]'
    },
    germLayers: ['mesoderm', 'ectoderm'],
    masterGenes: ['FGF8 & FGF4 (Apical Ectodermal Ridge - Proximal/Distal)', 'SHH (Zone of Polarizing Activity - Anterior/Posterior)', 'Wnt7a (Dorsal ectoderm - Dorsal/Ventral)', 'HOX genes (Proximodistal segmentation: Stylopod, Zeugopod, Autopod)', 'PAX1 (Sclerotome induction by SHH)', 'MYOD1 / MYF5 (Myogenesis)'],
    systemOverview: 'Paraxial mesoderm segments into 42-44 pairs of somites that compartmentalize into Sclerotome (axial skeleton), Myotome (skeletal muscle), and Dermatome (dermis). Limb buds evaginate from lateral plate mesoderm under precise 3-dimensional morphogenetic signaling centers (AER, ZPA, Wnt7a).',
    criticalPeriod: 'Week 4 to Week 8 (Thalidomide teratogenic window: Days 20-36)',
    stages: [
      {
        stageId: 'ms_stage_1',
        title: 'Somite Segmentation & Compartmentalization',
        timeframe: 'Days 20 - 30',
        carnegieStage: 'Stage 9 - 13',
        week: 4,
        embryoStageId: 'stage_w4',
        overview: 'Paraxial mesoderm flanks the neural tube and condenses into paired somite blocks in a strict craniocaudal clock-and-wavefront rhythm (3 pairs per day).',
        anatomicalEvents: [
          'Somite count correlates precisely with embryo age (42-44 pairs total).',
          'Sclerotome (ventromedial): Induced by SHH from notochord -> forms vertebrae, ribs, and annulus fibrosus.',
          'Dermomyotome (dorsolateral): Subdivides into Dermatome (dermis of back) and Myotome (Primaxial & Abaxial skeletal muscles).',
          'Re-segmentation of sclerotomes: Caudal half of each sclerotome fuses with cranial half of subjacent sclerotome to form intervertebral discs and allow spinal nerves to exit intervertebral foramina.'
        ],
        molecularSignaling: [
          { gene: 'Notch / HES1 oscillations', role: 'Segmentation clock determining boundary of each newly formed somite.' },
          { gene: 'SHH from notochord', role: 'Activates PAX1 in sclerotome to initiate chondrogenesis.' },
          { gene: 'WNT from dorsal neural tube', role: 'Activates MYF5 and MYOD in dermomyotome for myogenic commitment.' }
        ],
        clinicalNotes: 'Klippel-Feil syndrome: Congenital fusion of cervical vertebrae due to faulty sclerotome re-segmentation (triad of short neck, low hairline, limited neck mobility). Hemivertebra causes congenital scoliosis.',
        keyVisualKey: 'somite_compartments'
      },
      {
        stageId: 'ms_stage_2',
        title: 'Limb Bud Outgrowth & Apical Ectodermal Ridge (AER)',
        timeframe: 'Weeks 4 - 5',
        carnegieStage: 'Stage 12 - 15',
        week: 5,
        embryoStageId: 'stage_w5',
        overview: 'Upper limb buds appear at Day 26-27 (opposite C5-T1 somites); Lower limb buds appear 2 days later at Day 28 (opposite L2-S2 somites).',
        anatomicalEvents: [
          'Lateral plate mesoderm core induces overlying surface ectoderm at the distal border to thicken into the Apical Ectodermal Ridge (AER).',
          'AER maintains underlying Progress Zone mesoderm in a rapidly dividing, undifferentiated state, directing Proximal-to-Distal growth (Humerus/Femur -> Radius/Ulna -> Hand/Foot).',
          'Sequential HOX gene expression (Hox9 to Hox13) patterns stylopod (arm/thigh), zeugopod (forearm/leg), and autopod (hand/foot).'
        ],
        molecularSignaling: [
          { gene: 'FGF10 (Mesenchyme) & FGF8/4 (AER)', role: 'FGF10 from mesoderm induces AER; AER secretes FGF8 and FGF4 back to maintain distal mesenchymal proliferation.' }
        ],
        clinicalNotes: 'AER removal results in limb amputation at the corresponding level. Thalidomide inhibits FGF/angiogenesis in the progress zone, causing Phocomelia (seal-like shortened/absent limbs).',
        keyVisualKey: 'aer_proximal_distal'
      },
      {
        stageId: 'ms_stage_3',
        title: 'Zone of Polarizing Activity (ZPA) & Anterior-Posterior Axis',
        timeframe: 'Weeks 5 - 6',
        carnegieStage: 'Stage 14 - 17',
        week: 6,
        embryoStageId: 'stage_w6',
        overview: 'A cluster of mesenchymal cells at the posterior base of the limb bud forms the Zone of Polarizing Activity (ZPA), directing Anterior-Posterior (Thumb-to-Pinky / Big toe-to-Little toe) patterning.',
        anatomicalEvents: [
          'High concentration of SHH at posterior edge specifies Digit 5 (pinky) and Digit 4.',
          'Low/absent SHH anteriorly specifies Digit 1 (thumb / radius).',
          'Dorsal-Ventral axis: Directed by Wnt7a in dorsal ectoderm (induces Lmx1b for dorsal structures like extensor muscles & nails) and Engrailed-1 (En-1) in ventral ectoderm.'
        ],
        molecularSignaling: [
          { gene: 'Sonic Hedgehog (SHH)', role: 'Morphogen gradient from ZPA conferring digit identity across the A-P axis.' },
          { gene: 'Wnt7a / LMX1B', role: 'Dorsal limb organizer; mutations in LMX1B cause Nail-Patella syndrome (absent patellae, dystrophic nails).' }
        ],
        clinicalNotes: 'Ectopic ZPA or anterior SHH expression causes Mirror-Image Polydactyly (triphalangeal thumb or duplicate pinky digits).',
        keyVisualKey: 'zpa_shh_digits'
      },
      {
        stageId: 'ms_stage_4',
        title: 'Digit Cleavage via Apoptosis & 90° Limb Rotations',
        timeframe: 'Weeks 7 - 8',
        carnegieStage: 'Stage 18 - 23',
        week: 7,
        embryoStageId: 'stage_w8',
        overview: 'Hand and foot plates form paddle-like contours. Interdigital necrotic zones undergo programmed cell death (apoptosis) driven by BMP signaling to separate 5 distinct digits. Limbs rotate 90° in OPPOSITE directions.',
        anatomicalEvents: [
          'BMP4/7 in interdigital spaces induces apoptosis between digital rays by Week 8.',
          'Upper Limbs rotate 90° LATERALLY: Extensors face posterior, thumbs point lateral, elbows point posterior.',
          'Lower Limbs rotate 90° MEDIALLY: Extensors face anterior, big toes point medial, knees point anterior.',
          'Dermatome maps twist into their distinctive adult spiral dermatomal distribution.'
        ],
        molecularSignaling: [
          { gene: 'BMP4 / BMP7 & MSX2', role: 'Trigger caspase cascades for interdigital tissue apoptosis.' }
        ],
        clinicalNotes: 'Syndactyly: Failure of interdigital apoptosis, leading to fused fingers/toes. Polydactyly: Extra digits due to disruption of ZPA/SHH regulation. Clubfoot (Talipes equinovarus): Abnormal positioning due to oligohydramnios or neuromuscular defects.',
        keyVisualKey: 'digit_apoptosis_rotation'
      }
    ],
    derivativesMatrix: [
      { embryonicStructure: 'Sclerotome (Paraxial Mesoderm)', germLayer: 'mesoderm', adultDerivative: 'Vertebral column, Ribs, Cranial base, Annulus fibrosus', clinicalSignificance: 'Spina bifida, Scoliosis, Klippel-Feil' },
      { embryonicStructure: 'Notochord Remnant', germLayer: 'mesoderm', adultDerivative: 'Nucleus Pulposus of Intervertebral Disc', clinicalSignificance: 'Chordoma (malignant notochord tumor)' },
      { embryonicStructure: 'Myotome (Epaxial / Primaxial)', germLayer: 'mesoderm', adultDerivative: 'Intrinsic deep back muscles (Erector spinae, Transversospinales)', clinicalSignificance: 'Muscular dystrophies' },
      { embryonicStructure: 'Myotome (Hypaxial / Abaxial)', germLayer: 'mesoderm', adultDerivative: 'Anterolateral abdominal wall, Intercostals, Limb musculature', clinicalSignificance: 'Prune belly syndrome' },
      { embryonicStructure: 'Dermatome', germLayer: 'mesoderm', adultDerivative: 'Dermis and subcutaneous tissue of neck, back, and trunk', clinicalSignificance: 'Segmental dermatomal shingles (VZV)' },
      { embryonicStructure: 'AER (Apical Ectodermal Ridge)', germLayer: 'ectoderm', adultDerivative: 'Guides Proximal-to-Distal bone outgrowth', clinicalSignificance: 'Phocomelia, Amelia (Thalidomide)' },
      { embryonicStructure: 'ZPA (Zone of Polarizing Activity)', germLayer: 'mesoderm', adultDerivative: 'Patterns Anterior-to-Posterior digit identity (Thumb to Pinky)', clinicalSignificance: 'Polydactyly, Triphalangeal thumb' },
      { embryonicStructure: 'Dorsal Ectoderm (Wnt7a)', germLayer: 'ectoderm', adultDerivative: 'Dorsal limb structures (Extensors, Nails, Patellae)', clinicalSignificance: 'Nail-Patella syndrome (LMX1B mutation)' }
    ],
    congenitalDefects: [
      {
        name: 'Thalidomide Embryopathy (Phocomelia & Amelia)',
        embryologicalBasis: 'Thalidomide binds and inhibits Cereblon (CRBN) ubiquitin ligase, disrupting FGF signaling and angiogenesis in the Apical Ectodermal Ridge (AER) during critical limb bud outgrowth (Days 20-36).',
        incidence: 'Historical catastrophe (~10,000 infants worldwide in late 1950s-60s)',
        presentation: 'Phocomelia ("seal limbs": hands/feet attached directly to trunk with absent long bones), amelia (complete absence of limbs), ear defects, and cardiac malformations.',
        diagnosticFinding: 'Radiographs reveal complete absence or severe hypoplasia of stylopod (humerus/femur) and zeugopod (radius/ulna/tibia/fibula).',
        usmlePearl: 'AER (FGF8/4) controls PROXIMAL-DISTAL growth; disruption during limb outgrowth arrests bone elongation.'
      },
      {
        name: 'Syndactyly vs. Polydactyly',
        embryologicalBasis: 'Syndactyly: Failure of BMP-mediated apoptosis in the interdigital tissue between digital rays in Week 7-8. Polydactyly: Duplication of ZPA or ectopic anterior SHH expression leading to extra preaxial (thumb/radial) or postaxial (pinky/ulnar) digits.',
        incidence: 'Syndactyly: 1 in 2,000; Polydactyly: 1 in 1,000 live births',
        presentation: 'Syndactyly: Webbed fingers (most commonly 3rd and 4th digits) or toes (2nd and 3rd toes). Polydactyly: Supernumerary digit (postaxial is classic in Trisomy 13 / Patau).',
        diagnosticFinding: 'Clinical exam and neonatal X-rays (evaluates cutaneous vs osseous fusion).',
        usmlePearl: 'Apert syndrome (FGFR2) features severe "mitten hand" syndactyly + craniosynostosis; Patau (Trisomy 13) features postaxial polydactyly.'
      },
      {
        name: 'Nail-Patella Syndrome (Hereditary Onycho-Osteodysplasia)',
        embryologicalBasis: 'Loss-of-function mutation in LMX1B transcription factor downstream of Wnt7a, disrupting dorsal-ventral limb axis specification.',
        incidence: '1 in 50,000 live births (Autosomal Dominant)',
        presentation: 'Tetrad: (1) Hypoplastic or absent patellae, (2) Dystrophic or absent fingernails (especially thumbs), (3) Iliac horns on pelvic X-ray, (4) Glaucoma and proteinuria / renal nephropathy.',
        diagnosticFinding: 'Bilateral posterior iliac horns on pelvic radiograph (pathognomonic); absent patellae on knee radiographs.',
        usmlePearl: 'Wnt7a -> LMX1B specifies DORSAL limb structures. Loss of LMX1B causes ventralization of dorsal structures (absent nails & kneecaps).'
      }
    ],
    highYieldBoardPearls: [
      'AER (FGF8/4) = Proximal-Distal axis; ZPA (SHH) = Anterior-Posterior axis (Thumb to Pinky); Wnt7a/Lmx1b = Dorsal-Ventral axis.',
      'Upper limbs rotate 90° LATERALLY; Lower limbs rotate 90° MEDIALLY during Week 7-8.',
      'Nucleus pulposus of intervertebral disc is the only remnant of the Notochord (Annulus fibrosus is from sclerotome).',
      'Interdigital separation occurs via BMP-mediated apoptosis; failure results in syndactyly.',
      'Thalidomide causes phocomelia by disrupting the AER progress zone between Days 20 and 36.'
    ]
  },
  {
    id: 'endocrine_hematopoietic',
    name: 'Endocrine & Hematopoietic Development',
    subtitle: 'Pituitary (Dual Origin), Adrenal (Dual Origin), Thyroid & 4 Waves of Fetal Hematopoiesis',
    iconName: 'Droplets',
    badge: 'Dual Gland Origins & Fetal Blood Islands (Wks 3 - 30)',
    color: {
      primary: 'rgb(168, 85, 247)',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
    },
    germLayers: ['ectoderm', 'mesoderm', 'endoderm', 'neural_crest'],
    masterGenes: ['PROP1 & PIT1 (Anterior pituitary hormones)', 'RUNX1 (Definitive hematopoietic stem cell specification)', 'SCL / TAL1 (Blood island differentiation)', 'DAX1 & SF1 (Adrenocortical steroidogenesis)', 'GATA1 (Erythroid maturation & HbF switch)'],
    systemOverview: 'Endocrine glands uniquely showcase dual embryological origins: the Pituitary gland arises from Oral Ectoderm (Adenohypophysis) and Neural Ectoderm (Neurohypophysis); the Adrenal gland arises from Mesoderm (Cortex) and Neural Crest (Medulla). Hematopoiesis progresses through 4 sequential anatomical sites: Yolk Sac -> Liver -> Spleen -> Bone Marrow.',
    criticalPeriod: 'Week 3 to Month 7 (Hematopoiesis shifts to Bone Marrow at ~Week 28)',
    stages: [
      {
        stageId: 'eh_stage_1',
        title: 'Pituitary Gland (Hypophysis): Dual Ectodermal Origin',
        timeframe: 'Weeks 4 - 8',
        carnegieStage: 'Stage 10 - 20',
        week: 5,
        embryoStageId: 'stage_w5',
        overview: 'Pituitary develops from two completely separate ectodermal outpocketings that contact each other at the sella turcica.',
        anatomicalEvents: [
          'Adenohypophysis (Anterior Pituitary): Arises from Rathke Pouch, an upward evagination of stomodeal oral surface ectoderm (forms Pars distalis, Pars tuberalis, Pars intermedia).',
          'Neurohypophysis (Posterior Pituitary): Arises from Infundibulum, a downward projection of diencephalic neuroectoderm (forms Pars nervosa & infundibular stalk).',
          'Rathke pouch constricts at its base and loses connection with oral cavity by Week 6.'
        ],
        molecularSignaling: [
          { gene: 'PROP1 / PIT1', role: 'Transcriptional cascade driving anterior pituitary cell types (GH, PRL, TSH somatolactotropes).' },
          { gene: 'FGF8 / BMP4', role: 'Diencephalon organizers inducing Rathke pouch evagination.' }
        ],
        clinicalNotes: 'Craniopharyngioma: Benign epithelial tumor arising from remnants of Rathke Pouch; contains cholesterol-rich "machinery oil" fluid and calcifications; compresses optic chiasm causing bitemporal hemianopsia.',
        keyVisualKey: 'pituitary_dual_origin'
      },
      {
        stageId: 'eh_stage_2',
        title: 'Adrenal (Suprarenal) Gland: Dual Germ Layer Assembly',
        timeframe: 'Weeks 5 - 8',
        carnegieStage: 'Stage 14 - 22',
        week: 6,
        embryoStageId: 'stage_w6',
        overview: 'Adrenal cortex and adrenal medulla have entirely distinct origins: Cortex from mesoderm; Medulla from neural crest.',
        anatomicalEvents: [
          'Adrenal Cortex: Fetal cortex derives from coelomic intermediate mesoderm at Week 5; adult cortex encapsulates it at Week 7 (Zona glomerulosa, fasciculata, reticularis).',
          'Fetal Adrenal Cortex is huge in utero; produces DHEA-S which placenta converts into Estriol (E3) to sustain pregnancy.',
          'Adrenal Medulla: Sympathetic Neural Crest cells migrate into the medial aspect of the fetal cortex, differentiating into Chromaffin cells (pheochromocytes).'
        ],
        molecularSignaling: [
          { gene: 'SF-1 (Steroidogenic Factor 1)', role: 'Essential for adrenal and gonadal steroidogenic enzyme expression.' },
          { gene: 'Glucocorticoids (from cortex)', role: 'Induce PNMT in chromaffin cells to convert Norepinephrine into Epinephrine.' }
        ],
        clinicalNotes: 'Congenital Adrenal Hyperplasia (CAH / 21-hydroxylase deficiency): Inability to synthesize cortisol/aldosterone leads to ACTH elevation, adrenal cortical hyperplasia, and androgen excess (ambiguous genitalia in females, salt-wasting crisis). Neuroblastoma arises from neural crest in adrenal medulla.',
        keyVisualKey: 'adrenal_dual_layers'
      },
      {
        stageId: 'eh_stage_3',
        title: '4 Waves of Fetal Hematopoiesis (Yolk Sac to Bone Marrow)',
        timeframe: 'Week 3 to Postnatal Life',
        carnegieStage: 'Stage 8 to Term',
        week: 8,
        embryoStageId: 'stage_w8',
        overview: 'Blood cell formation occurs in 4 chronological phases across gestation: (1) Yolk Sac, (2) Fetal Liver, (3) Spleen, (4) Bone Marrow.',
        anatomicalEvents: [
          'Phase 1 (Mesoblastic: Weeks 3-8): Blood islands in extraembryonic mesoderm of Yolk Sac synthesize embryonic hemoglobins (Gower 1, Gower 2, Portland: zeta and epsilon chains).',
          'Phase 2 (Hepatic: Weeks 6-30): Fetal Liver becomes the chief hematopoietic organ; synthesizes Fetal Hemoglobin (HbF = alpha2 gamma2).',
          'Phase 3 (Splenic: Weeks 12-28): Spleen contributes auxiliary hematopoiesis.',
          'Phase 4 (Myeloid: Week 28 onwards): Bone Marrow becomes the permanent lifelong hematopoietic site; HbF switches to Adult Hemoglobin (HbA = alpha2 beta2) around birth.'
        ],
        molecularSignaling: [
          { gene: 'RUNX1', role: 'Required for emergence of definitive Hematopoietic Stem Cells (HSCs) from aorta-gonad-mesonephros (AGM) region.' },
          { gene: 'BCL11A', role: 'Master transcriptional repressor of gamma-globin that mediates the postnatal HbF-to-HbA switch.' }
        ],
        clinicalNotes: 'Mnemonic for 4 sites: Young Liver Synthesizes Blood (Yolk sac -> Liver -> Spleen -> Bone marrow). HbF has higher oxygen affinity than HbA due to low 2,3-BPG binding, facilitating maternal-to-fetal O2 transfer across placenta. Hydrops Fetalis occurs in Alpha-Thalassemia Major (Hb Barts = gamma4).',
        keyVisualKey: 'hematopoiesis_waves'
      }
    ],
    derivativesMatrix: [
      { embryonicStructure: 'Rathke Pouch (Oral Ectoderm)', germLayer: 'ectoderm', adultDerivative: 'Anterior Pituitary (Adenohypophysis: Pars distalis, tuberalis, intermedia)', clinicalSignificance: 'Craniopharyngioma (suprasellar calcified mass)' },
      { embryonicStructure: 'Infundibulum (Neuroectoderm)', germLayer: 'ectoderm', adultDerivative: 'Posterior Pituitary (Neurohypophysis: Pars nervosa, Pituitary stalk, Pituicytes)', clinicalSignificance: 'Central diabetes insipidus' },
      { embryonicStructure: 'Coelomic Mesoderm', germLayer: 'mesoderm', adultDerivative: 'Adrenal Cortex (Zona Glomerulosa, Fasciculata, Reticularis)', clinicalSignificance: 'Congenital Adrenal Hyperplasia (CAH)' },
      { embryonicStructure: 'Neural Crest Cells (Trunk)', germLayer: 'neural_crest', adultDerivative: 'Adrenal Medulla (Chromaffin cells)', clinicalSignificance: 'Pheochromocytoma, Neuroblastoma' },
      { embryonicStructure: 'Yolk Sac Mesoderm (Blood Islands)', germLayer: 'mesoderm', adultDerivative: 'Primitive Erythroblasts & Embryonic Hemoglobins (Wks 3-8)', clinicalSignificance: 'Embryonic globin switching' },
      { embryonicStructure: 'Fetal Liver Mesenchyme', germLayer: 'mesoderm', adultDerivative: 'Main site of Fetal Hematopoiesis & HbF (Wks 6-30)', clinicalSignificance: 'Extramedullary hematopoiesis' },
      { embryonicStructure: 'Bone Marrow Stroma', germLayer: 'mesoderm', adultDerivative: 'Definitive adult Hematopoiesis & HbA (Wk 28+)', clinicalSignificance: 'Aplastic anemia, Leukemia' }
    ],
    congenitalDefects: [
      {
        name: 'Craniopharyngioma',
        embryologicalBasis: 'Benign, slow-growing neoplasm derived from epithelial remnants of Rathke Pouch (oral ectoderm) along the path of pituitary development.',
        incidence: 'Most common supratentorial brain tumor in children (peak age 5-14 years; 2nd peak in adults 50-75)',
        presentation: 'Triad: (1) Bitemporal hemianopsia (compression of optic chiasm), (2) Headache & increased ICP, (3) Hypopituitarism or growth failure / delayed puberty.',
        diagnosticFinding: 'Brain MRI/CT shows cystic and solid suprasellar mass with prominent calcifications and "motor oil" (cholesterol-rich) fluid.',
        usmlePearl: 'Derived from Oral Ectoderm (Rathke Pouch), NOT neuroectoderm. Calcification on CT is a classic board clue.'
      },
      {
        name: 'Congenital Adrenal Hyperplasia (21-Hydroxylase Deficiency)',
        embryologicalBasis: 'Autosomal recessive mutation in CYP21A2 gene leading to absent 21-hydroxylase enzyme in the adrenal cortex.',
        incidence: '1 in 10,000 live births (95% of all CAH cases)',
        presentation: 'Classic Salt-Wasting: Hypotension, hyponatremia, hyperkalemia, hypoglycemia, hypovolemic shock within first 1-2 weeks of life. Virilization: 46,XX females have ambiguous external genitalia (clitoromegaly, labioscrotal fusion) due to excess androgen shunting.',
        diagnosticFinding: 'Markedly elevated serum 17-hydroxyprogesterone (17-OHP), elevated ACTH, and low cortisol/aldosterone.',
        usmlePearl: 'Adrenal Cortex is enlarged (hyperplastic) because low cortisol removes negative feedback on ACTH; excessive precursors shunt into androgen pathway.'
      },
      {
        name: 'Alpha-Thalassemia Major (Hb Barts Hydrops Fetalis)',
        embryologicalBasis: 'Deletion of all 4 alpha-globin genes (--/--), preventing synthesis of any alpha chains during the fetal liver and bone marrow hematopoietic phases.',
        incidence: 'Prevalent in Southeast Asian and Mediterranean populations',
        presentation: 'Gamma-globin tetramers form Hemoglobin Barts (gamma4), which has an extremely high O2 affinity and cannot release oxygen to fetal tissues, resulting in severe tissue hypoxia, high-output heart failure, anasarca, and Hydrops Fetalis.',
        diagnosticFinding: 'Hemoglobin electrophoresis shows 100% Hb Barts; fetal ultrasound shows massive ascites, pericardial effusion, pleural effusions, and hepatosplenomegaly.',
        usmlePearl: 'Hb Barts = gamma4 tetramer (alpha-thal 4-gene deletion); HbH = beta4 tetramer (alpha-thal 3-gene deletion).'
      }
    ],
    highYieldBoardPearls: [
      'Mnemonic for hematopoiesis sites: Young Liver Synthesizes Blood (Yolk sac [Wks 3-8], Liver [Wks 6-30], Spleen [Wks 12-28], Bone Marrow [Wk 28+]).',
      'Anterior Pituitary is Oral Ectoderm (Rathke Pouch); Posterior Pituitary is Neuroectoderm (Infundibulum).',
      'Adrenal Cortex is Mesoderm; Adrenal Medulla is Neural Crest.',
      'Fetal Hemoglobin (HbF = alpha2 gamma2) has high affinity for O2 because it does not bind 2,3-BPG as avidly as adult HbA.',
      'Craniopharyngioma is a calcified suprasellar tumor derived from Rathke pouch remnants.'
    ]
  }
];
