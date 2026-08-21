export interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  category: 
    | 'Germ Layers & Early Development'
    | 'Neuroectoderm & Craniofacial'
    | 'Cardiovascular & Hemodynamics'
    | 'Gastrointestinal & Body Wall'
    | 'Urogenital System'
    | 'Limb & Musculoskeletal'
    | 'Morphogens & Molecular Signals'
    | 'Teratology & Clinical Pathology';
  shortDefinition: string;
  fullExplanation: string;
  etymology?: string;
  germLayerOrigin?: 'Ectoderm' | 'Mesoderm' | 'Endoderm' | 'Neural Crest' | 'Extraembryonic' | 'Multiple';
  carnegieStagesRelevant?: string;
  clinicalRelevance: string;
  relatedTerms: string[];
}

export const EMBRYOLOGY_GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'acrosome_reaction',
    term: 'Acrosome Reaction',
    pronunciation: '/ˈæk.rə.soʊm riˈæk.ʃən/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'Exocytosis of hydrolytic enzymes from the sperm head enabling penetration through the zona pellucida.',
    fullExplanation: 'Triggered by binding to ZP3 glycoprotein in the zona pellucida, the sperm releases hyaluronidase and acrosin to digest a path to the oocyte plasma membrane.',
    etymology: 'Greek: akron (tip, summit) + soma (body)',
    germLayerOrigin: 'Extraembryonic',
    carnegieStagesRelevant: 'CS 1 (Day 1)',
    clinicalRelevance: 'Defective acrosome reactions cause male-factor subfertility, typically addressed with ICSI (Intracytoplasmic Sperm Injection).',
    relatedTerms: ['Zona Pellucida', 'Syngamy', 'Zygote', 'Polyspermy']
  },
  {
    id: 'allantois',
    term: 'Allantois',
    pronunciation: '/əˈlæn.toʊ.ɪs/',
    category: 'Urogenital System',
    shortDefinition: 'Endodermal outpocketing from the caudal wall of the yolk sac into the connecting stalk.',
    fullExplanation: 'In humans, the allantois induces umbilical blood vessel formation within the connecting stalk. Its intraembryonic portion forms the urachus, connecting the fetal bladder dome to the umbilicus.',
    etymology: 'Greek: allas (sausage) + eidos (form)',
    germLayerOrigin: 'Endoderm',
    carnegieStagesRelevant: 'CS 7–12 (Weeks 3–4)',
    clinicalRelevance: 'Failure of complete urachus obliteration leads to patent urachus (urine leaking from umbilicus), urachal cyst, or urachal sinus.',
    relatedTerms: ['Urachus', 'Connecting Stalk', 'Cloaca', 'Vitelline Duct']
  },
  {
    id: 'amnion',
    term: 'Amnion (Amniotic Cavity)',
    pronunciation: '/ˈæm.ni.ɒn/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'Thin, tough extraembryonic membrane enclosing the fluid-filled amniotic cavity surrounding the embryo.',
    fullExplanation: 'Forms during Week 2 as amnioblasts separate from the dorsal epiblast. It expands during embryonic folding and eventually fuses with the chorion to form the chorioamniotic membrane.',
    etymology: 'Greek: amnion (little lamb, caul)',
    germLayerOrigin: 'Extraembryonic',
    carnegieStagesRelevant: 'CS 5–23 (Weeks 2–8+)',
    clinicalRelevance: 'Amniotic band syndrome occurs when fibrous bands of the amnion rupture and entangle fetal limbs or digits, causing amputations or ring constrictions.',
    relatedTerms: ['Epiblast', 'Chorion', 'Yolk Sac', 'Oligohydramnios']
  },
  {
    id: 'apical_ectodermal_ridge',
    term: 'Apical Ectodermal Ridge (AER)',
    pronunciation: '/ˈæp.ɪ.kəl ˌɛk.təˈdɜːr.məl rɪdʒ/',
    category: 'Limb & Musculoskeletal',
    shortDefinition: 'Specialized stratified ectodermal ridge running along the distal margin of each limb bud driving proximal-distal elongation.',
    fullExplanation: 'The AER secretes FGF8 and FGF4 to maintain the underlying progress zone mesenchyme in an undifferentiated, rapidly proliferating state.',
    etymology: 'Latin: apex (summit, tip)',
    germLayerOrigin: 'Ectoderm',
    carnegieStagesRelevant: 'CS 12–19 (Weeks 4–7)',
    clinicalRelevance: 'Premature cessation or surgical disruption of the AER arrests limb development, producing transverse limb reduction deficiencies or amelia.',
    relatedTerms: ['Zone of Polarizing Activity (ZPA)', 'Limb Bud', 'Phocomelia', 'FGF8']
  },
  {
    id: 'aorticopulmonary_septum',
    term: 'Aorticopulmonary (Spiral) Septum',
    pronunciation: '/eɪˌɔːr.tɪ.koʊˈpʌl.məˌnɛr.i ˈsɛp.təm/',
    category: 'Cardiovascular & Hemodynamics',
    shortDefinition: 'Spiral mesenchymal partition formed by migrating neural crest cells that divides the truncus arteriosus into the ascending aorta and pulmonary trunk.',
    fullExplanation: 'Undergoes a 180-degree helical twist during Carnegie Stages 16–18, aligning the aortic outflow with the left ventricle and pulmonary outflow with the right ventricle.',
    etymology: 'Greek: aortē (aorta) + Latin: pulmo (lung) + saeptum (barrier)',
    germLayerOrigin: 'Neural Crest',
    carnegieStagesRelevant: 'CS 16–18 (Weeks 6–7)',
    clinicalRelevance: 'Failure to spiral results in Transposition of the Great Arteries (TGA); unequal division causes Tetralogy of Fallot; complete failure causes Persistent Truncus Arteriosus.',
    relatedTerms: ['Truncus Arteriosus', 'Neural Crest', 'Tetralogy of Fallot', 'Conotruncal Ridge']
  },
  {
    id: 'auricular_hillocks',
    term: 'Auricular Hillocks of His',
    pronunciation: '/ɔːˈrɪk.jʊ.lər ˈhɪl.əks/',
    category: 'Neuroectoderm & Craniofacial',
    shortDefinition: 'Six mesenchymal swellings surrounding the 1st pharyngeal cleft that coalesce to form the definitive external ear auricle (pinna).',
    fullExplanation: 'Hillocks 1–3 originate from the 1st pharyngeal arch (tragus, helix crus, ascending helix); hillocks 4–6 originate from the 2nd pharyngeal arch (antihelix, antitragus, lobule).',
    etymology: 'Latin: auricula (little ear) + Wilhelm His (embryologist)',
    germLayerOrigin: 'Neural Crest',
    carnegieStagesRelevant: 'CS 16–19 (Weeks 6–7)',
    clinicalRelevance: 'Dysplasia or failure of hillock fusion results in microtia, anotia, preauricular pits, or accessory preauricular tags.',
    relatedTerms: ['Pharyngeal Arches', 'First Arch Syndrome', 'Otic Placode', 'Microtia']
  },
  {
    id: 'blastocyst',
    term: 'Blastocyst',
    pronunciation: '/ˈblæs.tə.sɪst/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'Embryonic structure (Days 5–6) comprising an inner cell mass (embryoblast), blastocoel cavity, and outer trophoblast.',
    fullExplanation: 'Forms following cavitation of the morula. The trophoblast mediates implantation and placental development, while the pluripotent inner cell mass gives rise to the entire embryo proper.',
    etymology: 'Greek: blastos (germ, sprout) + kystis (bladder, sac)',
    germLayerOrigin: 'Extraembryonic',
    carnegieStagesRelevant: 'CS 3–4 (Days 4–6)',
    clinicalRelevance: 'Target structure for Preimplantation Genetic Testing (PGT) and IVF embryo grading before transfer.',
    relatedTerms: ['Morula', 'Trophoblast', 'Inner Cell Mass (ICM)', 'Zona Hatching']
  },
  {
    id: 'branchial_arches',
    term: 'Branchial (Pharyngeal) Arches',
    pronunciation: '/ˈbræŋ.ki.əl ˈɑːr.tʃɪz/',
    category: 'Neuroectoderm & Craniofacial',
    shortDefinition: 'Six paired lateral mesenchymal bars (arch 5 disappears) that form face, neck, larynx, cranial nerves, and aortic arches.',
    fullExplanation: 'Each arch contains an artery (aortic arch), cranial nerve (CN V, VII, IX, X), cartilage bar (e.g. Meckel cartilage), and muscular component.',
    etymology: 'Greek: branchia (gills) / pharynx (throat)',
    germLayerOrigin: 'Neural Crest',
    carnegieStagesRelevant: 'CS 10–15 (Weeks 4–5)',
    clinicalRelevance: 'First and second arch defects result in Treacher Collins syndrome and Goldenhar syndrome.',
    relatedTerms: ['Pharyngeal Pouches', 'Pharyngeal Clefts', 'Neural Crest', 'Meckel Cartilage']
  },
  {
    id: 'carnegie_stages',
    term: 'Carnegie Stages (CS 1–23)',
    pronunciation: '/kɑːrˈneɪ.ɡi ˈsteɪ.dʒɪz/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'Standardized international system of 23 morphological developmental stages spanning the 56 days of human embryonic organogenesis.',
    fullExplanation: 'Defined by structural morphology rather than chronological age or size alone, established by the Carnegie Institution of Washington (Streeter, O’Rahilly).',
    etymology: 'Named for the Carnegie Institution of Washington Department of Embryology',
    germLayerOrigin: 'Multiple',
    carnegieStagesRelevant: 'CS 1–23 (Days 1–56)',
    clinicalRelevance: 'Essential framework for clinical embryology, ultrasound dating, and identifying teratogen vulnerability windows.',
    relatedTerms: ['Crown-Rump Length (CRL)', 'Organogenesis', 'Gastrulation', 'Neurulation']
  },
  {
    id: 'cloaca',
    term: 'Cloaca & Urorectal Septum',
    pronunciation: '/kloʊˈeɪ.kə/',
    category: 'Gastrointestinal & Body Wall',
    shortDefinition: 'Terminal dilation of the embryonic hindgut receiving the allantois, partitioned into urogenital sinus and anorectal canal.',
    fullExplanation: 'Divided between CS 16 and CS 20 by the downward-growing urorectal septum (Tourneux and Rathke folds), terminating at the perineal body.',
    etymology: 'Latin: cloaca (sewer, drain)',
    germLayerOrigin: 'Endoderm',
    carnegieStagesRelevant: 'CS 13–20 (Weeks 4–8)',
    clinicalRelevance: 'Failure of complete partitioning leads to imperforate anus, rectovesical fistula, rectovaginal fistula, or persistent cloaca.',
    relatedTerms: ['Urorectal Septum', 'Hindgut', 'Proctodeum', 'Allantois']
  },
  {
    id: 'crown_rump_length',
    term: 'Crown-Rump Length (CRL)',
    pronunciation: '/kraʊn rʌmp lɛŋkθ/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'Measurement of the embryo or fetus from the top of the head (crown) to the bottom of the buttocks (rump).',
    fullExplanation: 'The gold-standard biometric parameter for determining gestational age via first-trimester ultrasound, accurate to within ±3–5 days.',
    etymology: 'Anatomical landmark terminology',
    germLayerOrigin: 'Multiple',
    carnegieStagesRelevant: 'CS 8–23+ (Weeks 3.5–13+)',
    clinicalRelevance: 'Essential for ultrasound dating, nuchal translucency risk screening, and detecting early embryonic growth restriction.',
    relatedTerms: ['Carnegie Stages', 'Biparietal Diameter (BPD)', 'Gestational Sac']
  },
  {
    id: 'ductus_arteriosus',
    term: 'Ductus Arteriosus',
    pronunciation: '/ˈdʌk.təs ˌɑːrˌtɪər.iˈoʊ.səs/',
    category: 'Cardiovascular & Hemodynamics',
    shortDefinition: 'Fetal vascular shunt connecting the pulmonary artery trunk directly to the descending aortic arch.',
    fullExplanation: 'Derived from the left 6th aortic arch, it diverts ~90% of right ventricular cardiac output away from high-resistance, unexpanded fetal lungs into the systemic circulation.',
    etymology: 'Latin: ductus (channel) + arteriosus (arterial)',
    germLayerOrigin: 'Mesoderm',
    carnegieStagesRelevant: 'CS 15–23 to Neonatal',
    clinicalRelevance: 'Kept patent in utero by low PO2 and placenta-derived PGE2. Patent Ductus Arteriosus (PDA) is treated with NSAIDs (indomethacin) to inhibit prostaglandin synthesis.',
    relatedTerms: ['Foramen Ovale', 'Ductus Venosus', 'Aortic Arches', 'Prostaglandin E2']
  },
  {
    id: 'ductus_venosus',
    term: 'Ductus Venosus',
    pronunciation: '/ˈdʌk.təs vɪˈnoʊ.səs/',
    category: 'Cardiovascular & Hemodynamics',
    shortDefinition: 'Fetal vascular shunt directing oxygen-rich umbilical venous blood directly into the inferior vena cava, bypassing the hepatic sinusoids.',
    fullExplanation: 'Carries ~50% of oxygenated blood from the umbilical vein straight to the IVC, where it is preferentially streamlined across the foramen ovale into the left atrium.',
    etymology: 'Latin: ductus (channel) + venosus (venous)',
    germLayerOrigin: 'Mesoderm',
    carnegieStagesRelevant: 'CS 13–23 to Neonatal',
    clinicalRelevance: 'Postnatal closure creates the ligamentum venosum. Doppler waveform evaluation of ductus venosus pulsatility is a primary indicator of fetal cardiac strain and acidemia.',
    relatedTerms: ['Umbilical Vein', 'Foramen Ovale', 'Inferior Vena Cava', 'Ductus Arteriosus']
  },
  {
    id: 'ectoderm',
    term: 'Ectoderm (Surface & Neuroectoderm)',
    pronunciation: '/ˈɛk.təˌdɜːrm/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'The outermost of the three primary embryonic germ layers established during gastrulation.',
    fullExplanation: 'Subdivides into Surface Ectoderm (epidermis, hair, nails, lens, corneal epithelium, anterior pituitary) and Neuroectoderm (neural tube: CNS, retina, posterior pituitary; and neural crest: PNS, melanocytes, craniofacial bones).',
    etymology: 'Greek: ektos (outside) + derma (skin)',
    germLayerOrigin: 'Ectoderm',
    carnegieStagesRelevant: 'CS 7–23 (Weeks 3–8)',
    clinicalRelevance: 'Ectodermal dysplasias represent genetic disorders characterized by abnormal teeth, skin, hair, and sweat glands.',
    relatedTerms: ['Neural Tube', 'Neural Crest', 'Mesoderm', 'Endoderm', 'Gastrulation']
  },
  {
    id: 'endoderm',
    term: 'Endoderm',
    pronunciation: '/ˈɛn.dəˌdɜːrm/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'The innermost primary germ layer lining the embryonic yolk sac, giving rise to epithelial linings of GI and respiratory tracts.',
    fullExplanation: 'Formed when ingressing epiblast cells displace the hypoblast during gastrulation. Differentiates into the epithelial lining of the esophagus, stomach, intestines, trachea, bronchi, alveoli, liver, and pancreas.',
    etymology: 'Greek: endon (within) + derma (skin)',
    germLayerOrigin: 'Endoderm',
    carnegieStagesRelevant: 'CS 7–23 (Weeks 3–8)',
    clinicalRelevance: 'Defects in endodermal foregut recanalization result in esophageal atresia, tracheoesophageal fistula (TEF), or duodenal atresia.',
    relatedTerms: ['Foregut', 'Midgut', 'Hindgut', 'Epithelial Recanalization']
  },
  {
    id: 'foramen_ovale',
    term: 'Foramen Ovale & Septum Primum',
    pronunciation: '/fəˈreɪ.mɛn oʊˈvæ.li/',
    category: 'Cardiovascular & Hemodynamics',
    shortDefinition: 'Interatrial physiological flap-valve in the fetal heart shunting oxygenated blood from right atrium to left atrium.',
    fullExplanation: 'Formed between the free edge of the septum secundum and the ostium secundum defect of the septum primum. High right atrial pressure keeps the flap valve open in utero.',
    etymology: 'Latin: foramen (opening) + ovale (oval)',
    germLayerOrigin: 'Mesoderm',
    carnegieStagesRelevant: 'CS 14–23 to Neonatal',
    clinicalRelevance: 'At birth, left atrial pressure rises with lung expansion, pressing septum primum against septum secundum. Patent Foramen Ovale (PFO) occurs in ~25% of adults, predisposing to paradoxical emboli.',
    relatedTerms: ['Septum Primum', 'Septum Secundum', 'Atrial Septal Defect (ASD)', 'Ductus Arteriosus']
  },
  {
    id: 'gastrulation',
    term: 'Gastrulation',
    pronunciation: '/ˌɡæs.trʊˈleɪ.ʃən/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'The fundamental morphogenetic process converting the bilaminar embryonic disc into a trilaminar disc with three definitive germ layers.',
    fullExplanation: 'Initiates in Week 3 (Carnegie Stage 7) with the formation of the primitive streak. Epiblast cells undergo Epithelial-to-Mesenchymal Transition (EMT) and ingress to form endoderm and intraembryonic mesoderm.',
    etymology: 'Greek: gaster (stomach, belly)',
    germLayerOrigin: 'Multiple',
    carnegieStagesRelevant: 'CS 7–9 (Week 3)',
    clinicalRelevance: 'Failure of primitive streak regression causes sacrococcygeal teratoma (most common congenital germ cell tumor in neonates).',
    relatedTerms: ['Primitive Streak', 'Epithelial-to-Mesenchymal Transition (EMT)', 'Notochord', 'Trilaminar Disc']
  },
  {
    id: 'meckel_diverticulum',
    term: 'Meckel’s Diverticulum',
    pronunciation: '/ˈmɛk.əlz ˌdaɪ.vərˈtɪk.jʊ.ləm/',
    category: 'Gastrointestinal & Body Wall',
    shortDefinition: 'Persistent remnant of the vitelline (omphalomesenteric) duct forming a true diverticulum on the antimesenteric border of the ileum.',
    fullExplanation: 'Results from failure of the embryonic vitelline duct to fully obliterate during Week 7. Follows the "Rule of 2s": 2% of population, 2 inches long, 2 feet from ileocecal valve, 2 types of heterotopic mucosa (gastric & pancreatic).',
    etymology: 'Johann Friedrich Meckel (German anatomist)',
    germLayerOrigin: 'Endoderm',
    carnegieStagesRelevant: 'CS 15–20 (Weeks 6–8)',
    clinicalRelevance: 'Heterotopic gastric mucosa secretes acid, producing ulceration, painless lower GI bleeding, or intussusception in children.',
    relatedTerms: ['Vitelline Duct', 'Midgut Herniation', 'Omphalocele', 'Ileum']
  },
  {
    id: 'neural_crest',
    term: 'Neural Crest ("The 4th Germ Layer")',
    pronunciation: '/ˈnjʊər.əl krɛst/',
    category: 'Neuroectoderm & Craniofacial',
    shortDefinition: 'Transient, migratory population of pluripotent cells arising at the borders of the neural plate during neurulation.',
    fullExplanation: 'Undergoes EMT and migrates along specific pathways to form dorsal root ganglia, sympathetic chain, Schwann cells, adrenal medulla chromaffin cells, melanocytes, craniofacial bones, and the cardiac conotruncal septum.',
    etymology: 'Latin: crista (crest, ridge)',
    germLayerOrigin: 'Neural Crest',
    carnegieStagesRelevant: 'CS 9–14 (Weeks 3–5)',
    clinicalRelevance: 'Neurocristopathies include Hirschsprung disease (absence of enteric ganglia), DiGeorge syndrome (22q11 deletion), and neuroblastoma.',
    relatedTerms: ['Neurulation', 'Aorticopulmonary Septum', 'Enteric Ganglia', 'DiGeorge Syndrome']
  },
  {
    id: 'notochord',
    term: 'Notochord',
    pronunciation: '/ˈnoʊ.təˌkɔːrd/',
    category: 'Neuroectoderm & Craniofacial',
    shortDefinition: 'Flexible, rod-shaped axial signaling center forming the primary longitudinal axis of the early embryo.',
    fullExplanation: 'Extends cranially from Hensen’s primitive node between ectoderm and endoderm. It secretes Sonic Hedgehog (SHH) to induce overlying ectoderm into the neural plate and pattern the ventral neural tube (floor plate and motor neurons).',
    etymology: 'Greek: noton (back) + chorde (cord, string)',
    germLayerOrigin: 'Mesoderm',
    carnegieStagesRelevant: 'CS 7–12 (Weeks 3–4)',
    clinicalRelevance: 'Persists in adult anatomy as the nucleus pulposus within intervertebral discs; remnants can transform into rare chordoma tumors.',
    relatedTerms: ['Sonic Hedgehog (SHH)', 'Neural Tube', 'Somites', 'Nucleus Pulposus']
  },
  {
    id: 'omphalocele',
    term: 'Omphalocele vs. Gastroschisis',
    pronunciation: '/ɒmˈfæ.loʊˌsiːl/',
    category: 'Gastrointestinal & Body Wall',
    shortDefinition: 'Congenital herniation of abdominal viscera through an enlarged umbilical ring, covered by a peritoneal/amniotic membrane sac.',
    fullExplanation: 'Caused by failure of the physiological midgut herniation to return to the abdominal cavity during Carnegie Stage 23 / Week 10. Distinct from gastroschisis, which occurs lateral to the umbilicus (usually right) without a covering sac.',
    etymology: 'Greek: omphalos (navel) + kele (hernia, swelling)',
    germLayerOrigin: 'Mesoderm',
    carnegieStagesRelevant: 'CS 17–23 (Weeks 6–10)',
    clinicalRelevance: 'High association with chromosomal aneuploidies (Trisomy 13, 18) and Beckwith-Wiedemann syndrome; requires prenatal ultrasound screening and staged surgical reduction.',
    relatedTerms: ['Physiological Midgut Herniation', 'Gastroschisis', 'Vitelline Duct', 'Umbilical Cord']
  },
  {
    id: 'physiological_midgut_herniation',
    term: 'Physiological Midgut Herniation',
    pronunciation: '/ˌfɪz.i.əˈlɒdʒ.ɪ.kəl ˈmɪd.ɡʌt ˌhɜːr.niˈeɪ.ʃən/',
    category: 'Gastrointestinal & Body Wall',
    shortDefinition: 'Normal developmental extrusion of rapidly elongating intestinal loops into the proximal umbilical cord.',
    fullExplanation: 'Commences in Week 6 (CS 17) due to rapid gut elongation and space limitation in the embryonic abdomen (dominated by the massive embryonic liver). The gut undergoes an initial 90° counterclockwise rotation around the superior mesenteric artery (SMA), followed by another 180° rotation upon return in Week 10.',
    etymology: 'Latin: hernia (rupture, protrusion)',
    germLayerOrigin: 'Endoderm',
    carnegieStagesRelevant: 'CS 17–23 (Weeks 6–10)',
    clinicalRelevance: 'Physiological finding on first-trimester ultrasound (Weeks 8–10); malrotation or failure of retraction leads to midgut volvulus or omphalocele.',
    relatedTerms: ['Superior Mesenteric Artery (SMA)', 'Omphalocele', 'Meckel Diverticulum', 'Intestinal Malrotation']
  },
  {
    id: 'primitive_streak',
    term: 'Primitive Streak & Node (Hensen’s Node)',
    pronunciation: '/ˈprɪm.ɪ.tɪv striːk/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'Transient linear opacity forming along the caudal dorsal midline of the epiblast that initiates gastrulation.',
    fullExplanation: 'Defines cranial-caudal and left-right body axes. The cranial expansion (Hensen’s node) acts as the master embryonic organizer, expressing Nodal, Lefty, and Chordin to pattern germ layers.',
    etymology: 'Latin: primitivus (first of its kind)',
    germLayerOrigin: 'Ectoderm',
    carnegieStagesRelevant: 'CS 6–9 (Weeks 2–3)',
    clinicalRelevance: 'Ciliary beating at the node directs leftward fluid flow; dynein arm mutations cause Kartagener syndrome / Situs Inversus.',
    relatedTerms: ['Gastrulation', 'Notochord', 'Situs Inversus', 'Sacrococcygeal Teratoma']
  },
  {
    id: 'sonic_hedgehog',
    term: 'Sonic Hedgehog (SHH)',
    pronunciation: '/ˈsɒn.ɪk ˈhɛdʒˌhɒɡ/',
    category: 'Morphogens & Molecular Signals',
    shortDefinition: 'Master morphogen glycoprotein secreted by the notochord, floor plate, and Zone of Polarizing Activity (ZPA).',
    fullExplanation: 'Establishes dorsal-ventral polarity in the neural tube, induces ventral motor neurons, patterns the anterior-posterior digit axis in limb buds (thumb vs. pinky), and regulates facial midline cleaving.',
    etymology: 'Named after the Sega video game character by Cliff Tabin and colleagues (1993)',
    germLayerOrigin: 'Multiple',
    carnegieStagesRelevant: 'CS 8–20 (Weeks 3–8)',
    clinicalRelevance: 'Loss-of-function mutations in SHH cause Holoprosencephaly (failure of forebrain and facial midline division, cyclopia); ectopic ZPA expression causes polydactyly.',
    relatedTerms: ['Notochord', 'Zone of Polarizing Activity (ZPA)', 'Holoprosencephaly', 'Polydactyly']
  },
  {
    id: 'somites',
    term: 'Somites (Paraxial Mesoderm)',
    pronunciation: '/ˈsoʊ.maɪts/',
    category: 'Limb & Musculoskeletal',
    shortDefinition: 'Paired segmental blocks of paraxial mesoderm flanking the neural tube that give rise to the axial skeleton and musculature.',
    fullExplanation: 'Bud sequentially from cranial to caudal governed by the Notch-Delta segmentation clock. Each somite differentiates into: Sclerotome (vertebrae and ribs), Dermatome (dermis of the back), and Myotome (skeletal muscles).',
    etymology: 'Greek: soma (body)',
    germLayerOrigin: 'Mesoderm',
    carnegieStagesRelevant: 'CS 9–14 (Weeks 3–5)',
    clinicalRelevance: 'Congenital vertebral defects (hemivertebrae, Klippel-Feil syndrome, scoliosis) arise from abnormal somitogenesis.',
    relatedTerms: ['Paraxial Mesoderm', 'Sclerotome', 'Myotome', 'Neural Tube']
  },
  {
    id: 'teratogen',
    term: 'Teratogen & Critical Susceptibility Period',
    pronunciation: '/təˈræt.ə.dʒən/',
    category: 'Teratology & Clinical Pathology',
    shortDefinition: 'Any environmental agent (chemical, drug, infection, radiation) capable of inducing permanent congenital structural or functional malformations.',
    fullExplanation: 'Susceptibility is highest during the embryonic period of organogenesis (Weeks 3–8 / CS 7–23), where exposure causes major anatomical defects. Weeks 1–2 represent an "all-or-none" period, while Weeks 9–38 primarily affect functional maturation and growth.',
    etymology: 'Greek: teras (monster, marvel) + genes (producing)',
    germLayerOrigin: 'Multiple',
    carnegieStagesRelevant: 'CS 7–23 (Weeks 3–8)',
    clinicalRelevance: 'Classic teratogens include Thalidomide (phocomelia), Isotretinoin (craniofacial/cardiac), Alcohol (Fetal Alcohol Syndrome), ACE inhibitors (renal dysgenesis), and Rubella (TORCH).',
    relatedTerms: ['Thalidomide', 'Fetal Alcohol Syndrome', 'Organogenesis', 'TORCH Infections']
  },
  {
    id: 'ureteric_bud',
    term: 'Ureteric Bud & Metanephric Blastema',
    pronunciation: '/jʊəˈriː.tər.ɪk bʌd/',
    category: 'Urogenital System',
    shortDefinition: 'Epithelial outgrowth from the caudal mesonephric duct that invades the metanephric blastema to induce permanent kidney formation.',
    fullExplanation: 'The ureteric bud undergoes reciprocal inductive signaling (GDNF/c-Ret and Wnt4) to branch into the collecting system (ureter, renal pelvis, calyces, collecting ducts), while inducing metanephric blastema into functional nephrons.',
    etymology: 'Greek: oureter (urinary canal) + Old English: budda',
    germLayerOrigin: 'Mesoderm',
    carnegieStagesRelevant: 'CS 14–23 (Weeks 5–8)',
    clinicalRelevance: 'Failure of ureteric bud induction causes Bilateral Renal Agenesis (Potter Sequence: oligohydramnios, pulmonary hypoplasia, compressed facies); early branching causes duplicated collecting systems.',
    relatedTerms: ['Metanephros', 'Mesonephros', 'Potter Sequence', 'GDNF Signaling']
  },
  {
    id: 'zona_pellucida',
    term: 'Zona Pellucida',
    pronunciation: '/ˈzoʊ.nə pəˈluː.sɪ.də/',
    category: 'Germ Layers & Early Development',
    shortDefinition: 'Extracellular glycoprotein matrix surrounding the mammalian oocyte and preimplantation blastocyst.',
    fullExplanation: 'Composed of ZP1, ZP2, ZP3, and ZP4 glycoproteins. It binds sperm to trigger the acrosome reaction, undergoes cortical granule cross-linking to prevent polyspermy, and prevents premature tubal adhesion until enzymatic hatching in the uterus (Day 5).',
    etymology: 'Latin: zona (belt, zone) + pellucida (transparent, clear)',
    germLayerOrigin: 'Extraembryonic',
    carnegieStagesRelevant: 'CS 1–4 (Days 1–5)',
    clinicalRelevance: 'Premature loss of the zona pellucida in the fallopian tube leads to tubal ectopic pregnancy; failed zona hatching prevents uterine implantation.',
    relatedTerms: ['Acrosome Reaction', 'Blastocyst', 'Polyspermy', 'Ectopic Pregnancy']
  }
];
