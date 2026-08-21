import { QuizQuestion } from '../types';

export const EMBRYO_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1_neural_crest',
    vignette: 'A newborn presents with cyanosis and failure to pass meconium within 48 hours. Biopsy of the distal rectal wall reveals an absence of ganglion cells in the submucosal (Meissner) and myenteric (Auerbach) plexuses. Which embryological progenitor cell population failed to migrate properly to this tissue?',
    options: [
      'Paraxial mesoderm somites',
      'Neural crest cells',
      'Definitive endodermal epithelium',
      'Intermediate mesoderm',
      'Lateral plate somatic mesoderm'
    ],
    correctIndex: 1,
    explanation: 'Hirschsprung disease (congenital aganglionic megacolon) results from the arrest of craniocaudal migration of neural crest cells into the bowel wall (typically between weeks 5 and 12). Neural crest cells form the enteric nervous system ganglia.',
    embryologicalMilestone: 'Week 5–12 Neural Crest Migration',
    highYieldFact: 'Neural crest derivatives: Mnemonic "MOTEL PASS" (Melanocytes, Odontoblasts, Tracheal cartilage, Enteric ganglia/Schwann, Laryngeal cartilage, Parafollicular C cells, Adrenal medulla, Spiral septum of heart, Sclera/meninges).'
  },
  {
    id: 'q2_midgut_rotation',
    vignette: 'During a prenatal ultrasound at 7 weeks gestation, an echogenic mass is visualized protruding into the base of the umbilical cord. The sonographer notes this is a normal developmental milestone. At what gestational age does this herniated midgut loop normally complete its final counterclockwise rotation and return to the abdominal cavity?',
    options: [
      'Week 8',
      'Week 10',
      'Week 16',
      'Week 20',
      'Week 28'
    ],
    correctIndex: 1,
    explanation: 'Physiological umbilical herniation occurs around Week 6 due to massive expansion of the liver. The midgut loop undergoes a total of 270° counterclockwise rotation around the superior mesenteric artery (SMA) and returns completely to the peritoneal cavity by Week 10.',
    embryologicalMilestone: 'Week 6–10 Midgut Herniation & Reduction',
    highYieldFact: 'Failure of midgut loop reduction at Week 10 results in Omphalocele (herniation covered by peritoneal sac and amnion).'
  },
  {
    id: 'q3_cardiac_shunts',
    vignette: 'Immediately after birth and delivery of the placenta, an infant takes their first vigorous breath. Which physiological change triggers the immediate functional closure of the foramen ovale?',
    options: [
      'Increase in pulmonary vascular resistance',
      'Decrease in left atrial pressure relative to right atrial pressure',
      'Increase in left atrial pressure above right atrial pressure',
      'Constriction triggered by high prostaglandin E2 levels',
      'Direct closure of the ductus venosus by Wharton jelly'
    ],
    correctIndex: 2,
    explanation: 'At first breath, expansion of the lungs dramatically decreases pulmonary vascular resistance. This causes a huge surge of pulmonary venous return into the left atrium. The resulting increase in left atrial pressure pushes the valve-like septum primum against the septum secundum, functionally sealing the foramen ovale.',
    embryologicalMilestone: 'Parturition & Transitional Circulation',
    highYieldFact: 'In utero, the foramen ovale shunts oxygenated blood directly from IVC -> Right Atrium -> Left Atrium to bypass non-functioning lungs.'
  },
  {
    id: 'q4_potter_sequence',
    vignette: 'A pregnant patient taking an ACE inhibitor during the second trimester gives birth to a neonate with flattened facial features, compressed low-set ears, bilateral clubfoot, and severe respiratory failure. What is the fundamental embryological trigger of this sequence of findings?',
    options: [
      'Failure of cranial neuropore closure',
      'Bilateral renal dysfunction causing severe oligohydramnios',
      'Defect in the pleuroperitoneal membrane causing diaphragmatic hernia',
      'Premature fusion of the sagittal cranial suture',
      'Excessive amniotic fluid accumulation (polyhydramnios)'
    ],
    correctIndex: 1,
    explanation: 'ACE inhibitors cause fetal renal tubular dysgenesis. Lack of fetal urine production after 16 weeks causes severe oligohydramnios / anhydramnios. Without amniotic fluid cushioning, physical uterine compression produces the classic Potter sequence: Potter facies, limb contractures, and lethal pulmonary hypoplasia (due to lack of fluid aspiration into developing alveolar buds).',
    embryologicalMilestone: 'Week 16+ Renal Function & Amniotic Fluid Maintenance',
    highYieldFact: 'Fetal kidneys produce urine from Week 10–12 onward; by the 2nd trimester, fetal urine forms the major constituent of amniotic fluid.'
  },
  {
    id: 'q5_digeorge',
    vignette: 'A 2-day-old infant is found to have hypocalcemic seizures, an absent thymic shadow on chest radiograph, and a systolic murmur with cyanosis. Microarray reveals a 22q11.2 microdeletion. Which pharyngeal pouch structures failed to develop properly in this patient?',
    options: [
      '1st and 2nd pharyngeal pouches',
      '3rd and 4th pharyngeal pouches',
      '1st pharyngeal cleft only',
      '5th and 6th pharyngeal pouches',
      '2nd pharyngeal groove only'
    ],
    correctIndex: 1,
    explanation: 'DiGeorge syndrome results from defective development of the 3rd and 4th pharyngeal pouches and associated neural crest migration. The 3rd pouch gives rise to the inferior parathyroids and thymus; the 4th pouch gives rise to the superior parathyroids.',
    embryologicalMilestone: 'Week 4–6 Pharyngeal Pouch Differentiation',
    highYieldFact: '3rd Pouch = Inferior Parathyroid + Thymus. 4th Pouch = Superior Parathyroid + Ultimobranchial body (C-cells).'
  },
  {
    id: 'q6_surfactant',
    vignette: 'A preterm neonate born at 27 weeks gestation exhibits tachypnea, nasal flaring, intercostal retractions, and ground-glass opacities on chest X-ray. Which specialized alveolar cell type begins synthesizing significant pulmonary surfactant around week 24–28 to lower alveolar surface tension?',
    options: [
      'Type I pneumocytes',
      'Type II pneumocytes',
      'Clara / Club cells',
      'Alveolar macrophages (dust cells)',
      'Bronchial goblet cells'
    ],
    correctIndex: 1,
    explanation: 'Type II pneumocytes synthesize dipalmitoylphosphatidylcholine (DPPC / surfactant), which is stored in lamellar bodies and secreted to lower surface tension. Surfactant production begins around week 20–24 but reaches functional maturity after week 32–35.',
    embryologicalMilestone: 'Week 24–28 Saccular Stage & Surfactant Maturation',
    highYieldFact: 'Lecithin-to-Sphingomyelin (L/S) ratio > 2.0 in amniotic fluid indicates fetal lung maturity. Antenatal corticosteroids (betamethasone) stimulate surfactant synthesis.'
  }
];
