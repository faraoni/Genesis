import { EmbryoStage } from '../types';

export const EMBRYO_STAGES: EmbryoStage[] = [
  {
    id: 'stage_w1_zygote',
    week: 1,
    dayStart: 1,
    dayEnd: 3,
    carnegieStage: 1,
    title: 'Fertilization & Cleavage',
    subtitle: 'Zygote to 8-Cell Stage in the Fallopian Ampulla',
    trimester: 'Pre-Embryonic',
    crlMm: 0.15,
    sizeAnalogy: 'Fine grain of sand (0.15 mm)',
    keyEvents: [
      'Acrosomal reaction & cortical granule exocytosis prevents polyspermy',
      'Syngamy: Fusion of maternal and paternal pronuclei restoring diploid genome (46,XX or 46,XY)',
      'Rapid mitotic cleavage without cytoplasmic growth within rigid zona pellucida',
      'Totipotency of early blastomeres (Days 1–3)'
    ],
    morphogens: ['Zygotic genome activation', 'E-cadherin compaction', 'OCT4', 'SOX2'],
    germLayerHighlights: {
      ectoderm: 'Undifferentiated totipotent blastomeres',
      mesoderm: 'Not yet specified',
      endoderm: 'Not yet specified',
      neuralCrest: 'Not yet specified'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Microscopic (below standard ultrasound resolution)', 'Secretory phase endometrium'],
      dopplerNotes: 'Corpus luteum high diastolic vascular ring in maternal ovary (Ring of Fire).'
    },
    hotspots: [
      {
        id: 'zp_hotspot',
        name: 'Zona Pellucida & Polar Bodies',
        position: [0, 1.2, 0],
        germLayer: 'extraembryonic',
        shortDesc: 'Glycoprotein envelope (ZP1, ZP2, ZP3, ZP4) preserving structural integrity.',
        fullDesc: 'The zona pellucida encloses the dividing zygote until hatching in the uterine cavity around Day 5. It prevents premature ectopic tubal implantation.',
        clinicalSignificance: 'Failure to hatch causes implantation failure; premature hatching causes ectopic tubal pregnancy.',
        molecularSignaling: 'ZP3 binding activates sperm sperm-egg adhesion receptor Juno-Izumo1.',
        fateAdultOrgans: ['Shed prior to implantation']
      },
      {
        id: 'pronuclei_hotspot',
        name: 'Pronuclei & Blastomere Compact Junctions',
        position: [0, 0, 0],
        germLayer: 'extraembryonic',
        shortDesc: 'Compacted blastomeres linked via E-cadherin and gap junctions.',
        fullDesc: 'Compaction at the 8-to-16-cell transition establishes outer cell polarization and inner cell communication, setting up the first cell lineage divergence.',
        clinicalSignificance: 'Monozygotic twinning can occur if blastomeres separate at this totipotent stage (dichorionic-diamniotic).',
        fateAdultOrgans: ['All embryonic and extraembryonic lineages']
      }
    ],
    modelType: 'cleavage'
  },
  {
    id: 'stage_w1_blastocyst',
    dayStart: 4,
    dayEnd: 7,
    week: 1,
    carnegieStage: 3,
    title: 'Morula to Blastocyst',
    subtitle: 'Cavitation, Inner Cell Mass & Early Implantation',
    trimester: 'Pre-Embryonic',
    crlMm: 0.2,
    sizeAnalogy: 'Poppy seed (0.2 mm)',
    keyEvents: [
      'Cavitation driven by Na+/K+-ATPase pumps creating blastocoel fluid cavity',
      'Segregation into Trophoblast (placental lineage) and Inner Cell Mass (Embryoblast)',
      'Zona pellucida enzymatic hatching by uterine and trophoblastic proteases',
      'Attachment to uterine epithelium via L-selectin and integrins (Day 6–7)'
    ],
    morphogens: ['CDX2 (trophoblast)', 'OCT4 / NANOG (pluripotent ICM)', 'GATA6 (primitive endoderm)'],
    germLayerHighlights: {
      ectoderm: 'Pluripotent Embryoblast (ICM)',
      mesoderm: 'Trophoblast lineage specified',
      endoderm: 'Primitive hypoblast emerges at ICM ventral surface',
    },
    ultrasoundFeatures: {
      visibleStructures: ['Decidualized endometrium', 'Sub-millimeter blastocyst cavity (MRI/Research)'],
      dopplerNotes: 'Maternal spiral artery remodeling commences.'
    },
    hotspots: [
      {
        id: 'icm_hotspot',
        name: 'Inner Cell Mass (Embryoblast)',
        position: [0, 0.45, 0],
        germLayer: 'ectoderm',
        shortDesc: 'Pluripotent stem cells yielding the entire embryonic body proper.',
        fullDesc: 'The inner cell mass expresses high levels of OCT4, SOX2, and NANOG, capable of differentiating into all 3 germ layers and germline cells.',
        clinicalSignificance: 'Source of human embryonic stem cells (hESCs). Monochorionic diamniotic twinning occurs when ICM splits.',
        molecularSignaling: 'FGF4/FGFR2 signaling orchestrates epiblast vs primitive endoderm sorting.',
        fateAdultOrgans: ['Entire human fetus, amnion, and allantois']
      },
      {
        id: 'trophoblast_hotspot',
        name: 'Trophectoderm (Trophoblast)',
        position: [0, -0.7, 0],
        germLayer: 'extraembryonic',
        shortDesc: 'Outer monolayer that invades endometrium and produces hCG.',
        fullDesc: 'Differentiates upon contact with endometrium into inner Cytotrophoblast and outer multinucleated invasive Syncytiotrophoblast.',
        clinicalSignificance: 'Syncytiotrophoblast secretes β-hCG to rescue corpus luteum; defective invasion causes preeclampsia.',
        molecularSignaling: 'CDX2 and Eomesodermin repress pluripotency genes.',
        fateAdultOrgans: ['Chorion frondosum and fetal component of placenta']
      }
    ],
    modelType: 'blastocyst'
  },
  {
    id: 'stage_w2_bilaminar',
    week: 2,
    dayStart: 8,
    dayEnd: 14,
    carnegieStage: 5,
    title: 'Bilaminar Disc & Implantation',
    subtitle: 'The "Rule of Twos": Epiblast, Hypoblast, Amnion & Yolk Sac',
    trimester: 'Pre-Embryonic',
    crlMm: 0.4,
    sizeAnalogy: 'Sesame seed tip (0.4 mm)',
    keyEvents: [
      'Embryoblast splits into Epiblast (columnar) and Hypoblast (cuboidal)',
      'Trophoblast splits into Cytotrophoblast and Syncytiotrophoblast',
      'Two cavities form: Amniotic Cavity and Primitive Yolk Sac (Heuser membrane)',
      'Extraembryonic mesoderm cavitates to form Chorionic Cavity (Extraembryonic coelom)',
      'Uteroplacental circulation initiates through syncytiotrophoblastic lacunae'
    ],
    morphogens: ['Wnt3a', 'Nodal', 'BMP4 antagonist Chordin', 'hCG peak surge'],
    germLayerHighlights: {
      ectoderm: 'Epiblast layer giving rise to all future germ layers',
      mesoderm: 'Extraembryonic somatic and splanchnic mesoderm',
      endoderm: 'Hypoblast (primary and secondary yolk sac roof)'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Double decidual sac sign (intradecidual sign)', 'Gestational sac (2–3 mm)'],
      gestationalSacMm: 3,
      dopplerNotes: 'Trophoblastic flow with low-resistance high diastolic velocities.'
    },
    hotspots: [
      {
        id: 'epiblast_hotspot',
        name: 'Epiblast Layer',
        position: [0, 0.2, 0],
        germLayer: 'ectoderm',
        shortDesc: 'Columnar dorsal layer lining the amniotic cavity floor.',
        fullDesc: 'Through subsequent gastrulation, epiblast cells migrate through the primitive streak to form definitive endoderm, intraembryonic mesoderm, and ectoderm.',
        clinicalSignificance: 'Sacrococcygeal teratoma arises if primitive streak epiblast remnants persist at the caudal tip.',
        fateAdultOrgans: ['Entire embryo proper, skin, nervous system, muscles, bones, viscera']
      },
      {
        id: 'yolk_sac_hotspot',
        name: 'Primary Yolk Sac & Hypoblast',
        position: [0, -0.4, 0],
        germLayer: 'endoderm',
        shortDesc: 'Ventral nutrient vesicle and earliest site of hematopoiesis and germ cell origin.',
        fullDesc: 'Primordial germ cells (PGCs) first appear in the wall of the yolk sac near the allantois around Day 24 before migrating to genital ridges.',
        clinicalSignificance: 'Yolk sac size & shape is a key early ultrasound predictor of embryonic viability (normal 3–6 mm).',
        fateAdultOrgans: ['Early hematopoiesis, vitelline vessels, primordial germ cells']
      }
    ],
    modelType: 'bilaminar'
  },
  {
    id: 'stage_w3_gastrula',
    week: 3,
    dayStart: 15,
    dayEnd: 21,
    carnegieStage: 7,
    title: 'Gastrulation & Trilaminar Disc',
    subtitle: 'Primitive Streak, Notochord & Germ Layer Specification',
    trimester: 'Embryonic',
    crlMm: 1.5,
    sizeAnalogy: 'Small mustard seed (1.5 mm)',
    keyEvents: [
      'Gastrulation: Epiblast cells undergo Epithelial-to-Mesenchymal Transition (EMT) at Primitive Streak',
      'Establishment of the 3 definitive germ layers: Ectoderm, Intraembryonic Mesoderm, Endoderm',
      'Notochordal process invaginates from Hensen’s Node to establish cranial-caudal axial polarity',
      'Left-right asymmetry dictated by nodal cilia rotational flow (Kartagener syndrome link)',
      'Earliest horseshoe-shaped cardiogenic field forms cranial to neural plate'
    ],
    morphogens: ['Nodal (primitive streak)', 'FGF-8 (EMT migration)', 'SHH (cranial midline & left identity)', 'BMP-4 (ventralization)'],
    germLayerHighlights: {
      ectoderm: 'Neural plate (neuroectoderm) and surface ectoderm',
      mesoderm: 'Paraxial (somitomeres), Intermediate (pronephros), Lateral Plate (splanchnic/somatic)',
      endoderm: 'Definitive gut lining and prechordal plate',
      neuralCrest: 'Induced at neural plate border via Wnt + BMP gradient'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Gestational sac ~10 mm', 'Yolk sac clearly visible (2–4 mm)', 'Faint embryonic pole'],
      gestationalSacMm: 10,
      crlMm: 1.5,
      dopplerNotes: 'Early angiogenesis in extraembryonic connecting stalk.'
    },
    hotspots: [
      {
        id: 'notochord_hotspot',
        name: 'Notochord & Hensen\'s Node',
        position: [0, 0.1, 0],
        germLayer: 'mesoderm',
        shortDesc: 'Primary axial signaling center inducing the overlying neural tube.',
        fullDesc: 'Secretes Sonic Hedgehog (SHH) and Noggin/Chordin to induce neuroectoderm and ventralize the neural tube and somites.',
        clinicalSignificance: 'Persists in adults as the nucleus pulposus of intervertebral discs; can give rise to Chordoma tumors.',
        molecularSignaling: 'SHH, Noggin, Chordin, Follistatin (inhibit BMP-4 neural suppression).',
        fateAdultOrgans: ['Nucleus pulposus of intervertebral discs', 'Chordoma precursor']
      },
      {
        id: 'primitive_streak_hotspot',
        name: 'Primitive Streak & Node',
        position: [0, -0.6, 0],
        germLayer: 'mesoderm',
        shortDesc: 'Linear epiblast groove dictating craniocaudal, dorsoventral & left-right axes.',
        fullDesc: 'Cilia in the node rotate clockwise, generating leftward Nodal/Lefty flow that activates PITX2 for visceral organ situs (heart loop left, liver right).',
        clinicalSignificance: 'Ciliary dynein arm mutations cause Situs Inversus (Kartagener syndrome). Sacrococcygeal teratoma arises if streak fails to regress by Week 4.',
        molecularSignaling: 'FGF8 downregulates E-cadherin to allow cell ingression.',
        fateAdultOrgans: ['Regresses and disappears by end of week 4']
      }
    ],
    modelType: 'trilaminar_gastrula'
  },
  {
    id: 'stage_w4_neurula',
    week: 4,
    dayStart: 22,
    dayEnd: 28,
    carnegieStage: 10,
    title: 'Neurulation & Early Folding',
    subtitle: 'Neural Tube Closure, Somite Segmentation & First Heartbeat',
    trimester: 'Embryonic',
    crlMm: 4.0,
    heartRateBpm: 105,
    sizeAnalogy: 'Grain of rice / Apple seed (4 mm)',
    keyEvents: [
      'Craniocaudal and lateral embryonic folding converts flat disc into C-shaped cylindrical embryo',
      'Neural tube closes: Cranial neuropore (Day 25) and Caudal neuropore (Day 28)',
      'Somites differentiate into Sclerotome (vertebrae/ribs), Myotome (skeletal muscle), Dermatome (dermis)',
      'First functional embryonic heartbeat begins around Day 22 in looping primitive heart tube (105 BPM)',
      'Pharyngeal (branchial) arches 1 to 4 and otic/lens placodes become prominent'
    ],
    morphogens: ['PAX1/PAX3 (somite patterning)', 'SHH (floor plate)', 'BMP4/7 (roof plate)', 'Folic acid metabolism'],
    germLayerHighlights: {
      ectoderm: 'Closed neural tube (brain/spinal cord), neural crest streams, lens placodes',
      mesoderm: 'Paraxial somites (30+ pairs), splanchnic cardiogenic mesoderm, pronephros/mesonephros',
      endoderm: 'Foregut, midgut (open to yolk sac via vitelline duct), hindgut with cloacal membrane',
      neuralCrest: 'Migrating to pharyngeal arches, dorsal root ganglia, autonomic chain, adrenal medulla'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Fetal pole ~3–5 mm', 'Flickering cardiac activity (100–115 BPM)', 'Clear yolk sac'],
      crlMm: 4,
      dopplerNotes: 'M-mode demonstrates regular rhythmic cardiac contractions at 105 BPM.'
    },
    hotspots: [
      {
        id: 'neural_tube_hotspot',
        name: 'Neural Tube & Cranial Neuropore',
        position: [0, 0.8, -0.3],
        germLayer: 'ectoderm',
        shortDesc: 'Primary neurulation forming brain vesicles and spinal cord.',
        fullDesc: 'Closing progresses bidirectionally from the cervical region. Anterior neuropore closes on Day 25; posterior closes on Day 28.',
        clinicalSignificance: 'Failure of cranial closure causes Anencephaly (high maternal AFP); failure of caudal closure causes Spina Bifida cystica. Prevented with folic acid supplementation.',
        molecularSignaling: 'Folate-dependent methylation, Wnt/PCP planar cell polarity pathway.',
        fateAdultOrgans: ['Brain (telencephalon, diencephalon, mesencephalon, metencephalon, myelencephalon), spinal cord, neurohypophysis']
      },
      {
        id: 'heart_tube_hotspot',
        name: 'Looping Primitive Heart Tube',
        position: [0, 0.1, 0.5],
        germLayer: 'mesoderm',
        shortDesc: 'Pulsating S-shaped tube: truncus arteriosus, bulbus cordis, ventricle, atrium, sinus venosus.',
        fullDesc: 'Dextral looping folds the ventricle caudally and ventrally while the atrium moves cranially and dorsally by Day 28, establishing basic chamber orientation.',
        clinicalSignificance: 'Dextrocardia occurs if heart loops to the left. Critical teratogen window for cardiac malformations.',
        molecularSignaling: 'NKX2.5 (master cardiac transcription factor), HAND1/HAND2.',
        fateAdultOrgans: ['Ascending aorta, pulmonary trunk, left and right ventricles, atria, coronary sinus']
      },
      {
        id: 'somites_hotspot',
        name: 'Paraxial Somites (Segmentation)',
        position: [-0.4, -0.2, -0.3],
        germLayer: 'mesoderm',
        shortDesc: 'Paired segmental blocks (42–44 pairs) flanking neural tube.',
        fullDesc: 'Form sequentially at ~3 pairs per day, providing precise developmental age staging. Subdivide into sclerotome, myotome, and dermatome.',
        clinicalSignificance: 'Klippel-Feil syndrome, hemivertebrae, and congenital scoliosis result from abnormal somite resegmentation.',
        molecularSignaling: 'Segmentation clock (Notch-Delta oscillator) coupled to FGF8/Wnt caudal gradient.',
        fateAdultOrgans: ['Vertebral column, ribs, back musculature, limb musculature, dermis of back']
      },
      {
        id: 'pharyngeal_arch_hotspot',
        name: 'Pharyngeal Arches 1 & 2',
        position: [0.3, 0.5, 0.4],
        germLayer: 'neural_crest',
        shortDesc: 'Branchial arches containing cranial nerves V, VII, IX, X, aortic arches, and skeletal bars.',
        fullDesc: '1st Arch (Mandibular): Meckel cartilage, mandible, maxilla, malleus, incus, CN V3. 2nd Arch (Hyoid): Reichert cartilage, stapes, styloid, CN VII.',
        clinicalSignificance: 'DiGeorge syndrome (22q11 deletion), Treacher Collins, First Arch syndrome (micrognathia, cleft palate).',
        fateAdultOrgans: ['Face, jaws, middle ear ossicles, cranial nerves V & VII, thyroid/parathyroid glands']
      }
    ],
    modelType: 'neurula_week4'
  },
  {
    id: 'stage_w5_organogenesis',
    week: 5,
    dayStart: 29,
    dayEnd: 35,
    carnegieStage: 14,
    title: 'Limb Buds & Brain Vesicles',
    subtitle: '5 Secondary Brain Vesicles & Upper/Lower Limb Outgrowth',
    trimester: 'Embryonic',
    crlMm: 8.0,
    heartRateBpm: 135,
    sizeAnalogy: 'Small blueberry (8 mm)',
    keyEvents: [
      'Upper limb buds appear (paddle-shaped) followed by lower limb buds (2 days later)',
      'Apical Ectodermal Ridge (AER) regulates proximodistal limb outgrowth; ZPA regulates anterior-posterior digit identity',
      'Brain subdivides into 5 secondary vesicles: Telencephalon, Diencephalon, Mesencephalon, Metencephalon, Myelencephalon',
      'Heart septation begins: Endocardial cushions fuse; primary interatrial septum primum grows',
      'Mesonephric (Wolffian) duct induces ureteric bud to initiate permanent kidney (metanephros) formation'
    ],
    morphogens: ['FGF10 / FGF8 (AER limb growth)', 'SHH (ZPA limb patterning)', 'HOX genes (limb axis)', 'WT1 / GDNF (kidney induction)'],
    germLayerHighlights: {
      ectoderm: 'AER limb rim, neuroepithelium, lens pit invagination, olfactory placodes',
      mesoderm: 'Progress zone limb mesenchyme, endocardial cushions, metanephric blastema, septum transversum (diaphragm)',
      endoderm: 'Laryngotracheal groove (lung bud bifurcation), hepatic cords, dorsal/ventral pancreatic buds',
      neuralCrest: 'Conotruncal septation of aorticopulmonary outflow tract'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~8 mm', 'Vigorous heartbeat (130–145 BPM)', 'Prominent cystic hindbrain (rhombencephalon)'],
      crlMm: 8,
      dopplerNotes: 'High-velocity pulsatile umbilical artery waveforms.'
    },
    hotspots: [
      {
        id: 'aer_limb_hotspot',
        name: 'Upper Limb Bud & AER / ZPA',
        position: [0.6, 0.1, 0.2],
        germLayer: 'ectoderm',
        shortDesc: 'Apical Ectodermal Ridge (AER) and Zone of Polarizing Activity (ZPA).',
        fullDesc: 'AER secretes FGF8 to keep distal mesenchyme proliferating. ZPA at posterior margin secretes SHH to specify thumb-to-pinky digit identity.',
        clinicalSignificance: 'Thalidomide exposure during Weeks 4–6 halts limb outgrowth causing Phocomelia/Amelia. Polydactyly/Syndactyly arise from ZPA/AER defects.',
        molecularSignaling: 'FGF8 (AER), SHH (ZPA), Wnt7a (dorsal ectoderm), Lmx1b.',
        fateAdultOrgans: ['Upper extremities: humerus, radius, ulna, carpals, metacarpals, digits']
      },
      {
        id: 'brain_vesicles_hotspot',
        name: 'Five Secondary Brain Vesicles',
        position: [0, 0.9, 0],
        germLayer: 'ectoderm',
        shortDesc: 'Telencephalon, Diencephalon, Mesencephalon, Metencephalon, Myelencephalon.',
        fullDesc: 'Rapid expansion of the cephalic flexure and pontine flexure. The telencephalon balloons laterally to form the cerebral hemispheres.',
        clinicalSignificance: 'Holoprosencephaly (failure of telencephalon hemisphere cleavage linked to SHH mutation or maternal diabetes).',
        molecularSignaling: 'Emx2, Otx2, Pax6, SHH ventral gradient.',
        fateAdultOrgans: ['Cerebral cortex, thalamus/hypothalamus, midbrain, pons/cerebellum, medulla oblongata']
      }
    ],
    modelType: 'organogenesis_week5'
  },
  {
    id: 'stage_w6_organogenesis',
    week: 6,
    dayStart: 36,
    dayEnd: 42,
    carnegieStage: 17,
    title: 'Physiological Umbilical Herniation',
    subtitle: 'Digital Rays, Midgut Loop Rotation & Retinal Pigmentation',
    trimester: 'Embryonic',
    crlMm: 14.0,
    heartRateBpm: 155,
    sizeAnalogy: 'Sweet pea / Kidney bean (14 mm)',
    keyEvents: [
      'Digital rays delineate future fingers in handplates; apoptosis between rays begins',
      'Midgut primary loop herniates physiologically into the umbilical cord (due to massive liver growth)',
      'First 90-degree counterclockwise rotation of midgut around superior mesenteric artery (SMA)',
      'Retinal pigment epithelium deposits visible dark melanin in eye cup',
      'Auricular hillocks of His surround 1st pharyngeal cleft to construct external ear pinna'
    ],
    morphogens: ['BMP-4 (interdigital apoptosis)', 'PITX2 (gut rotation)', 'MITF / PAX6 (retinal pigment)', 'SHH (facial midline)'],
    germLayerHighlights: {
      ectoderm: 'Optic cup, retinal pigment layer, dental lamina, primary mammary ridges',
      mesoderm: 'Branchial hillocks, cardiac septation (AV valve leaflets, muscular ventricular septum)',
      endoderm: 'Midgut loop, urorectal septum splitting cloaca into urogenital sinus and rectum',
      neuralCrest: 'Conotruncal spiral septum dividing truncus into aorta and pulmonary trunk'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Physiological gut herniation at cord insertion', 'Distinct head, trunk, and limb buds', 'Yolk sac ~5 mm'],
      crlMm: 14,
      dopplerNotes: 'Peak embryonic heart rate (150–175 BPM).'
    },
    hotspots: [
      {
        id: 'gut_herniation_hotspot',
        name: 'Physiological Midgut Herniation',
        position: [0.1, -0.3, 0.7],
        germLayer: 'endoderm',
        shortDesc: 'U-shaped intestinal loop herniating into extraembryonic coelom of umbilical cord.',
        fullDesc: 'The abdominal cavity is temporarily too small for the rapidly expanding liver and kidneys. The midgut loop rotates 270° counterclockwise total before returning at Week 10.',
        clinicalSignificance: 'Omphalocele (failure of gut to return to abdomen, covered by amnion/peritoneum; high association with Trisomy 18/13). Gastroschisis (full thickness body wall defect without sac, right of umbilicus).',
        fateAdultOrgans: ['Duodenum (distal to ampulla), jejunum, ileum, cecum, appendix, ascending colon, proximal 2/3 transverse colon']
      },
      {
        id: 'eye_placode_hotspot',
        name: 'Pigmented Eye Cup & Lens Vesicle',
        position: [0.4, 0.6, 0.4],
        germLayer: 'ectoderm',
        shortDesc: 'Retinal pigment visible as dark circle through translucent ectoderm.',
        fullDesc: 'Neuroectoderm of optic cup forms neural retina and pigmented epithelium; surface ectoderm invaginates to form crystalline lens.',
        clinicalSignificance: 'Congenital cataracts (maternal Rubella infection during weeks 4–7). Coloboma (failure of choroid fissure to close).',
        molecularSignaling: 'PAX6 (master eye gene), SOX2.',
        fateAdultOrgans: ['Retina, optic nerve, lens, cornea, iris']
      }
    ],
    modelType: 'organogenesis_week6'
  },
  {
    id: 'stage_w8_fetus_transition',
    week: 8,
    dayStart: 50,
    dayEnd: 56,
    carnegieStage: 23,
    title: 'End of Embryonic Period (CS 23)',
    subtitle: 'Fingers & Toes Separated, Facial Harmony & Fetal Transition',
    trimester: 'Embryonic',
    crlMm: 30.0,
    weightGrams: 1.5,
    heartRateBpm: 165,
    sizeAnalogy: 'Raspberry / Large olive (30 mm)',
    keyEvents: [
      'Carnegie Stage 23 marks the formal end of the embryonic period and organogenesis',
      'All essential organ systems are established in anatomical location',
      'Webbing between digits completely disappears via targeted caspase-mediated apoptosis',
      'Eyelids fuse over eyes (remain fused until ~Week 26)',
      'Primary ossification centers appear in long bones (clavicle and femur first)',
      'External genitalia begin differentiating from genital tubercle, swellings, and folds'
    ],
    morphogens: ['Caspases 3/8 (interdigital apoptosis)', 'SRY / TDF gene (initiates Sertoli cell differentiation in males)', 'Runx2 / Osterix (bone ossification)'],
    germLayerHighlights: {
      ectoderm: 'Fused eyelids, stratified epidermis, external acoustic meatus',
      mesoderm: 'Membranous ventricular septum completes, osteoblasts lay down bone matrix, metanephros ascends to lumbar fossa',
      endoderm: 'Major lung bronchopulmonary segments established, thyroid ascends to anterior trachea',
      neuralCrest: 'Meninges (pia/arachnoid), Schwann cells myelinating peripheral nerves'
    },
    ultrasoundFeatures: {
      visibleStructures: ['CRL ~30 mm', 'Spontaneous fetal somatic movements (flinching/twitches)', 'Definite skull calcification circle'],
      crlMm: 30,
      bpdMm: 9,
      dopplerNotes: 'Umbilical cord with clear 2 arteries and 1 vein (coiled spiral pattern).'
    },
    hotspots: [
      {
        id: 'facial_prominence_hotspot',
        name: 'Fused Facial Prominences',
        position: [0, 0.5, 0.6],
        germLayer: 'neural_crest',
        shortDesc: 'Fusion of Frontonasal, Medial Nasal, Lateral Nasal, and Maxillary prominences.',
        fullDesc: 'The primary palate (intermaxillary segment) forms from fused medial nasal prominences. The secondary palate forms from horizontal palatine shelves.',
        clinicalSignificance: 'Cleft Lip: Failure of maxillary prominence to fuse with medial nasal prominence (1 in 1000). Cleft Palate: Failure of lateral palatine shelves to fuse with each other or nasal septum.',
        fateAdultOrgans: ['Philtrum, upper lip, primary & secondary palate, nasal septum']
      },
      {
        id: 'digits_hotspot',
        name: 'Separated Digits & Nails Primordia',
        position: [0.7, -0.1, 0.5],
        germLayer: 'mesoderm',
        shortDesc: 'Free fingers and toes with developing nail fields.',
        fullDesc: 'BMP-mediated interdigital tissue apoptosis cleanly separates 5 distinct phalangeal rays.',
        clinicalSignificance: 'Syndactyly (fused digits due to failed apoptosis; most common congenital hand anomaly).',
        fateAdultOrgans: ['Fingers, toes, distal phalanges, nail beds']
      },
      {
        id: 'umbilical_cord_hotspot',
        name: 'Umbilical Cord (2 Arteries, 1 Vein)',
        position: [0, -0.4, 0.8],
        germLayer: 'extraembryonic',
        shortDesc: 'Allantois and vitelline remnants enclosed in Wharton\'s jelly.',
        fullDesc: 'Umbilical vein carries oxygenated blood from placenta to ductus venosus/IVC; two umbilical arteries return deoxygenated blood to placenta.',
        clinicalSignificance: 'Single Umbilical Artery (2-vessel cord) occurs in 1% and is associated with renal and cardiovascular anomalies.',
        fateAdultOrgans: ['Ligamentum teres hepatis (vein), medial umbilical ligaments (arteries)']
      }
    ],
    modelType: 'fetus_week8'
  },
  {
    id: 'stage_w12_first_trimester_end',
    week: 12,
    dayStart: 78,
    dayEnd: 84,
    title: 'End of First Trimester',
    subtitle: 'Complete Midgut Return, Urine Excretion & Genital Differentiation',
    trimester: 'First Trimester',
    crlMm: 60.0,
    weightGrams: 14.0,
    heartRateBpm: 150,
    sizeAnalogy: 'Plum / Lime (60 mm)',
    keyEvents: [
      'Midgut returns completely to the abdominal cavity with final 180° counterclockwise rotation',
      'Kidneys functional: Fetal urine excreted into amniotic fluid (amniotic fluid swallowed & cycled)',
      'External genitalia clearly differentiated into male (penis/scrotum) or female (clitoris/labia)',
      'Reflexes present: Fetus swallows, squints, moves limbs, and curls toes (Babinski reflex)',
      'Hematopoiesis transitions from yolk sac to the fetal Liver and Spleen'
    ],
    morphogens: ['Dihydrotestosterone (DHT via 5α-reductase specifies external male genitalia)', 'Wnt4 (female pathway)'],
    germLayerHighlights: {
      ectoderm: 'Sensory tactile skin receptors, epidermal stratum germinativum, hair follicles initiate',
      mesoderm: 'Bone marrow cavity formation, liver sinusoids, testicular Leydig cells producing testosterone',
      endoderm: 'Islets of Langerhans differentiate and begin insulin secretion'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Nuchal Translucency (NT) measurement window (11–13+6 weeks)', 'Fetal profile & nasal bone', 'Stomach bubble & bladder visible'],
      crlMm: 60,
      bpdMm: 21,
      dopplerNotes: 'Ductus venosus pulsatility index assessment for chromosomal and cardiac aneuploidies.'
    },
    hotspots: [
      {
        id: 'nuchal_translucency_hotspot',
        name: 'Nuchal Translucency Region',
        position: [0, 0.7, -0.6],
        germLayer: 'mesoderm',
        shortDesc: 'Subcutaneous fluid collection behind fetal neck measured on sagittal ultrasound.',
        fullDesc: 'Standard first-trimester screening biomarker. Normal thickness is < 2.5–3.0 mm.',
        clinicalSignificance: 'Increased NT (> 3.5 mm) is a major marker for Trisomy 21 (Down Syndrome), Turner Syndrome (45,X cystic hygroma), and Congenital Heart Defects.',
        fateAdultOrgans: ['Cervical subcutaneous tissue and lymphatic drainage pathways']
      },
      {
        id: 'genitalia_hotspot',
        name: 'External Genitalia (Differentiating)',
        position: [0, -0.7, 0.4],
        germLayer: 'mesoderm',
        shortDesc: 'Genital tubercle, urogenital folds, and labioscrotal swellings.',
        fullDesc: 'In males, DHT stimulates genital tubercle elongation into phallus and fusion of urogenital folds to form penile urethra. In females, folds remain open as labia minora.',
        clinicalSignificance: 'Hypospadias: Failure of urethral folds to fuse on ventral aspect of penis (associated with cryptorchidism). Epispadias: Abnormal positioning on dorsum due to faulty genital tubercle mesenchyme.',
        fateAdultOrgans: ['Penis / Clitoris, Scrotum / Labia majora, Spongy urethra / Labia minora']
      }
    ],
    modelType: 'fetus_week12'
  },
  {
    id: 'stage_w20_mid_gestation',
    week: 20,
    dayStart: 134,
    dayEnd: 140,
    title: 'Mid-Gestation & Quickening',
    subtitle: 'Anatomy Scan Milestone, Lanugo, Vernix & 4-Chamber Heart',
    trimester: 'Second Trimester',
    crlMm: 160.0,
    weightGrams: 300.0,
    heartRateBpm: 140,
    sizeAnalogy: 'Banana / Small melon (16 cm CRL, 25 cm crown-to-heel)',
    keyEvents: [
      'Maternal perception of fetal movements ("Quickening")',
      'Detailed Fetal Anatomy Ultrasound Survey (18–22 weeks): 4-chamber heart, brain ventricles, spine, kidneys, cord insertion',
      'Skin covered with Lanugo (fine downy hair) and Vernix Caseosa (protective lipid barrier)',
      'Brown adipose tissue (BAT) deposits around neck, kidneys, and scapula for non-shivering thermogenesis',
      'Myelination of spinal cord begins; cochlea fully formed enabling intrauterine hearing'
    ],
    morphogens: ['UCP1 (uncoupling protein in brown fat)', 'Thyroid hormone (T3/T4 for brain myelination)'],
    germLayerHighlights: {
      ectoderm: 'Myelinated peripheral nerves, fingerprints (dermatoglyphic ridges), eyelashes & eyebrows',
      mesoderm: 'Fully formed 4-chamber heart with foramen ovale flap valve and ductus arteriosus shunt',
      endoderm: 'Canalicular stage of lung development (primitive alveoli capillaries contact epithelium)'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Level II Comprehensive Anatomy Scan', '4-Chamber cardiac view & outflow tracts (LVOT/RVOT)', 'Cerebellar diameter, cisterna magna, lateral ventricle atrium (<10mm)'],
      crlMm: 160,
      bpdMm: 48,
      dopplerNotes: 'Middle Cerebral Artery (MCA) peak systolic velocity, Umbilical Artery resistance index.'
    },
    hotspots: [
      {
        id: 'fetal_heart_hotspot',
        name: '4-Chamber Fetal Heart & Shunts',
        position: [0, 0.1, 0.4],
        germLayer: 'mesoderm',
        shortDesc: 'Right-to-left shunts bypass non-ventilated fluid-filled fetal lungs.',
        fullDesc: 'Foramen ovale shunts oxygenated IVC blood directly from right atrium to left atrium. Ductus arteriosus shunts RV blood from pulmonary trunk to descending aorta.',
        clinicalSignificance: 'Patent Ductus Arteriosus (PDA) fails to close postnatally (treated with indomethacin/NSAIDs). Tetralogy of Fallot: PROV (Pulmonary stenosis, RV hypertrophy, Overriding aorta, VSD).',
        fateAdultOrgans: ['Fossa ovalis (remnant of foramen ovale), Ligamentum arteriosum']
      },
      {
        id: 'spine_neural_hotspot',
        name: 'Spinal Canal & Conus Medullaris',
        position: [0, -0.1, -0.6],
        germLayer: 'ectoderm',
        shortDesc: 'Intact dorsal vertebral arches enclosing the spinal cord.',
        fullDesc: 'At 20 weeks, the conus medullaris ends at L4/L5 level (ascends to L1/L2 by adulthood due to differential vertebral column growth).',
        clinicalSignificance: 'Lemon sign (frontal bone scalloping) and Banana sign (curved cerebellum in Arnold-Chiari II) on cranial ultrasound indicate open spina bifida.',
        fateAdultOrgans: ['Spinal cord, cauda equina, filum terminale']
      }
    ],
    modelType: 'fetus_week20'
  },
  {
    id: 'stage_w28_viability_maturation',
    week: 28,
    dayStart: 190,
    dayEnd: 196,
    title: 'Third Trimester & Viability',
    subtitle: 'Surfactant Synthesis, Brain Gyri Expansion & Eye Opening',
    trimester: 'Third Trimester',
    crlMm: 250.0,
    weightGrams: 1000.0,
    heartRateBpm: 135,
    sizeAnalogy: 'Large Eggplant / Butternut squash (25 cm CRL, ~38 cm total length)',
    keyEvents: [
      'Type II pneumocytes in lungs synthesize Pulmonary Surfactant (dipalmitoylphosphatidylcholine / DPPC)',
      'Substantial fetal viability (>90% survival in neonatal ICU)',
      'Eyes reopen; pupillary light reflex established',
      'Rapid cerebral sulcation and gyration (sulci and gyri replace smooth lissencephalic brain surface)',
      'Bone marrow becomes the predominant site of hematopoiesis (taking over from liver and spleen)',
      'Testes descend into inguinal canal (guided by gubernaculum in males)'
    ],
    morphogens: ['Cortisol / Glucocorticoids (accelerate surfactant synthesis and lung maturation)', 'Lecithin/Sphingomyelin ratio > 2.0'],
    germLayerHighlights: {
      ectoderm: 'Primary and secondary sulci in cerebral cortex, functional visual cortex processing',
      mesoderm: 'Subcutaneous adipose fat deposition smoothing wrinkled skin, descent of testes',
      endoderm: 'Saccular stage lungs: mature alveolar-capillary barrier capable of gas exchange'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Biparietal diameter ~70 mm', 'Femur Length ~53 mm', 'Abdominal Circumference ~240 mm', 'Breathing motion practiced in amniotic fluid'],
      bpdMm: 70,
      crlMm: 250,
      dopplerNotes: 'High diastolic flow in umbilical artery indicating low vascular resistance placenta.'
    },
    hotspots: [
      {
        id: 'lung_surfactant_hotspot',
        name: 'Type II Pneumocytes & Surfactant',
        position: [0.2, 0.2, 0.3],
        germLayer: 'endoderm',
        shortDesc: 'Lamellar bodies producing surfactant to reduce alveolar surface tension.',
        fullDesc: 'Surfactant prevents alveolar collapse on expiration (atelectasis). Synthesis surges dramatically between Weeks 28 and 34 stimulated by fetal cortisol.',
        clinicalSignificance: 'Neonatal Respiratory Distress Syndrome (NRDS / Hyaline Membrane Disease) in premature infants due to surfactant deficiency. Treated antenatally with maternal betamethasone.',
        molecularSignaling: 'Glucocorticoid receptor signaling, SP-A, SP-B, SP-C, SP-D proteins.',
        fateAdultOrgans: ['Mature pulmonary alveoli, air-blood barrier']
      },
      {
        id: 'cerebral_cortex_hotspot',
        name: 'Cerebral Sulcation & Gyri',
        position: [0, 0.8, 0],
        germLayer: 'ectoderm',
        shortDesc: 'Lateral sulcus, central sulcus, and calcarine fissure rapidly indenting cortex.',
        fullDesc: 'Neuronal migration along radial glia completes; extensive synaptogenesis, dendritic arborization, and synaptic pruning commence.',
        clinicalSignificance: 'Lissencephaly (smooth brain without gyri caused by LIS1 or DCX mutation, presenting with severe intractable epilepsy and developmental delay).',
        fateAdultOrgans: ['Neocortex, 6-layered cerebral gray matter, corpus callosum']
      }
    ],
    modelType: 'fetus_week28'
  },
  {
    id: 'stage_w38_full_term',
    week: 38,
    dayStart: 260,
    dayEnd: 266,
    title: 'Full Term Fetus (Week 38–40)',
    subtitle: 'Ready for Parturition, Neonatal Circulation & Extrauterine Life',
    trimester: 'Third Trimester',
    crlMm: 360.0,
    weightGrams: 3200.0,
    heartRateBpm: 130,
    sizeAnalogy: 'Full watermelon / Pumpkin (36 cm CRL, 50 cm total length, ~3.2–3.4 kg)',
    keyEvents: [
      'Vertex cephalic presentation engaged into maternal pelvis',
      'Lanugo shed; skin covered in protective vernix caseosa residue',
      'Immune transfer: Maternal IgG antibodies actively transported across syncytiotrophoblast via FcRn receptors for passive immunity',
      'Testes fully descended into scrotal sac in males; labia majora cover minora in females',
      'At first breath: Pulmonary vascular resistance plummets, left atrial pressure exceeds right, closing foramen ovale and triggering ductus arteriosus constriction'
    ],
    morphogens: ['Oxytocin & Prostaglandin F2α (uterine myometrial contractions)', 'Bradykinin & high arterial PO2 (constrict ductus arteriosus)'],
    germLayerHighlights: {
      ectoderm: 'Full epidermal stratum corneum, fully responsive auditory and visual neural pathways',
      mesoderm: 'Robust subcutaneous fat (16% body weight), adrenal fetal cortex producing DHEA-S for placental estrogen synthesis',
      endoderm: 'Mature gastrointestinal tract containing meconium (bile pigments, mucus, desquamated epithelial cells)'
    },
    ultrasoundFeatures: {
      visibleStructures: ['Biophysical Profile (BPP): Tone, Breathing, Gross Movement, Amniotic Fluid Index (AFI)', 'Grade III Placental calcifications', 'Estimated Fetal Weight 3.0–3.6 kg'],
      bpdMm: 94,
      crlMm: 360,
      dopplerNotes: 'Low resistance umbilical artery, pulsatile biophysical parameters.'
    },
    hotspots: [
      {
        id: 'neonatal_circ_hotspot',
        name: 'Transitional Neonatal Circulation',
        position: [0, 0.2, 0.4],
        germLayer: 'mesoderm',
        shortDesc: 'Immediate cardiovascular adaptations at first breath and cord clamping.',
        fullDesc: '1) Cord clamp eliminates low-resistance placental circuit -> systemic vascular resistance rises. 2) Lung expansion drops pulmonary vascular resistance -> massive pulmonary blood flow -> left atrial pressure rises -> foramen ovale valve shuts. 3) High PO2 constricts ductus arteriosus into ligamentum arteriosum within 48 hours.',
        clinicalSignificance: 'Persistent Pulmonary Hypertension of the Neonate (PPHN) if pulmonary resistance fails to fall. Prostaglandin E1 (alprostadil) keeps ductus open in ductal-dependent congenital heart lesions.',
        molecularSignaling: 'Endothelin-1, Bradykinin, Oxygen-sensing voltage-gated potassium channels.',
        fateAdultOrgans: ['Adult cardiovascular configuration with serial pulmonary and systemic circuits']
      },
      {
        id: 'placenta_maternal_hotspot',
        name: 'Placental Syncytiotrophoblast & Cord',
        position: [-0.5, -0.4, 0.6],
        germLayer: 'extraembryonic',
        shortDesc: 'Hemochorial barrier facilitating gas exchange, nutrient transfer, and IgG transport.',
        fullDesc: 'Maternal blood from spiral arteries bathes syncytiotrophoblast villi directly in the intervillous space without mixing fetal and maternal red blood cells.',
        clinicalSignificance: 'Placenta Previa (covering internal cervical os), Placental Abruption, Hemolytic Disease of the Fetus and Newborn (Rh incompatibility prevented with RhoGAM).',
        fateAdultOrgans: ['Delivered as afterbirth (secundines)']
      }
    ],
    modelType: 'term_week38'
  }
];
