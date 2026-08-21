import { ClinicalCondition } from '../types';

export const CLINICAL_CONDITIONS: ClinicalCondition[] = [
  {
    id: 'tetralogy_of_fallot',
    name: 'Tetralogy of Fallot (TOF)',
    category: 'Cardiovascular',
    criticalPeriodWeeks: 'Weeks 5–7',
    incidence: '1 in 2,500 live births (most common cyanotic heart defect)',
    embryologicalBasis: 'Anterosuperior displacement of the infundibular (conal) septum due to abnormal migration of cardiac neural crest cells into the outflow tract.',
    clinicalPresentation: 'Cyanosis ("tet spells"), clubbing, squatting behavior to increase Systemic Vascular Resistance (SVR) and reverse right-to-left shunt. Boot-shaped heart on chest radiography.',
    ultrasoundOrDiagnosticFindings: [
      'Overriding aorta straddling the ventricular septum',
      'Large Malalignment Ventricular Septal Defect (VSD)',
      'Right Ventricular Outflow Tract Obstruction (Infundibular pulmonary stenosis)',
      'Secondary Right Ventricular Hypertrophy (RVH)'
    ],
    molecularMechanism: 'Abnormal cardiac neural crest migration; linked to TBX1 haploinsufficiency, Jagged1/Notch mutations, and 22q11.2 microdeletion.',
    associatedGenesOrTeratogens: ['22q11.2 microdeletion (DiGeorge / Velocardiofacial syndrome)', 'Maternal Diabetes', 'Fetal Alcohol Syndrome']
  },
  {
    id: 'neural_tube_defects',
    name: 'Neural Tube Defects (Spina Bifida & Anencephaly)',
    category: 'Neural & Craniofacial',
    criticalPeriodWeeks: 'Weeks 3–4 (Days 25–28)',
    incidence: '1 in 1,000 live births worldwide',
    embryologicalBasis: 'Failure of the primary neural tube neuropores to close. Cranial failure (Day 25) yields Anencephaly/Exencephaly. Caudal failure (Day 28) yields Spina Bifida (occulta, meningocele, or myelomeningocele).',
    clinicalPresentation: 'Anencephaly: Absent calvarium and cerebral hemispheres (incompatible with life). Myelomeningocele: Lower extremity motor/sensory paralysis, neurogenic bladder, Arnold-Chiari II malformation with hydrocephalus.',
    ultrasoundOrDiagnosticFindings: [
      'Elevated Maternal Serum Alpha-Fetoprotein (MSAFP) and amniotic Acetylcholinesterase (AChE)',
      'Cranial "Lemon Sign" (scalloping of frontal bones)',
      'Cranial "Banana Sign" (caudal herniation of cerebellar tonsils in Chiari II)',
      'Splaying of dorsal ossification centers of fetal spine'
    ],
    molecularMechanism: 'Disruption in folate one-carbon metabolism, homocysteine transmethylation, and Planar Cell Polarity (PCP) genes (VANGL1, CELSR1). 70% preventable with 400 mcg daily preconception folic acid (4 mg for high risk).',
    associatedGenesOrTeratogens: ['MTHFR polymorphisms', 'Valproic acid / Carbamazepine (anti-epileptics)', 'Maternal pregestational diabetes', 'Maternal hyperthermia']
  },
  {
    id: 'digeorge_syndrome',
    name: 'DiGeorge Syndrome (22q11.2 Deletion)',
    category: 'Neural & Craniofacial',
    criticalPeriodWeeks: 'Weeks 4–6',
    incidence: '1 in 4,000 live births',
    embryologicalBasis: 'Aberrant development and migration of cranial neural crest cells into the 3rd and 4th pharyngeal pouches and aortic arches.',
    clinicalPresentation: 'Mnemonic CATCH-22: Cardiac anomalies (Truncus arteriosus, Interrupted aortic arch B, TOF), Abnormal facies (low-set ears, micrognathia), Thymic aplasia (T-cell immunodeficiency), Cleft palate / velopharyngeal insufficiency, Hypocalcemia / tetany from parathyroid aplasia.',
    ultrasoundOrDiagnosticFindings: [
      'Absent fetal thymic shadow in 3-vessel tracheal view',
      'Persistent Truncus Arteriosus or TOF',
      'Polyhydramnios secondary to swallowing difficulties from cleft palate',
      'Confirmed by FISH or chromosomal microarray for 22q11.2 deletion'
    ],
    molecularMechanism: 'TBX1 transcription factor haploinsufficiency governing branchial arch tissue interactions and cardiac neural crest survival.',
    associatedGenesOrTeratogens: ['TBX1 gene', 'CRKL gene', 'Maternal Retinoid/Isotretinoin exposure']
  },
  {
    id: 'omphalocele_vs_gastroschisis',
    name: 'Abdominal Wall Defects: Omphalocele vs. Gastroschisis',
    category: 'Gastrointestinal',
    criticalPeriodWeeks: 'Weeks 6–10 (Omphalocele) / Weeks 4–5 (Gastroschisis)',
    incidence: 'Omphalocele: 1 in 4,000; Gastroschisis: 1 in 2,500',
    embryologicalBasis: 'Omphalocele: Failure of midgut loop to return to abdominal cavity at week 10. Gastroschisis: Full-thickness failure of lateral body wall fold fusion, typically to the right of umbilicus due to right vitelline artery involution.',
    clinicalPresentation: 'Omphalocele: Central herniation enclosed in protective sac (peritoneum + amnion) with cord inserting onto apex. Gastroschisis: Exposed, edematous, uncovered loops of bowel floating free in amniotic fluid, normal cord insertion.',
    ultrasoundOrDiagnosticFindings: [
      'Omphalocele: Membrane-covered mass containing liver and small bowel at base of cord; high association with Beckwith-Wiedemann and Trisomy 18/13',
      'Gastroschisis: Free loops with cauliflower appearance right of cord insertion, markedly elevated MSAFP, oligohydramnios/IUGR risk'
    ],
    molecularMechanism: 'Failure of lateral ectodermal-mesodermal body wall folding (Gastroschisis) vs. failure of physiological reduction and abdominal rectus midline fusion (Omphalocele).',
    associatedGenesOrTeratogens: ['CDKN1C / IGF2 (Beckwith-Wiedemann)', 'Maternal young age & smoking (Gastroschisis)', 'Trisomy 18 (Edwards syndrome)']
  },
  {
    id: 'potter_sequence',
    name: 'Potter Sequence & Renal Agenesis',
    category: 'Urogenital',
    criticalPeriodWeeks: 'Weeks 5–8',
    incidence: '1 in 4,000 to 1 in 8,000 births',
    embryologicalBasis: 'Failure of ureteric bud to sprout from mesonephric duct or failure to induce metanephric blastema, leading to bilateral renal agenesis.',
    clinicalPresentation: 'Severe Oligohydramnios / Anhydramnios -> lack of amniotic cushioning leads to physical compression: Potter facies (flattened nose, recessed chin, low-set ears), limb contractures/clubfoot, and fatal Pulmonary Hypoplasia (fetus cannot breathe amniotic fluid to expand alveoli).',
    ultrasoundOrDiagnosticFindings: [
      'Complete absence of bilateral renal parenchyma and renal arteries on Doppler',
      'Absent bladder filling on serial ultrasound examinations',
      'Anhydramnios after 16 weeks gestation (when kidneys become primary source of amniotic fluid)',
      'Adrenal glands appear flattened ("lying-down adrenal sign")'
    ],
    molecularMechanism: 'Mutations in GDNF / c-RET, WT1, PAX2, or Lim1 signaling pathways disrupting ureteric bud branching morphogenesis.',
    associatedGenesOrTeratogens: ['ACE inhibitors / ARBs during pregnancy (cause severe fetal renal tubular dysgenesis and oligohydramnios)', 'GDNF / RET axis']
  },
  {
    id: 'teratology_critical_windows',
    name: 'Teratology & Critical Susceptibility Windows',
    category: 'Teratology',
    criticalPeriodWeeks: 'Weeks 3–8 (Embryonic Period - Peak Vulnerability)',
    incidence: '4–6% of all major congenital structural defects',
    embryologicalBasis: 'Weeks 1–2 (Pre-embryonic): "All-or-none" period (lethal death or complete recovery). Weeks 3–8 (Embryonic): Maximal vulnerability during peak organogenesis; specific organ systems have precise susceptibility windows. Weeks 9–38 (Fetal): Functional defects, growth restriction, and CNS maturation deficits.',
    clinicalPresentation: 'Thalidomide: Weeks 4–6 causes Phocomelia/Amelia. Isotretinoin (Accutane): Craniofacial, thymic, and conotruncal cardiac defects. Alcohol (FAS): Microcephaly, smooth philtrum, thin upper vermilion border, intellectual disability. Lithium: Ebstein anomaly.',
    ultrasoundOrDiagnosticFindings: [
      'Growth restriction (IUGR)',
      'Organ-specific dysmorphology (limb reduction, microcephaly, intracranial calcifications in CMV/Toxoplasmosis)',
      'Amniotic band sequence constrictions'
    ],
    molecularMechanism: 'Receptor disruption, oxidative stress, disruption of HOX/SHH/RA signaling gradients, apoptotic cell death in neural crest and progenitor stem cells.',
    associatedGenesOrTeratogens: ['Thalidomide (CRBN cereblon binding)', 'Isotretinoin / Vitamin A excess (Retinoic acid receptors)', 'Alcohol / Ethanol', 'TORCH infections (Toxoplasma, Rubella, CMV, HSV, Zika)']
  }
];
