import { EmbryoStage } from '../types';

export interface CarnegieStageInfo extends EmbryoStage {
  carnegieNumber: number;
  stageName: string;
  developmentalEpoch: 
    | 'Pre-Embryonic (Cleavage & Implantation)'
    | 'Gastrulation & Early Neurulation'
    | 'Early Organogenesis & Pharyngeal Arches'
    | 'Mid Organogenesis & Limb Morphogenesis'
    | 'Late Embryonic & Digital Cleavage'
    | 'Fetal Period (Growth & Maturation)';
  activeOrganSystems: string[];
  clinicalFocus: string;
}

export const ALL_23_CARNEGIE_STAGES: CarnegieStageInfo[] = [
  {
    id: 'cs1_zygote',
    week: 1,
    dayStart: 1,
    dayEnd: 1,
    carnegieStage: 1,
    carnegieNumber: 1,
    stageName: 'Carnegie Stage 1',
    title: 'CS 1: Fertilization & Zygote',
    subtitle: 'Acrosomal Reaction, Syngamy & Diploid Genome Restoration',
    trimester: 'Pre-Embryonic',
    developmentalEpoch: 'Pre-Embryonic (Cleavage & Implantation)',
    crlMm: 0.15,
    sizeAnalogy: 'Fine grain of sand (0.15 mm)',
    keyEvents: [
      'Sperm penetration triggering cortical granule exocytosis to block polyspermy',
      'Completion of second maternal meiotic division yielding female pronucleus',
      'Syngamy: Pronuclei fuse to restore diploid genome (46,XX or 46,XY)',
      'Totipotent single-cell unicellular embryo'
    ],
    morphogens: ['Zygotic genome activation (ZGA)', 'Izumo1-Juno adhesion', 'PLC-zeta calcium waves'],
    activeOrganSystems: ['Genome Activation', 'Single-Cell Totipotency'],
    clinicalFocus: 'Polyspermy prevention failure causes hydatidiform triploid moles.',
    germLayerHighlights: {
      ectoderm: 'Undifferentiated totipotent cytoplasm',
      mesoderm: 'Not specified',
      endoderm: 'Not specified'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Microscopic (below standard ultrasound resolution)'],
      dopplerNotes: 'High-resistance spiral artery flow in luteal phase endometrium.'
    },
    hotspots: [
      {
        id: 'cs1_pronuclei',
        name: 'Male & Female Pronuclei',
        position: [0, 0, 0],
        germLayer: 'extraembryonic',
        shortDesc: 'Haploid pronuclei intermingling chromosomes at syngamy.',
        fullDesc: 'Fusion marks the moment of genomic restitution and genetic sex determination.',
        clinicalSignificance: 'Triploidy and aneuploidies originate if chromosome segregation fails.',
        fateAdultOrgans: ['Entire organism']
      }
    ],
    modelType: 'zygote'
  },
  {
    id: 'cs2_cleavage',
    week: 1,
    dayStart: 2,
    dayEnd: 3,
    carnegieStage: 2,
    carnegieNumber: 2,
    stageName: 'Carnegie Stage 2',
    title: 'CS 2: Cleavage & Compaction',
    subtitle: '2 to 16 Blastomeres Moving Down the Oviduct',
    trimester: 'Pre-Embryonic',
    developmentalEpoch: 'Pre-Embryonic (Cleavage & Implantation)',
    crlMm: 0.18,
    sizeAnalogy: 'Microscopic pinpoint (0.18 mm)',
    keyEvents: [
      'Successive mitotic cleavage divisions without cellular volume growth',
      'Compaction at 8-cell stage mediated by E-cadherin and tight junctions',
      'Outer cells polarize; inner cells remain apolar, initiating the first lineage divergence',
      'Enclosed completely inside intact glycoprotein zona pellucida'
    ],
    morphogens: ['E-Cadherin (Uvomorulin)', 'Hippo/YAP signaling pathway', 'OCT4'],
    activeOrganSystems: ['Cell Cleavage', 'Blastomere Compaction'],
    clinicalFocus: 'Dichorionic-diamniotic monozygotic twinning occurs if blastomeres separate at this stage.',
    germLayerHighlights: {
      ectoderm: 'Totipotent blastomeres',
      mesoderm: 'Not specified',
      endoderm: 'Not specified'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Secretory phase endometrium with triple line sign'],
      dopplerNotes: 'Maternal ovarian corpus luteum vascular ring.'
    },
    hotspots: [],
    modelType: 'cleavage'
  },
  {
    id: 'cs3_morula',
    week: 1,
    dayStart: 4,
    dayEnd: 5,
    carnegieStage: 3,
    carnegieNumber: 3,
    stageName: 'Carnegie Stage 3',
    title: 'CS 3: Morula & Blastocoel Cavitation',
    subtitle: 'Entry into Uterus & Early Blastocyst Formation',
    trimester: 'Pre-Embryonic',
    developmentalEpoch: 'Pre-Embryonic (Cleavage & Implantation)',
    crlMm: 0.2,
    sizeAnalogy: 'Poppy seed (0.2 mm)',
    keyEvents: [
      '16–32 cell mulberry-like compacted morula enters uterine cavity',
      'Na+/K+-ATPase pumping creates the fluid-filled blastocoel cavity',
      'Clear segregation of outer Trophoblast (placental lineage) and Inner Cell Mass (embryoblast)',
      'Enzymatic zona pellucida hatching commences via uterine and trophoblastic proteases'
    ],
    morphogens: ['CDX2 (trophoblast marker)', 'OCT4 / NANOG (ICM pluripotency)', 'GATA6'],
    activeOrganSystems: ['Cavitation', 'Pluripotent ICM Specification'],
    clinicalFocus: 'Failure of zona hatching causes implantation failure and infertility.',
    germLayerHighlights: {
      ectoderm: 'Pluripotent ICM',
      mesoderm: 'Trophectoderm lineage',
      endoderm: 'Primitive hypoblast precursor'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Hypersecretory decidualized endometrium'],
      dopplerNotes: 'Early angiogenic signaling in maternal subendometrial plexus.'
    },
    hotspots: [],
    modelType: 'morula'
  },
  {
    id: 'cs4_implantation_init',
    week: 1,
    dayStart: 6,
    dayEnd: 6,
    carnegieStage: 4,
    carnegieNumber: 4,
    stageName: 'Carnegie Stage 4',
    title: 'CS 4: Trophoblast Attachment',
    subtitle: 'Free Blastocyst Adhesion to Endometrial Epithelium',
    trimester: 'Pre-Embryonic',
    developmentalEpoch: 'Pre-Embryonic (Cleavage & Implantation)',
    crlMm: 0.22,
    sizeAnalogy: 'Mustard grain speck (0.22 mm)',
    keyEvents: [
      'Embryonic pole of hatched blastocyst adheres to uterine luminal epithelium',
      'L-selectin on trophoblast interacts with oligosaccharide receptors on endometrium',
      'Trophoblast differentiates into inner Cytotrophoblast and outer Syncytiotrophoblast',
      'Syncytiotrophoblast begins secreting human chorionic gonadotropin (β-hCG)'
    ],
    morphogens: ['L-Selectin', 'Integrin αvβ3', 'β-hCG surge', 'LIF (Leukemia Inhibitory Factor)'],
    activeOrganSystems: ['Implantation Adhesion', 'Endocrine Rescue (hCG)'],
    clinicalFocus: 'Premature tubal adhesion leads to ectopic pregnancy (95% ampullary).',
    germLayerHighlights: {
      ectoderm: 'Embryoblast',
      mesoderm: 'Trophoblast invading stroma',
      endoderm: 'Primitive hypoblast emerging'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Thickened decidual reaction in endometrium'],
      dopplerNotes: 'Localized hyperemia at implantation nidus.'
    },
    hotspots: [],
    modelType: 'blastocyst'
  },
  {
    id: 'cs5_bilaminar',
    week: 2,
    dayStart: 7,
    dayEnd: 12,
    carnegieStage: 5,
    carnegieNumber: 5,
    stageName: 'Carnegie Stage 5',
    title: 'CS 5: Bilaminar Disc & Amniotic Cavity',
    subtitle: 'Rule of Twos: Epiblast, Hypoblast, Amnion & Yolk Sac',
    trimester: 'Pre-Embryonic',
    developmentalEpoch: 'Pre-Embryonic (Cleavage & Implantation)',
    crlMm: 0.4,
    sizeAnalogy: 'Sesame seed tip (0.4 mm)',
    keyEvents: [
      'Interstitial implantation: embryo fully embedded beneath uterine epithelium',
      'Embryoblast splits into columnar Epiblast and cuboidal Hypoblast',
      'Formation of Amniotic Cavity dorsally and Primary Yolk Sac ventrally',
      'Trophoblastic lacunae fill with maternal blood establishing early uteroplacental perfusion'
    ],
    morphogens: ['Wnt3a', 'Nodal', 'BMP4 antagonist Chordin', 'hCG'],
    activeOrganSystems: ['Bilaminar Disc', 'Extraembryonic Cavities', 'Lacunar Circulation'],
    clinicalFocus: 'Defective trophoblast syncytial invasion is the primary root cause of preeclampsia.',
    germLayerHighlights: {
      ectoderm: 'Epiblast (source of all definitive germ layers)',
      mesoderm: 'Extraembryonic mesoderm',
      endoderm: 'Hypoblast (Heuser membrane & yolk sac roof)'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Gestational sac ~2–3 mm', 'Intradecidual sign'],
      gestationalSacMm: 3,
      dopplerNotes: 'Low resistance trophoblastic ring flow.'
    },
    hotspots: [],
    modelType: 'bilaminar'
  },
  {
    id: 'cs6_streak_init',
    week: 2,
    dayStart: 13,
    dayEnd: 15,
    carnegieStage: 6,
    carnegieNumber: 6,
    stageName: 'Carnegie Stage 6',
    title: 'CS 6: Primitive Streak Initiation & Villi',
    subtitle: 'Primary Chorionic Villi, Secondary Yolk Sac & Connecting Stalk',
    trimester: 'Pre-Embryonic',
    developmentalEpoch: 'Gastrulation & Early Neurulation',
    crlMm: 0.8,
    sizeAnalogy: 'Fine sesame seed (0.8 mm)',
    keyEvents: [
      'Primitive streak initiates at caudal midline of epiblast disc',
      'Primary chorionic villi form as cytotrophoblastic cords invading syncytiotrophoblast',
      'Secondary (definitive) yolk sac pinches off from primary yolk sac',
      'Connecting stalk attaches embryonic disc to chorion (future umbilical cord precursor)'
    ],
    morphogens: ['Nodal (primitive streak induction)', 'Wnt3', 'BMP4', 'E-Cadherin downregulation'],
    activeOrganSystems: ['Axial Symmetry', 'Chorionic Villi Branching'],
    clinicalFocus: 'Hydatidiform mole risk if paternal imprinting dominates.',
    germLayerHighlights: {
      ectoderm: 'Epiblast with primitive streak groove',
      mesoderm: 'Early intraembryonic mesoderm egressing',
      endoderm: 'Definitive endoderm displacing hypoblast'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Gestational sac ~5–7 mm', 'Yolk sac ring visible (2 mm)'],
      gestationalSacMm: 6,
      dopplerNotes: 'Pulsatile spiral artery remodeling.'
    },
    hotspots: [],
    modelType: 'bilaminar'
  },
  {
    id: 'cs7_gastrulation',
    week: 3,
    dayStart: 15,
    dayEnd: 17,
    carnegieStage: 7,
    carnegieNumber: 7,
    stageName: 'Carnegie Stage 7',
    title: 'CS 7: Gastrulation & 3 Germ Layers',
    subtitle: 'Epithelial-to-Mesenchymal Transition & Notochordal Process',
    trimester: 'Embryonic',
    developmentalEpoch: 'Gastrulation & Early Neurulation',
    crlMm: 1.2,
    sizeAnalogy: 'Mustard seed (1.2 mm)',
    keyEvents: [
      'Gastrulation: Epiblast cells ingress through primitive streak and node via EMT',
      'Definitive Trilaminar Disc established: Ectoderm, Intraembryonic Mesoderm, Endoderm',
      'Notochordal process extends cranially from Hensen’s node toward prechordal plate',
      'Secondary chorionic villi acquire mesodermal cores'
    ],
    morphogens: ['FGF8 (regulates EMT)', 'Brachyury (T-box mesoderm)', 'Nodal / Lefty left-right axis', 'SHH'],
    activeOrganSystems: ['3 Germ Layer Specification', 'Notochord Induction'],
    clinicalFocus: 'Ciliary dynein defects at node cause Situs Inversus (Kartagener syndrome).',
    germLayerHighlights: {
      ectoderm: 'Surface ectoderm and prospective neuroectoderm',
      mesoderm: 'Paraxial, intermediate, lateral plate, and cardiogenic mesoderm',
      endoderm: 'Definitive embryonic gut lining'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Gestational sac ~8–10 mm', 'Yolk sac 3 mm'],
      gestationalSacMm: 9,
      dopplerNotes: 'Vasculogenesis in connecting stalk.'
    },
    hotspots: [],
    modelType: 'trilaminar_gastrula'
  },
  {
    id: 'cs8_neural_plate',
    week: 3,
    dayStart: 17,
    dayEnd: 19,
    carnegieStage: 8,
    carnegieNumber: 8,
    stageName: 'Carnegie Stage 8',
    title: 'CS 8: Neural Plate & Primitive Pit',
    subtitle: 'Notochordal Canal, Neurenteric Canal & Primary Cardiogenic Field',
    trimester: 'Embryonic',
    developmentalEpoch: 'Gastrulation & Early Neurulation',
    crlMm: 1.8,
    sizeAnalogy: 'Cumin seed (1.8 mm)',
    keyEvents: [
      'Notochord induces overlying ectoderm to thicken into the slipper-shaped Neural Plate',
      'Notochordal canal fuses temporarily with endoderm (Neurenteric canal)',
      'Primary heart field forms horseshoe-shaped cardiogenic zone cranial to neural plate',
      'Tertiary chorionic villi develop embryonic blood capillaries'
    ],
    morphogens: ['Noggin & Chordin (BMP4 antagonists inducing neural plate)', 'NKX2.5 (heart field)'],
    activeOrganSystems: ['Neuroectoderm Induction', 'Horseshoe Cardiogenic Field'],
    clinicalFocus: 'Failure of primitive streak regression leads to Sacrococcygeal Teratoma.',
    germLayerHighlights: {
      ectoderm: 'Thickened neural plate flanked by surface ectoderm',
      mesoderm: 'Horseshoe cardiogenic field, prechordal mesenchyme',
      endoderm: 'Notochordal plate intercalated in roof of yolk sac'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Clear double decidual sac', 'Embryonic disc on yolk sac border'],
      gestationalSacMm: 12,
      crlMm: 1.8,
      dopplerNotes: 'Early angiogenetic clusters.'
    },
    hotspots: [],
    modelType: 'trilaminar_gastrula'
  },
  {
    id: 'cs9_neural_folds',
    week: 3,
    dayStart: 19,
    dayEnd: 21,
    carnegieStage: 9,
    carnegieNumber: 9,
    stageName: 'Carnegie Stage 9',
    title: 'CS 9: Neural Folds & 1–3 Somites',
    subtitle: 'Neural Groove, Paraxial Segmentation & Angiogenic Tubes',
    trimester: 'Embryonic',
    developmentalEpoch: 'Gastrulation & Early Neurulation',
    crlMm: 2.2,
    sizeAnalogy: 'Flax seed (2.2 mm)',
    keyEvents: [
      'Neural plate indents along midline to form Neural Groove flanked by elevated Neural Folds',
      'First 1–3 pairs of paraxial Somites appear in the occipital/cervical boundary region',
      'Paired endocardial tubes migrate and fuse into a single primitive heart tube',
      'Neural crest induction begins at lateral edges of neural folds'
    ],
    morphogens: ['Wnt & BMP gradients (neural crest induction)', 'Notch-Delta oscillator (somitogenesis clock)'],
    activeOrganSystems: ['Neural Folding', 'Somite Segmentation', 'Endocardial Tube Fusion'],
    clinicalFocus: 'Critical teratogenic window: alcohol exposure disrupts neural crest migration (FAS).',
    germLayerHighlights: {
      ectoderm: 'Elevated neural folds and early neural crest cells',
      mesoderm: '1–3 somite pairs, fusing endocardial tubes',
      endoderm: 'Foregut pocket initiation'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Embryonic pole ~2 mm adjacent to yolk sac'],
      crlMm: 2.2,
      dopplerNotes: 'Primitive blood vessels forming in embryo.'
    },
    hotspots: [],
    modelType: 'neurula_week4'
  },
  {
    id: 'cs10_first_heartbeat',
    week: 4,
    dayStart: 22,
    dayEnd: 23,
    carnegieStage: 10,
    carnegieNumber: 10,
    stageName: 'Carnegie Stage 10',
    title: 'CS 10: 4–12 Somites & First Heartbeat',
    subtitle: 'Initial Neural Tube Closure & Rhythmic Cardiac Contraction (105 BPM)',
    trimester: 'Embryonic',
    developmentalEpoch: 'Gastrulation & Early Neurulation',
    crlMm: 3.0,
    heartRateBpm: 105,
    sizeAnalogy: 'Small grain of rice (3.0 mm)',
    keyEvents: [
      'First functional heartbeats start around Day 22 (peristaltic wave ~100–110 BPM)',
      'Neural folds fuse at level of 4th–5th somites (cervical region), progressing bidirectionally',
      '4 to 12 somite pairs visible as prominent dorsal cubes',
      '1st and 2nd Pharyngeal (Branchial) Arches emerge on lateral cranial surface',
      'Otic placodes (future inner ear) appear as surface ectoderm thickenings'
    ],
    morphogens: ['NKX2.5 & GATA4 (cardiac contractility)', 'PAX1 (sclerotome)', 'SHH (floor plate)'],
    activeOrganSystems: ['First Heartbeat', 'Neural Tube Closure Initiation', 'Pharyngeal Arch 1 & 2'],
    clinicalFocus: 'First heartbeat detectable via transvaginal Doppler; earliest embryonic viability sign.',
    germLayerHighlights: {
      ectoderm: 'Neural tube closing; open cranial and caudal neuropores; otic placodes',
      mesoderm: '4–12 somite pairs, pulsating heart tube (S-shape looping starts)',
      endoderm: 'Foregut and hindgut pockets closing'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Fetal pole ~3 mm', 'Flickering cardiac activity (100–110 BPM)'],
      crlMm: 3.0,
      dopplerNotes: 'M-mode captures earliest 105 BPM rhythmic cardiac contractions.'
    },
    hotspots: [],
    modelType: 'neurula_week4'
  },
  {
    id: 'cs11_rostral_neuropore',
    week: 4,
    dayStart: 24,
    dayEnd: 25,
    carnegieStage: 11,
    carnegieNumber: 11,
    stageName: 'Carnegie Stage 11',
    title: 'CS 11: 13–20 Somites & Rostral Neuropore Closure',
    subtitle: 'Optic Vesicles, S-Looping Heart & Cephalic Flexure',
    trimester: 'Embryonic',
    developmentalEpoch: 'Early Organogenesis & Pharyngeal Arches',
    crlMm: 3.8,
    heartRateBpm: 115,
    sizeAnalogy: 'Apple seed (3.8 mm)',
    keyEvents: [
      'Cranial (Anterior/Rostral) Neuropore closes definitively on Day 25',
      'Optic vesicles evaginate from diencephalon toward surface ectoderm',
      'Embryonic body develops distinct C-shaped ventral curvature (cephalic & tail folds)',
      '13 to 20 somite pairs present along the dorsal axis',
      'Heart tube loops dextrally: bulboventricular loop establishes chamber orientation'
    ],
    morphogens: ['Folic Acid dependent methylation', 'PAX6 (optic vesicle)', 'HAND1/HAND2 (ventricular looping)'],
    activeOrganSystems: ['Cranial Neuropore Closure', 'Optic Vesicle Evagination', 'Heart Looping'],
    clinicalFocus: 'Failure of cranial neuropore closure results in Anencephaly / Exencephaly (high AFP).',
    germLayerHighlights: {
      ectoderm: 'Closed cranial neural tube, optic vesicles, open caudal neuropore',
      mesoderm: '13–20 somites, cardiac looping, pronephric tubules',
      endoderm: 'Foregut closes; thyroid primordium appears in floor of pharynx'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Embryonic pole ~4 mm with active cardiac flicker'],
      crlMm: 3.8,
      dopplerNotes: 'Pulsatile cardiac Doppler with clear systolic peak.'
    },
    hotspots: [],
    modelType: 'neurula_week4'
  },
  {
    id: 'cs12_caudal_neuropore',
    week: 4,
    dayStart: 26,
    dayEnd: 27,
    carnegieStage: 12,
    carnegieNumber: 12,
    stageName: 'Carnegie Stage 12',
    title: 'CS 12: 21–29 Somites & Caudal Neuropore Closure',
    subtitle: '3 Pharyngeal Arches, Otic Vesicles & Upper Limb Primordia',
    trimester: 'Embryonic',
    developmentalEpoch: 'Early Organogenesis & Pharyngeal Arches',
    crlMm: 4.5,
    heartRateBpm: 120,
    sizeAnalogy: 'Large grain of rice (4.5 mm)',
    keyEvents: [
      'Caudal (Posterior) Neuropore closes on Day 28, completing primary neurulation',
      '21 to 29 somite pairs visible',
      'Three pairs of pharyngeal arches clearly defined; 4th arch emerging',
      'Otic pits invaginate and close into otic vesicles (otocysts)',
      'Upper limb bud swelling appears as a lateral mesodermal ridge at C5–T1 level'
    ],
    morphogens: ['FGF10 (upper limb bud initiation)', 'TBX5 (forelimb specification)', 'HOXB genes'],
    activeOrganSystems: ['Complete Neural Tube Closure', 'Upper Limb Primordium', 'Pharyngeal Arches 1–3'],
    clinicalFocus: 'Failure of caudal neuropore closure causes Spina Bifida (Myelomeningocele).',
    germLayerHighlights: {
      ectoderm: 'Completely closed primary neural tube, otic vesicles, lens placodes',
      mesoderm: '21–29 somite pairs, mesonephric duct and ridge, septum transversum',
      endoderm: 'Laryngotracheal groove (lung bud primordium) arises from foregut floor'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Fetal pole 4–5 mm', 'Yolk sac ~4 mm', 'Heart rate ~120 BPM'],
      crlMm: 4.5,
      dopplerNotes: 'Continuous high diastolic vascular flow.'
    },
    hotspots: [],
    modelType: 'neurula_week4'
  },
  {
    id: 'cs13_limb_buds',
    week: 4,
    dayStart: 28,
    dayEnd: 30,
    carnegieStage: 13,
    carnegieNumber: 13,
    stageName: 'Carnegie Stage 13',
    title: 'CS 13: 30+ Somites & Upper Limb Buds',
    subtitle: '4 Pharyngeal Arches, Lung Buds & Lower Limb Swellings',
    trimester: 'Embryonic',
    developmentalEpoch: 'Early Organogenesis & Pharyngeal Arches',
    crlMm: 5.5,
    heartRateBpm: 125,
    sizeAnalogy: 'Small lentil (5.5 mm)',
    keyEvents: [
      '30 or more somite pairs; prominent C-shaped embryonic body curvature',
      'Distinct paddle-shaped Upper Limb Buds; Lower Limb Buds emerge 2 days later at L2–S2',
      'Four Pharyngeal Arches well developed; lens placode thickens',
      'Bifurcation of lung bud into left and right primary bronchial buds',
      'Hepatic cords invade septum transversum forming liver primordium'
    ],
    morphogens: ['FGF8 & FGF10 (AER limb growth)', 'TBX4 (hindlimb)', 'SHH (ZPA limb patterning)'],
    activeOrganSystems: ['Upper & Lower Limb Buds', 'Primary Bronchial Buds', 'Hepatic Diverticulum'],
    clinicalFocus: 'Thalidomide exposure during days 28–35 causes severe limb amelia/phocomelia.',
    germLayerHighlights: {
      ectoderm: 'Apical Ectodermal Ridge (AER) over limb buds, 3 primary brain vesicles',
      mesoderm: 'Septum transversum (central tendon of diaphragm), mesonephric glomeruli',
      endoderm: 'Bifurcated lung buds, dorsal and ventral pancreatic buds'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL 5–6 mm', 'Pronounced embryonic curvature', 'Strong cardiac motion (125 BPM)'],
      crlMm: 5.5,
      dopplerNotes: 'Aortic arch and vitelline artery waveforms.'
    },
    hotspots: [],
    modelType: 'organogenesis_week5'
  },
  {
    id: 'cs14_brain_vesicles',
    week: 5,
    dayStart: 31,
    dayEnd: 35,
    carnegieStage: 14,
    carnegieNumber: 14,
    stageName: 'Carnegie Stage 14',
    title: 'CS 14: Five Brain Vesicles & Lens Pits',
    subtitle: 'Invaginating Lens Pit, Ureteric Bud & Cardiac Septation',
    trimester: 'Embryonic',
    developmentalEpoch: 'Early Organogenesis & Pharyngeal Arches',
    crlMm: 7.0,
    heartRateBpm: 135,
    sizeAnalogy: 'Pellegrino pea / Small blueberry (7 mm)',
    keyEvents: [
      'Brain subdivides into 5 secondary vesicles: Telencephalon, Diencephalon, Mesencephalon, Metencephalon, Myelencephalon',
      'Lens pit invaginates deeply from surface ectoderm into optic cup',
      'Ureteric bud sprouts from mesonephric duct to induce metanephros (permanent kidney)',
      'Endocardial cushions in atrioventricular canal fuse to divide single AV canal',
      'Upper limb bud differentiates into proximal limb segment and distal hand paddle'
    ],
    morphogens: ['PAX6 (lens pit)', 'GDNF / c-Ret (ureteric bud branching)', 'NKX2.5 (interatrial septum primum)'],
    activeOrganSystems: ['5 Secondary Brain Vesicles', 'Lens Pit Invagination', 'Permanent Kidney Induction'],
    clinicalFocus: 'Renal agenesis (Potter sequence) occurs if ureteric bud fails to induce metanephros.',
    germLayerHighlights: {
      ectoderm: '5 brain vesicles, lens pits, nasal placodes',
      mesoderm: 'AV endocardial cushions fusing, metanephric blastema condensing',
      endoderm: 'Hepatic cords expanding; dorsal & ventral pancreatic buds fusing'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~7 mm', 'Cystic cavity in hindbrain (normal rhombencephalon)', 'Heart ~135 BPM'],
      crlMm: 7.0,
      dopplerNotes: 'Umbilical artery pulsatile waveforms.'
    },
    hotspots: [],
    modelType: 'organogenesis_week5'
  },
  {
    id: 'cs15_lens_vesicles',
    week: 5,
    dayStart: 35,
    dayEnd: 38,
    carnegieStage: 15,
    carnegieNumber: 15,
    stageName: 'Carnegie Stage 15',
    title: 'CS 15: Lens Vesicles & Hand Plates',
    subtitle: 'Closed Lens Vesicles, Olfactory Pits & Primary Gut Loop',
    trimester: 'Embryonic',
    developmentalEpoch: 'Early Organogenesis & Pharyngeal Arches',
    crlMm: 8.5,
    heartRateBpm: 142,
    sizeAnalogy: 'Sweet corn kernel (8.5 mm)',
    keyEvents: [
      'Lens vesicle completely pinches off from surface ectoderm and closes into eye orbit',
      'Nasal (olfactory) placodes invaginate to form deep nasal pits flanked by medial/lateral nasal prominences',
      'Hand plates become distinctly flattened paddles on upper extremities',
      'Midgut primary loop begins rapid elongation, preparing for umbilical herniation',
      'Atrioventricular septum completes; septum primum grows toward AV cushions'
    ],
    morphogens: ['PAX6 (lens vesicle maturation)', 'SHH (facial midline development)', 'PITX2 (gut loop asymmetry)'],
    activeOrganSystems: ['Closed Lens Vesicles', 'Olfactory Nasal Pits', 'Hand Paddle Plates'],
    clinicalFocus: 'Maternal Rubella infection at CS 15 causes congenital cataracts and microphthalmia.',
    germLayerHighlights: {
      ectoderm: 'Detached lens vesicles, olfactory pits, cerebral hemisphere bulges',
      mesoderm: 'Interatrial septum primum with ostium primum, metanephric collecting ducts branching',
      endoderm: 'Primary midgut loop herniating toward vitelline duct'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL 8–9 mm', 'Head distinct from trunk', 'Physiological cystic rhombencephalon'],
      crlMm: 8.5,
      dopplerNotes: 'Rapid umbilical cord diastolic flow.'
    },
    hotspots: [],
    modelType: 'organogenesis_week5'
  },
  {
    id: 'cs16_retinal_pigment',
    week: 6,
    dayStart: 38,
    dayEnd: 42,
    carnegieStage: 16,
    carnegieNumber: 16,
    stageName: 'Carnegie Stage 16',
    title: 'CS 16: Retinal Pigment & Foot Plates',
    subtitle: 'Dark Eye Cup Pigmentation, Auricular Hillocks & Handplate Notches',
    trimester: 'Embryonic',
    developmentalEpoch: 'Mid Organogenesis & Limb Morphogenesis',
    crlMm: 11.0,
    heartRateBpm: 150,
    sizeAnalogy: 'Blueberry (11 mm)',
    keyEvents: [
      'Melanin pigment deposits in outer layer of optic cup, visible as a distinct dark ring',
      'Auricular hillocks of His appear around 1st pharyngeal cleft (future external ear pinna)',
      'Foot plates form as distinct flattened paddles on lower limbs',
      'Upper limb exhibits distinct arm, forearm, and handplate segments',
      'Interventricular foramen reduces as muscular interventricular septum rises'
    ],
    morphogens: ['MITF / PAX6 (retinal pigment melanin synthesis)', 'HOXA13 (hand/foot differentiation)'],
    activeOrganSystems: ['Retinal Pigmentation', 'Auricular Hillocks of His', 'Foot Paddle Plates'],
    clinicalFocus: 'First arch syndromes (Treacher Collins, microtia) manifest from auricular hillock dysplasia.',
    germLayerHighlights: {
      ectoderm: 'Melanin in retinal pigment epithelium; auricular hillocks 1–6',
      mesoderm: 'Muscular ventricular septum rising, chondrification centers in humerus',
      endoderm: 'Midgut loop extending into proximal umbilical cord'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~11 mm', 'Clear fetal pole with distinct head and limb paddles'],
      crlMm: 11.0,
      dopplerNotes: 'Peak cardiac frequency approaching 150 BPM.'
    },
    hotspots: [],
    modelType: 'organogenesis_week6'
  },
  {
    id: 'cs17_digital_rays',
    week: 6,
    dayStart: 42,
    dayEnd: 44,
    carnegieStage: 17,
    carnegieNumber: 17,
    stageName: 'Carnegie Stage 17',
    title: 'CS 17: Hand Digital Rays & Midgut Herniation',
    subtitle: 'Finger Rays, Physiological Umbilical Herniation & Gut Rotation',
    trimester: 'Embryonic',
    developmentalEpoch: 'Mid Organogenesis & Limb Morphogenesis',
    crlMm: 13.5,
    heartRateBpm: 158,
    sizeAnalogy: 'Sweet pea / Large blueberry (13.5 mm)',
    keyEvents: [
      'Digital rays (future finger condensations) clearly visible in hand plates',
      'Physiological midgut herniation: intestinal loops enter extraembryonic coelom of umbilical cord',
      'First 90-degree counterclockwise rotation of midgut around superior mesenteric artery (SMA)',
      'Truncal cushions spiral to septate truncus arteriosus into aorta and pulmonary trunk',
      'Nasolacrimal groove forms between lateral nasal and maxillary prominences'
    ],
    morphogens: ['BMP4 / Msx2 (interdigital tissue condensations)', 'PITX2 (midgut 90° rotation)', 'Neural crest AP septum'],
    activeOrganSystems: ['Digital Rays in Hands', 'Physiological Midgut Herniation', 'Aorticopulmonary Septation'],
    clinicalFocus: 'Transposition of the Great Arteries (TGA) occurs if aorticopulmonary spiral septum fails to twist.',
    germLayerHighlights: {
      ectoderm: 'Handplate digital rays, dental lamina for primary teeth',
      mesoderm: 'Neural crest conotruncal spiral septum dividing truncus into aorta & pulmonary artery',
      endoderm: 'Midgut loop herniated in umbilical cord (SMA axis)'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~13–14 mm', 'Normal physiological midgut herniation at cord insertion', 'Heart 155–160 BPM'],
      crlMm: 13.5,
      dopplerNotes: 'Vigorous twin umbilical artery flow.'
    },
    hotspots: [],
    modelType: 'organogenesis_week6'
  },
  {
    id: 'cs18_elbow_flexure',
    week: 7,
    dayStart: 44,
    dayEnd: 48,
    carnegieStage: 18,
    carnegieNumber: 18,
    stageName: 'Carnegie Stage 18',
    title: 'CS 18: Elbow Flexure & Toe Digital Rays',
    subtitle: 'Elbow Notching, Digital Rays in Feet & Palatal Shelves',
    trimester: 'Embryonic',
    developmentalEpoch: 'Mid Organogenesis & Limb Morphogenesis',
    crlMm: 16.0,
    heartRateBpm: 162,
    sizeAnalogy: 'Large kidney bean (16 mm)',
    keyEvents: [
      'Elbow flexure clearly recognizable; upper limbs bend ventrally toward cardiac prominence',
      'Toe digital rays appear in foot plates; rim notches delineate future fingers in handplates',
      'Lateral palatine shelves arise from maxillary prominences flanking the tongue',
      'Interdigital apoptosis initiated between hand digital rays via caspases 3 and 8',
      'Primary ossification begins in clavicle (first bone in body to ossify)'
    ],
    morphogens: ['Caspases 3/8 (interdigital apoptosis)', 'Runx2 (clavicle osteoblast differentiation)'],
    activeOrganSystems: ['Elbow Flexure', 'Foot Digital Rays', 'Palatine Shelves'],
    clinicalFocus: 'Failure of interdigital apoptosis causes syndactyly (webbed digits).',
    germLayerHighlights: {
      ectoderm: 'Notched digital margins in hand; primary palate fusion',
      mesoderm: 'Chondrification of humerus, radius, ulna; membranous ventricular septum closing',
      endoderm: 'Second pouch endoderm forms palatine tonsil primordium'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~16 mm', 'First subtle involuntary somatic body twitches'],
      crlMm: 16.0,
      dopplerNotes: 'Distinct high-velocity aortic ejection.'
    },
    hotspots: [],
    modelType: 'organogenesis_week6'
  },
  {
    id: 'cs19_trunk_straightening',
    week: 7,
    dayStart: 48,
    dayEnd: 51,
    carnegieStage: 19,
    carnegieNumber: 19,
    stageName: 'Carnegie Stage 19',
    title: 'CS 19: Trunk Straightening & Limb Elongation',
    subtitle: 'Straightening of Embryonic Axis, Free Fingers & Auricle Fusion',
    trimester: 'Embryonic',
    developmentalEpoch: 'Mid Organogenesis & Limb Morphogenesis',
    crlMm: 19.0,
    heartRateBpm: 165,
    sizeAnalogy: 'Small grape (19 mm)',
    keyEvents: [
      'Embryonic trunk begins straightening; head lifts slightly from chest',
      'Fingers become prominent and distinct; distal notches deepen in handplates',
      'Toe rays notched; knee flexure recognizable in lower extremities',
      'Auricular hillocks coalesce into definitive external ear cartilage (pinna)',
      'Membranous ventricular septum completes closure, ending cardiac septation'
    ],
    morphogens: ['Runx2 / Osterix (bone matrix)', 'SOX9 (cartilage models)', 'BMP signaling in digits'],
    activeOrganSystems: ['Axial Straightening', 'Ventricular Septum Completion', 'Auricular Hillock Coalescence'],
    clinicalFocus: 'Membranous Ventricular Septal Defect (VSD) is the most common congenital cardiac lesion.',
    germLayerHighlights: {
      ectoderm: 'Ear pinna elevated; eyelid folds appearing',
      mesoderm: 'Closed interventricular foramen, chondrified femur and tibia',
      endoderm: 'Major subsegmental bronchial branches in lungs'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~19 mm', 'Separate head, thorax, and limb buds with spontaneous movements'],
      crlMm: 19.0,
      dopplerNotes: 'Four chamber view primordium on high-resolution scan.'
    },
    hotspots: [],
    modelType: 'organogenesis_week6'
  },
  {
    id: 'cs20_upper_limbs_bent',
    week: 8,
    dayStart: 51,
    dayEnd: 53,
    carnegieStage: 20,
    carnegieNumber: 20,
    stageName: 'Carnegie Stage 20',
    title: 'CS 20: Hands Over Heart & Anal Membrane',
    subtitle: 'Elbows Bent Ventrally, Hands Curve Across Precordium & Urorectal Septum',
    trimester: 'Embryonic',
    developmentalEpoch: 'Late Embryonic & Digital Cleavage',
    crlMm: 22.0,
    heartRateBpm: 168,
    sizeAnalogy: 'Medium grape (22 mm)',
    keyEvents: [
      'Upper limbs are distinctly bent at elbows; hands curve ventrally over precordial cardiac prominence',
      'Fingers are longer and completely separated except at their bases',
      'Toes are clearly delineated with deep interdigital notches',
      'Urorectal septum fuses with cloacal membrane, separating urogenital sinus from rectum',
      'Scalp vascular plexus forms a prominent superficial ring'
    ],
    morphogens: ['SRY gene (initiates testicle differentiation in XY males)', 'Wnt4 (ovarian pathway)'],
    activeOrganSystems: ['Hand Convergence Over Precordium', 'Cloacal Partitioning', 'Scalp Vascular Ring'],
    clinicalFocus: 'Persistent cloaca and imperforate anus arise if urorectal septum fails to divide cloaca.',
    germLayerHighlights: {
      ectoderm: 'Upper and lower eyelid folds growing over cornea',
      mesoderm: 'Primary ossification of mandible and maxilla; early Leydig cell cords',
      endoderm: 'Anal canal (upper 2/3 endodermal, lower 1/3 ectodermal proctodeum)'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~22 mm', 'Fetal limb kicking and neck extension movements'],
      crlMm: 22.0,
      dopplerNotes: 'Peak physiological heart rate (165–170 BPM).'
    },
    hotspots: [],
    modelType: 'fetus_week8'
  },
  {
    id: 'cs21_fingers_free',
    week: 8,
    dayStart: 53,
    dayEnd: 54,
    carnegieStage: 21,
    carnegieNumber: 21,
    stageName: 'Carnegie Stage 21',
    title: 'CS 21: Free Fingers & Palatal Shelf Elevation',
    subtitle: 'Fingers Cleaved, Webbed Toes & Secondary Palate Elevation',
    trimester: 'Embryonic',
    developmentalEpoch: 'Late Embryonic & Digital Cleavage',
    crlMm: 24.5,
    heartRateBpm: 165,
    sizeAnalogy: 'Large grape / Olive (24.5 mm)',
    keyEvents: [
      'Fingers are completely free, slender, and separated; hands approach midline',
      'Toes remain webbed but individual phalanges are prominent',
      'Lateral palatine shelves elevate from vertical to horizontal above the flattened tongue',
      'External ear pinna ascends toward final position at eye level',
      'Genital tubercle enlarges; urogenital folds and labioscrotal swellings form'
    ],
    morphogens: ['TGF-β3 (palatal shelf fusion)', 'BMP signaling', 'DHT (5α-reductase androgen conversion)'],
    activeOrganSystems: ['Free Fingers', 'Palatal Shelf Horizontal Elevation', 'Genital Tubercle Primordia'],
    clinicalFocus: 'Cleft Palate results if palatine shelves fail to elevate or fuse at midline.',
    germLayerHighlights: {
      ectoderm: 'Elevated palatine shelves; tactile nerve endings in fingertips',
      mesoderm: 'Chondrocranium base ossifying, renal glomeruli functional',
      endoderm: 'Palatal fusion divides oral cavity from nasal cavities'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~24–25 mm', 'Calvarium outline visible', 'Distinct hand and foot movements'],
      crlMm: 24.5,
      dopplerNotes: 'Low-resistance uterine and umbilical flow.'
    },
    hotspots: [],
    modelType: 'fetus_week8'
  },
  {
    id: 'cs22_toes_separated',
    week: 8,
    dayStart: 54,
    dayEnd: 56,
    carnegieStage: 22,
    carnegieNumber: 22,
    stageName: 'Carnegie Stage 22',
    title: 'CS 22: Toes Separated & Eyelid Fusion',
    subtitle: 'Complete Toes Separation, Primary Palate Fusion & Eyelid Margins',
    trimester: 'Embryonic',
    developmentalEpoch: 'Late Embryonic & Digital Cleavage',
    crlMm: 27.0,
    heartRateBpm: 165,
    sizeAnalogy: 'Raspberry / Large olive (27 mm)',
    keyEvents: [
      'Toes are completely free and separated; feet rotated toward sagittal midline',
      'Eyelids grow over eyes and begin fusing at their epithelial margins (remain closed until W26)',
      'Superficial scalp vascular plexus spreads over upper half of head',
      'External genitalia show distinct indifferent structures (phallus, urethral groove, labioscrotal folds)',
      'Primary ossification centers expand in femur, tibia, humerus, and ribs'
    ],
    morphogens: ['Runx2 (endochondral ossification)', 'Periderm differentiation factors'],
    activeOrganSystems: ['Toes Cleavage', 'Eyelid Fusion Initiation', 'Long Bone Ossification'],
    clinicalFocus: 'Hypospadias can occur if urethral folds fail to fuse along ventral penile shaft.',
    germLayerHighlights: {
      ectoderm: 'Fused eyelids, nail field beds on dorsal tips of digits',
      mesoderm: 'Long bone primary ossification centers; metanephric ascending kidneys in lumbar fossa',
      endoderm: 'Midgut loop physiological rotation 180 degrees complete'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~27 mm', 'Clear distinction of brain ventricles and falx cerebri'],
      crlMm: 27.0,
      dopplerNotes: 'Ductus venosus biphasic forward flow.'
    },
    hotspots: [],
    modelType: 'fetus_week8'
  },
  {
    id: 'cs23_fetal_transition',
    week: 8,
    dayStart: 56,
    dayEnd: 56,
    carnegieStage: 23,
    carnegieNumber: 23,
    stageName: 'Carnegie Stage 23',
    title: 'CS 23: End of Embryonic Period',
    subtitle: 'Final Carnegie Stage: 100% Organ Systems Established & Fetal Horizon',
    trimester: 'Embryonic',
    developmentalEpoch: 'Late Embryonic & Digital Cleavage',
    crlMm: 30.0,
    weightGrams: 1.5,
    heartRateBpm: 165,
    sizeAnalogy: 'Large plum olive (30 mm CRL, 1.5 grams)',
    keyEvents: [
      'Carnegie Stage 23 marks the definitive conclusion of the embryonic period and organogenesis',
      'All primordial organ systems are anatomically established in their correct biological locations',
      'Head is rounded, neck is clearly defined, and facial profile is distinctly human',
      'Digits are long and completely separated; spontaneous reflex twitches occur',
      'Transition to the Fetal Period (Weeks 9–38+), characterized by tissue growth and functional maturation'
    ],
    morphogens: ['Fetal steroidogenesis hormones', 'Growth hormone / IGF-1 signaling cascades'],
    activeOrganSystems: ['Complete Organogenesis', 'Fetal Transition', 'Reflex Neuromuscular Arcs'],
    clinicalFocus: 'Teratogen susceptibility shifts from major structural malformations to functional/growth defects.',
    germLayerHighlights: {
      ectoderm: 'Stratified epidermis, fused eyelids, external acoustic meatus',
      mesoderm: 'Membranous ventricular septum completed, osteogenesis throughout skeleton',
      endoderm: 'Subsegmental bronchial tree, secretory thyroid and pancreatic islets'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL 30 mm (standard dating metric)', 'Clearly identifiable fetal silhouette', 'Active limb movements'],
      crlMm: 30.0,
      bpdMm: 9.0,
      dopplerNotes: 'Triphasic ductus venosus and 3-vessel umbilical cord (2 arteries, 1 vein).'
    },
    hotspots: [],
    modelType: 'fetus_week8'
  }
];
