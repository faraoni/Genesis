import { GermLayerNode } from '../types';

export const GERM_LAYER_NODES: GermLayerNode[] = [
  {
    id: 'surface_ectoderm',
    name: 'Surface Ectoderm',
    layer: 'ectoderm',
    color: '#38bdf8', // Light Blue / Sky
    description: 'External non-neural epithelial lining induced by BMP signaling in the outer embryo surface.',
    derivatives: [
      {
        system: 'Integumentary & Appendages',
        structures: ['Epidermis of skin', 'Hair follicles & nails', 'Sebaceous & sweat glands', 'Mammary glands (modified sweat glands)']
      },
      {
        system: 'Sensory Organs & Cranial',
        structures: ['Lens of eye & anterior corneal epithelium', 'Internal ear (otic vesicle / membranous labyrinth)', 'Enamel of teeth', 'Anterior pituitary gland (adenohypophysis via Rathke pouch)']
      },
      {
        system: 'Epithelial Openings',
        structures: ['Parotid salivary glands', 'Epithelium of lower 1/3 of anal canal (below pectinate line)', 'Distal penile urethra']
      }
    ],
    keyGenes: ['BMP4', 'p63', 'WNT10A', 'EDAR (Ectodysplasin)'],
    clinicalDefects: [
      'Hypohidrotic Ectodermal Dysplasia (sparse hair, missing teeth, no sweat glands)',
      'Craniopharyngioma (benign tumor from Rathke pouch remnants producing bitemporal hemianopsia)',
      'Congenital cataracts (lens placode rubella teratogenesis)'
    ]
  },
  {
    id: 'neural_tube',
    name: 'Neuroectoderm (Neural Tube)',
    layer: 'ectoderm',
    color: '#60a5fa', // Blue
    description: 'Invaginated neuroepithelial cylinder induced by notochordal SHH and chordin/noggin signals.',
    derivatives: [
      {
        system: 'Central Nervous System',
        structures: ['Brain (Cerebrum, Thalamus, Hypothalamus, Midbrain, Pons, Cerebellum, Medulla)', 'Spinal cord (motor neurons, interneurons)', 'Optic cup (Retina, optic nerve, retinal pigment)']
      },
      {
        system: 'Endocrine & Posterior Structures',
        structures: ['Posterior pituitary gland (neurohypophysis)', 'Pineal gland', 'Ependymal lining of ventricles & choroid plexus epithelium']
      }
    ],
    keyGenes: ['PAX6', 'SOX2', 'SHH', 'Noggin / Chordin'],
    clinicalDefects: [
      'Anencephaly (cranial neuropore failure, high maternal AFP)',
      'Spina Bifida occulta/meningocele/myelomeningocele (caudal neuropore failure)',
      'Holoprosencephaly (failure of forebrain hemisphere division, SHH defect)'
    ]
  },
  {
    id: 'neural_crest',
    name: 'Neural Crest Cells (4th Germ Layer)',
    layer: 'neural_crest',
    color: '#a855f7', // Purple
    description: 'Highly migratory multipotent stem cell population arising at the neural plate borders (the "4th germ layer").',
    derivatives: [
      {
        system: 'PNS & Craniofacial Skeleton',
        structures: ['Dorsal root ganglia (DRG) & autonomic ganglia', 'Schwann cells & satellite glial cells', 'Craniofacial bones & cartilage (maxilla, mandible, hyoid)', 'Teeth odontoblasts & dentin']
      },
      {
        system: 'Cardiovascular & Endocrine',
        structures: ['Conotruncal spiral septum of heart (aorticopulmonary septum)', 'Adrenal medulla (chromaffin cells producing catecholamines)', 'Thyroid Parafollicular C-cells (calcitonin)', 'Melanocytes in skin']
      },
      {
        system: 'Meninges & Eye',
        structures: ['Pia mater and arachnoid mater', 'Corneal stroma and sclera', 'Ciliary ganglion and carotid body glomus cells']
      }
    ],
    keyGenes: ['SNAIL', 'SLUG', 'TWIST', 'SOX10', 'PAX3'],
    clinicalDefects: [
      'DiGeorge Syndrome (22q11 deletion: defective 3rd/4th pharyngeal pouch neural crest migration, cardiac outflow defects, hypocalcemia, thymic aplasia)',
      'Hirschsprung Disease (failure of neural crest to migrate to myenteric/Auerbach plexus in distal colon -> megacolon)',
      'Neuroblastoma & Pheochromocytoma',
      'Treacher Collins Syndrome (1st and 2nd arch neural crest hypoplasia)'
    ]
  },
  {
    id: 'paraxial_mesoderm',
    name: 'Paraxial Mesoderm (Somites)',
    layer: 'mesoderm',
    color: '#f59e0b', // Amber
    description: 'Paired longitudinal columns adjacent to notochord that segment into somites.',
    derivatives: [
      {
        system: 'Axial Skeleton (Sclerotome)',
        structures: ['Vertebral column & intervertebral disc annulus fibrosus', 'Ribs & cranial base bones (occipital)']
      },
      {
        system: 'Musculature (Myotome)',
        structures: ['Epaxial back muscles (erector spinae)', 'Hypaxial trunk & abdominal wall muscles', 'Limb musculature (migratory precursor cells)']
      },
      {
        system: 'Dermis (Dermatome)',
        structures: ['Dermis of back and dorsal skin']
      }
    ],
    keyGenes: ['PAX1', 'PAX3', 'MYOD', 'MYF5', 'Notch/HES1 segmentation clock'],
    clinicalDefects: [
      'Klippel-Feil syndrome (congenital fusion of cervical vertebrae)',
      'Congenital scoliosis & hemivertebrae',
      'Poland syndrome (unilateral absence of pectoralis major muscle)'
    ]
  },
  {
    id: 'intermediate_mesoderm',
    name: 'Intermediate Mesoderm',
    layer: 'mesoderm',
    color: '#eab308', // Yellow
    description: 'Cylindrical tract situated between paraxial and lateral plate mesoderm giving rise to the urogenital system.',
    derivatives: [
      {
        system: 'Urinary System',
        structures: ['Pronephros (transient)', 'Mesonephros & mesonephric (Wolffian) duct', 'Metanephros (permanent kidney parenchyma/glomeruli/tubules)', 'Ureteric bud & renal collecting system']
      },
      {
        system: 'Reproductive System',
        structures: ['Gonadal ridge (cortex and medulla of testes/ovaries)', 'Ductus deferens, epididymis, seminal vesicles (in males via Wolffian duct)', 'Trigone of urinary bladder']
      }
    ],
    keyGenes: ['WT1', 'PAX2', 'GDNF / c-RET', 'Lim1'],
    clinicalDefects: [
      'Renal Agenesis & Potter Sequence (oligohydramnios, pulmonary hypoplasia, compressed facies)',
      'Horseshoe Kidney (inferior poles fuse, trapped under Inferior Mesenteric Artery / IMA)',
      'Polycystic Kidney Disease (PKD1/PKD2 cilia defect)',
      'Ureteral duplication & ectopic ureter'
    ]
  },
  {
    id: 'lateral_plate_mesoderm',
    name: 'Lateral Plate Mesoderm (Somatic & Splanchnic)',
    layer: 'mesoderm',
    color: '#ef4444', // Red
    description: 'Splits around intraembryonic coelom into Somatic (parietal) and Splanchnic (visceral) layers.',
    derivatives: [
      {
        system: 'Cardiovascular & Hematopoietic',
        structures: ['Heart (endocardium, myocardium, epicardium)', 'Blood vessels (endothelium & vascular smooth muscle)', 'Blood cells (primitive & definitive hematopoiesis)', 'Spleen stroma & lymph nodes']
      },
      {
        system: 'Body Wall & Serous Membranes',
        structures: ['Parietal & visceral pleura, pericardium, and peritoneum', 'Limb skeleton (cartilage models of long bones & joints)', 'Dermis of ventral body wall and limbs']
      },
      {
        system: 'Adrenal Cortex & Visceral Stroma',
        structures: ['Adrenal cortex (zona glomerulosa, fasciculata, reticularis)', 'Gastrointestinal wall smooth muscle & connective tissue']
      }
    ],
    keyGenes: ['NKX2.5', 'GATA4', 'VEGF / VEGFR2', 'TBX5', 'BMP4'],
    clinicalDefects: [
      'Congenital Heart Defects (VSD, ASD, Tetralogy of Fallot)',
      'Ectopia Cordis (ventral body wall closure defect leaving heart exposed)',
      'Congenital Diaphragmatic Hernia of Bochdalek (pleuroperitoneal membrane defect)'
    ]
  },
  {
    id: 'endoderm',
    name: 'Endoderm (Definitive Gut Lining)',
    layer: 'endoderm',
    color: '#22c55e', // Emerald Green
    description: 'Innermost germ layer forming the epithelial mucosal lining of the gastrointestinal and respiratory tracts and parenchymal organs.',
    derivatives: [
      {
        system: 'Gastrointestinal Epithelium & Glands',
        structures: ['Epithelium of pharynx, esophagus, stomach, small intestine, and colon (to pectinate line)', 'Liver parenchymal hepatocytes & biliary duct system', 'Pancreas (exocrine acini and endocrine islets of Langerhans)']
      },
      {
        system: 'Respiratory System',
        structures: ['Tracheal & bronchial epithelial lining', 'Alveolar Type I and Type II pneumocytes of lungs']
      },
      {
        system: 'Endocrine & Branchial Pouches',
        structures: ['Thyroid gland follicular cells', 'Parathyroid glands (inferior from 3rd pouch, superior from 4th pouch)', 'Thymus gland reticular stroma', 'Epithelium of urinary bladder & middle ear / auditory tube']
      }
    ],
    keyGenes: ['SOX17', 'FOXA2', 'PDX1 (pancreas)', 'TTF-1 (thyroid & lung)', 'SHH'],
    clinicalDefects: [
      'Tracheoesophageal Fistula with Esophageal Atresia (type C most common: polyhydramnios, feeding regurgitation)',
      'Meckel Diverticulum (persistent vitelline duct: rule of 2s, ectopic gastric/pancreatic mucosa)',
      'Duodenal Atresia (failure of recanalization -> "double bubble" sign on X-ray, associated with Down Syndrome)',
      'Thyroglossal Duct Cyst (persistent tract from foramen cecum to thyroid)'
    ]
  }
];
