import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EmbryoStage, HotspotPin, ViewerSettings } from '../types';
import { 
  Eye, 
  Layers, 
  Scissors, 
  Activity, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Camera, 
  Sparkles,
  Glasses,
  Info,
  Radio,
  ChevronDown,
  Check
} from 'lucide-react';

interface Props {
  currentStage: EmbryoStage;
  settings: ViewerSettings;
  onUpdateSettings: (newSettings: Partial<ViewerSettings>) => void;
  onSelectHotspot: (hotspot: HotspotPin) => void;
  selectedHotspotId?: string;
  viewerId?: string;
  viewerLabel?: string;
  isSplitView?: boolean;
  onCameraChange?: (state: { position: [number, number, number]; target: [number, number, number]; senderId: string }) => void;
  cameraSyncState?: { position: [number, number, number]; target: [number, number, number]; senderId: string } | null;
  onStageSelect?: (stage: EmbryoStage) => void;
  allStages?: EmbryoStage[];
  onOpenARMode?: () => void;
  onOpenVRMode?: () => void;
  onOpenTimeLapse?: () => void;
}

export const ThreeEmbryoViewer: React.FC<Props> = ({
  currentStage,
  settings,
  onUpdateSettings,
  onSelectHotspot,
  selectedHotspotId,
  viewerId = 'primary_viewer',
  viewerLabel,
  isSplitView = false,
  onCameraChange,
  cameraSyncState,
  onStageSelect,
  allStages,
  onOpenARMode,
  onOpenVRMode,
  onOpenTimeLapse
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const hotspotSpritesRef = useRef<{ id: string; sprite: THREE.Sprite; position: THREE.Vector3 }[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const isInteractingRef = useRef<boolean>(false);
  const isApplyingExternalSyncRef = useRef<boolean>(false);

  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotPin | null>(null);
  const [activeCameraView, setActiveCameraView] = useState<'front' | 'side' | 'dorsal' | 'close'>('side');
  const [isStagePickerOpen, setIsStagePickerOpen] = useState<boolean>(false);

  // Build Procedural 3D Embryo Geometry based on Stage
  const buildEmbryoModel = useCallback((stage: EmbryoStage, currentScene: THREE.Scene) => {
    if (modelGroupRef.current) {
      currentScene.remove(modelGroupRef.current);
      // Clean up old geometries and materials
      modelGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    }

    const group = new THREE.Group();
    group.name = 'embryo_model_group';
    modelGroupRef.current = group;
    heartMeshRef.current = null;

    // Clipping planes setup
    const clippingPlanes: THREE.Plane[] = [];
    if (settings.cutawayPlane === 'sagittal') {
      clippingPlanes.push(new THREE.Plane(new THREE.Vector3(1, 0, 0), settings.cutawayOffset));
    } else if (settings.cutawayPlane === 'transverse') {
      clippingPlanes.push(new THREE.Plane(new THREE.Vector3(0, 1, 0), settings.cutawayOffset));
    } else if (settings.cutawayPlane === 'coronal') {
      clippingPlanes.push(new THREE.Plane(new THREE.Vector3(0, 0, 1), settings.cutawayOffset));
    }

    // Material helpers with clipping planes and settings
    const createMaterial = (
      color: number, 
      opacity = 1.0, 
      roughness = 0.4, 
      metalness = 0.1, 
      transparent = false,
      wireframe = settings.wireframe
    ) => {
      if (settings.ultrasoundMode) {
        // Echogenic grayscale ultrasound acoustic shader appearance
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xd1d5db),
          roughness: 0.8,
          metalness: 0.2,
          wireframe,
          clippingPlanes,
          clipShadows: true,
        });
      }

      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness,
        metalness,
        transparent: transparent || opacity < 1.0,
        opacity: transparent ? opacity : 1.0,
        wireframe,
        clippingPlanes,
        clipShadows: true,
        side: THREE.DoubleSide
      });
    };

    const ectoMat = createMaterial(0x38bdf8, 0.85, 0.3, 0.05, true); // Ectoderm (Translucent Sky Blue)
    const mesoMat = createMaterial(0xf59e0b, 0.95, 0.4, 0.1); // Mesoderm (Amber/Coral)
    const endoMat = createMaterial(0x22c55e, 0.95, 0.5, 0.1); // Endoderm (Emerald)
    const neuralMat = createMaterial(0x818cf8, 0.95, 0.2, 0.1); // Neural Tube (Indigo)
    const heartMat = createMaterial(0xef4444, 0.98, 0.2, 0.2); // Heart Tube (Crimson)
    const somiteMat = createMaterial(0xfbbf24, 0.95, 0.5, 0.0); // Somites (Bright Gold)
    const eyeMat = createMaterial(0x0f172a, 1.0, 0.1, 0.3); // Eye pigment (Deep Charcoal)
    const yolkMat = createMaterial(0xfef08a, 0.75, 0.6, 0.0, true); // Yolk Sac (Pale Yellow Translucent)
    const cordMat = createMaterial(0x94a3b8, 0.85, 0.4, 0.1); // Umbilical Cord (Slate Pearl)

    // Build stage-specific 3D anatomy
    switch (stage.modelType) {
      case 'cleavage':
      case 'zygote': {
        // Zona pellucida translucent outer sphere
        const zpGeo = new THREE.SphereGeometry(1.6, 32, 32);
        const zpMat = createMaterial(0xa5f3fc, 0.3, 0.1, 0.0, true);
        const zpMesh = new THREE.Mesh(zpGeo, zpMat);
        group.add(zpMesh);

        // Blastomeres (4 cells compacted)
        const cellOffsets = [
          [-0.5, 0.4, 0.4],
          [0.5, 0.4, -0.4],
          [-0.4, -0.4, -0.3],
          [0.4, -0.4, 0.4],
        ];
        cellOffsets.forEach((pos) => {
          const cellGeo = new THREE.SphereGeometry(0.7, 24, 24);
          const cellMat = createMaterial(0x38bdf8, 0.85, 0.3, 0.0, true);
          const cellMesh = new THREE.Mesh(cellGeo, cellMat);
          cellMesh.position.set(pos[0], pos[1], pos[2]);
          group.add(cellMesh);

          // Nucleus with chromatin glow inside each cell
          const nucGeo = new THREE.SphereGeometry(0.25, 16, 16);
          const nucMat = createMaterial(0x818cf8, 0.9, 0.1, 0.0);
          const nucMesh = new THREE.Mesh(nucGeo, nucMat);
          nucMesh.position.set(pos[0], pos[1], pos[2]);
          group.add(nucMesh);
        });

        // Polar bodies
        const pbGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const pbMat = createMaterial(0xf43f5e, 0.9, 0.3, 0.0);
        const pbMesh1 = new THREE.Mesh(pbGeo, pbMat);
        pbMesh1.position.set(0.9, 1.0, 0.3);
        const pbMesh2 = new THREE.Mesh(pbGeo, pbMat);
        pbMesh2.position.set(-0.8, 1.1, -0.2);
        group.add(pbMesh1, pbMesh2);
        break;
      }

      case 'blastocyst': {
        // Trophectoderm sphere
        const trophoGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const trophoMat = createMaterial(0x93c5fd, 0.4, 0.2, 0.0, true);
        const trophoMesh = new THREE.Mesh(trophoGeo, trophoMat);
        group.add(trophoMesh);

        // Fluid blastocoel cavity inner glow
        const fluidGeo = new THREE.SphereGeometry(1.4, 24, 24);
        const fluidMat = createMaterial(0x0284c7, 0.15, 0.1, 0.0, true);
        const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
        group.add(fluidMesh);

        // Inner Cell Mass (ICM) cluster at embryonic pole
        const icmCluster = new THREE.Group();
        for (let i = 0; i < 18; i++) {
          const icmGeo = new THREE.SphereGeometry(0.22, 16, 16);
          const icmMat = createMaterial(0xf59e0b, 0.95, 0.3, 0.1);
          const m = new THREE.Mesh(icmGeo, icmMat);
          const u = Math.random() * 0.7;
          const v = Math.random() * 0.7;
          m.position.set(
            (Math.random() - 0.5) * 0.8,
            0.65 + u * 0.4,
            (Math.random() - 0.5) * 0.8
          );
          icmCluster.add(m);
        }
        group.add(icmCluster);
        break;
      }

      case 'bilaminar': {
        // Bilaminar disc: Epiblast (top blue) + Hypoblast (bottom yellow)
        const epiGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 32);
        const epiMesh = new THREE.Mesh(epiGeo, ectoMat);
        epiMesh.position.set(0, 0.15, 0);
        group.add(epiMesh);

        const hypoGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32);
        const hypoMesh = new THREE.Mesh(hypoGeo, endoMat);
        hypoMesh.position.set(0, -0.1, 0);
        group.add(hypoMesh);

        // Amniotic Cavity Dome (Top)
        const amnionGeo = new THREE.SphereGeometry(1.15, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
        const amnionMat = createMaterial(0x60a5fa, 0.3, 0.2, 0.0, true);
        const amnionMesh = new THREE.Mesh(amnionGeo, amnionMat);
        amnionMesh.position.set(0, 0.25, 0);
        group.add(amnionMesh);

        // Primary Yolk Sac (Bottom)
        const yolkGeo = new THREE.SphereGeometry(1.2, 24, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const yolkMesh = new THREE.Mesh(yolkGeo, yolkMat);
        yolkMesh.position.set(0, -0.2, 0);
        group.add(yolkMesh);

        // Connecting stalk (future umbilical cord)
        const stalkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 16);
        const stalkMesh = new THREE.Mesh(stalkGeo, mesoMat);
        stalkMesh.position.set(-1.0, 0.4, 0);
        stalkMesh.rotation.z = Math.PI / 3;
        group.add(stalkMesh);
        break;
      }

      case 'trilaminar_gastrula': {
        // 3 Distinct Germ Layers (Trilaminar disc)
        // Ectoderm (Top Blue)
        const ectoGeo = new THREE.BoxGeometry(2.4, 0.2, 1.5);
        const ectoMesh = new THREE.Mesh(ectoGeo, ectoMat);
        ectoMesh.position.set(0, 0.3, 0);
        group.add(ectoMesh);

        // Primitive Streak groove in ectoderm
        const streakGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.6, 16);
        const streakMat = createMaterial(0xa855f7, 1.0, 0.2, 0.0);
        const streakMesh = new THREE.Mesh(streakGeo, streakMat);
        streakMesh.rotation.x = Math.PI / 2;
        streakMesh.position.set(0, 0.42, 0);
        group.add(streakMesh);

        // Hensen's Node at cranial end of streak
        const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const nodeMesh = new THREE.Mesh(nodeGeo, streakMat);
        nodeMesh.position.set(0, 0.45, 0.7);
        group.add(nodeMesh);

        // Mesoderm (Middle Amber/Red)
        const mesoGeo = new THREE.BoxGeometry(2.3, 0.25, 1.4);
        const mesoMesh = new THREE.Mesh(mesoGeo, mesoMat);
        mesoMesh.position.set(0, 0.05, 0);
        group.add(mesoMesh);

        // Notochord rod in mesoderm
        const notochordGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
        const notoMat = createMaterial(0xef4444, 1.0, 0.3, 0.2);
        const notoMesh = new THREE.Mesh(notochordGeo, notoMat);
        notoMesh.rotation.x = Math.PI / 2;
        notoMesh.position.set(0, 0.05, -0.1);
        group.add(notoMesh);

        // Endoderm (Bottom Green)
        const endoGeo = new THREE.BoxGeometry(2.2, 0.2, 1.3);
        const endoMesh = new THREE.Mesh(endoGeo, endoMat);
        endoMesh.position.set(0, -0.2, 0);
        group.add(endoMesh);
        break;
      }

      case 'neurula_week4': {
        // C-shaped curved embryo body with prominent somites, neural tube & heart tube
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(0, 1.5, -0.2),   // Cranial head fold
          new THREE.Vector3(0, 0.8, 0.9),    // Ventral cardiac bulge
          new THREE.Vector3(0, -0.8, 0.7),   // Abdominal fold
          new THREE.Vector3(0, -1.3, -0.4)   // Caudal tail fold
        );

        // Body tube (surface ectoderm)
        const bodyGeo = new THREE.TubeGeometry(curve, 32, 0.55, 16, false);
        const bodyMesh = new THREE.Mesh(bodyGeo, ectoMat);
        group.add(bodyMesh);

        // Dorsal Neural Tube
        const neuralCurve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(0, 1.45, -0.55),
          new THREE.Vector3(0, 0.7, -0.1),
          new THREE.Vector3(0, -0.7, -0.1),
          new THREE.Vector3(0, -1.25, -0.7)
        );
        const neuralGeo = new THREE.TubeGeometry(neuralCurve, 32, 0.2, 16, false);
        const neuralMesh = new THREE.Mesh(neuralGeo, neuralMat);
        group.add(neuralMesh);

        // Cranial Neuropore & Brain Vesicle Bulges
        const cranialHeadGeo = new THREE.SphereGeometry(0.7, 24, 24);
        const cranialHeadMesh = new THREE.Mesh(cranialHeadGeo, neuralMat);
        cranialHeadMesh.position.set(0, 1.5, 0.1);
        cranialHeadMesh.scale.set(0.9, 1.1, 1.0);
        group.add(cranialHeadMesh);

        // Segmented Somite Blocks (Paraxial Mesoderm) along body
        for (let i = 0; i < 16; i++) {
          const t = 0.15 + (i / 16) * 0.7;
          const pt = curve.getPoint(t);
          const sGeo = new THREE.BoxGeometry(0.2, 0.15, 0.18);
          // Left somite
          const sLeft = new THREE.Mesh(sGeo, somiteMat);
          sLeft.position.set(0.4, pt.y, pt.z - 0.2);
          // Right somite
          const sRight = new THREE.Mesh(sGeo, somiteMat);
          sRight.position.set(-0.4, pt.y, pt.z - 0.2);
          group.add(sLeft, sRight);
        }

        // Pulsating Primitive Heart Tube Bulge
        const heartGeo = new THREE.SphereGeometry(0.45, 24, 24);
        const heartMesh = new THREE.Mesh(heartGeo, heartMat);
        heartMesh.position.set(0, 0.3, 0.65);
        heartMesh.scale.set(1.1, 1.3, 0.9);
        heartMeshRef.current = heartMesh;
        group.add(heartMesh);

        // Branchial / Pharyngeal Arches (1, 2, 3)
        for (let i = 0; i < 3; i++) {
          const archGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16);
          const archMat = createMaterial(0xa855f7, 0.95, 0.3, 0.1);
          const archMesh = new THREE.Mesh(archGeo, archMat);
          archMesh.rotation.z = Math.PI / 2;
          archMesh.position.set(0, 0.95 - i * 0.25, 0.45);
          group.add(archMesh);
        }

        // Yolk stalk & sac
        const yolkStalkGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.0, 16);
        const yolkStalkMesh = new THREE.Mesh(yolkStalkGeo, yolkMat);
        yolkStalkMesh.position.set(0, -0.4, 1.0);
        yolkStalkMesh.rotation.x = Math.PI / 3;
        group.add(yolkStalkMesh);
        break;
      }

      case 'organogenesis_week5':
      case 'organogenesis_week6': {
        // Week 5-6 Embryo with paddle limb buds, eye placodes, brain vesicles, and midgut herniation
        // Main Body Form
        const headGeo = new THREE.SphereGeometry(0.9, 24, 24);
        const headMesh = new THREE.Mesh(headGeo, ectoMat);
        headMesh.position.set(0, 1.2, 0.2);
        headMesh.scale.set(1.0, 1.2, 1.1);
        group.add(headMesh);

        // Secondary brain vesicles highlight
        const brainVesicleGeo = new THREE.SphereGeometry(0.65, 20, 20);
        const brainVesicleMesh = new THREE.Mesh(brainVesicleGeo, neuralMat);
        brainVesicleMesh.position.set(0, 1.4, 0.15);
        group.add(brainVesicleMesh);

        // Torso
        const torsoCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, 0.9, 0.2),
          new THREE.Vector3(0, 0.0, 0.8),
          new THREE.Vector3(0, -1.0, 0.0)
        );
        const torsoGeo = new THREE.TubeGeometry(torsoCurve, 24, 0.7, 16, false);
        const torsoMesh = new THREE.Mesh(torsoGeo, ectoMat);
        group.add(torsoMesh);

        // Retinal Pigment Eye Cups
        const eyeGeo = new THREE.SphereGeometry(0.16, 16, 16);
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(0.65, 1.2, 0.65);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(-0.65, 1.2, 0.65);
        group.add(leftEye, rightEye);

        // Upper Limb Buds (Paddle-shaped) with AER rim
        const armGeo = new THREE.BoxGeometry(0.5, 0.35, 0.7);
        const leftArm = new THREE.Mesh(armGeo, mesoMat);
        leftArm.position.set(0.75, 0.3, 0.3);
        leftArm.rotation.set(0.2, 0.3, -0.4);
        const rightArm = new THREE.Mesh(armGeo, mesoMat);
        rightArm.position.set(-0.75, 0.3, 0.3);
        rightArm.rotation.set(0.2, -0.3, 0.4);
        group.add(leftArm, rightArm);

        // Lower Limb Buds
        const legGeo = new THREE.BoxGeometry(0.4, 0.3, 0.6);
        const leftLeg = new THREE.Mesh(legGeo, mesoMat);
        leftLeg.position.set(0.6, -0.9, 0.2);
        leftLeg.rotation.set(-0.2, 0.2, -0.3);
        const rightLeg = new THREE.Mesh(legGeo, mesoMat);
        rightLeg.position.set(-0.6, -0.9, 0.2);
        rightLeg.rotation.set(-0.2, -0.2, 0.3);
        group.add(leftLeg, rightLeg);

        // Heart Prominence (Cardiogenic Bulge)
        const heartBulgeGeo = new THREE.SphereGeometry(0.55, 24, 24);
        const heartBulgeMesh = new THREE.Mesh(heartBulgeGeo, heartMat);
        heartBulgeMesh.position.set(0, 0.35, 0.7);
        heartMeshRef.current = heartBulgeMesh;
        group.add(heartBulgeMesh);

        // Physiological Midgut Herniation into cord
        const herniationGeo = new THREE.TorusGeometry(0.25, 0.12, 16, 24);
        const herniationMesh = new THREE.Mesh(herniationGeo, endoMat);
        herniationMesh.position.set(0, -0.25, 0.95);
        herniationMesh.rotation.x = Math.PI / 2;
        group.add(herniationMesh);

        // Umbilical Cord Stalk
        const cordGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 16);
        const cordMesh = new THREE.Mesh(cordGeo, cordMat);
        cordMesh.position.set(0, -0.35, 1.4);
        cordMesh.rotation.x = Math.PI / 3;
        group.add(cordMesh);
        break;
      }

      case 'fetus_week8':
      case 'fetus_week12':
      case 'fetus_week20':
      case 'fetus_week28':
      case 'term_week38': {
        // Full Fetal Morphological Silhouette
        const scaleFactor = stage.modelType === 'fetus_week8' ? 0.9 :
                           stage.modelType === 'fetus_week12' ? 1.05 :
                           stage.modelType === 'fetus_week20' ? 1.2 :
                           stage.modelType === 'fetus_week28' ? 1.35 : 1.45;

        // Fetal Head (Cranial Vault + Facial Profile)
        const fHeadGeo = new THREE.SphereGeometry(1.0 * scaleFactor, 32, 32);
        const fHeadMesh = new THREE.Mesh(fHeadGeo, ectoMat);
        fHeadMesh.position.set(0, 1.1 * scaleFactor, 0.1);
        fHeadMesh.scale.set(0.9, 1.15, 1.05);
        group.add(fHeadMesh);

        // Face & Nose Prominence
        const noseGeo = new THREE.ConeGeometry(0.18 * scaleFactor, 0.35 * scaleFactor, 16);
        const noseMesh = new THREE.Mesh(noseGeo, ectoMat);
        noseMesh.position.set(0, 0.95 * scaleFactor, 1.05 * scaleFactor);
        noseMesh.rotation.x = Math.PI / 3;
        group.add(noseMesh);

        // Eyes with Fused Eyelids
        const fEyeGeo = new THREE.SphereGeometry(0.2 * scaleFactor, 16, 16);
        const fLeftEye = new THREE.Mesh(fEyeGeo, eyeMat);
        fLeftEye.position.set(0.55 * scaleFactor, 1.05 * scaleFactor, 0.85 * scaleFactor);
        const fRightEye = new THREE.Mesh(fEyeGeo, eyeMat);
        fRightEye.position.set(-0.55 * scaleFactor, 1.05 * scaleFactor, 0.85 * scaleFactor);
        group.add(fLeftEye, fRightEye);

        // External Ear (Auricle / Pinna)
        const earGeo = new THREE.TorusGeometry(0.2 * scaleFactor, 0.08 * scaleFactor, 12, 16);
        const leftEar = new THREE.Mesh(earGeo, ectoMat);
        leftEar.position.set(0.9 * scaleFactor, 1.1 * scaleFactor, 0.0);
        leftEar.rotation.y = Math.PI / 2;
        const rightEar = new THREE.Mesh(earGeo, ectoMat);
        rightEar.position.set(-0.9 * scaleFactor, 1.1 * scaleFactor, 0.0);
        rightEar.rotation.y = -Math.PI / 2;
        group.add(leftEar, rightEar);

        // Fetal Body (Thorax & Abdomen)
        const bodyGeo = new THREE.CylinderGeometry(
          0.8 * scaleFactor, 
          0.7 * scaleFactor, 
          1.8 * scaleFactor, 
          24
        );
        const fBodyMesh = new THREE.Mesh(bodyGeo, ectoMat);
        fBodyMesh.position.set(0, -0.2 * scaleFactor, 0.1);
        group.add(fBodyMesh);

        // Internal 4-Chamber Heart
        const fHeartGeo = new THREE.SphereGeometry(0.45 * scaleFactor, 24, 24);
        const fHeartMesh = new THREE.Mesh(fHeartGeo, heartMat);
        fHeartMesh.position.set(0, 0.2 * scaleFactor, 0.45 * scaleFactor);
        fHeartMesh.scale.set(1.1, 0.9, 0.9);
        heartMeshRef.current = fHeartMesh;
        group.add(fHeartMesh);

        // Lungs flanking heart
        const lungGeo = new THREE.SphereGeometry(0.35 * scaleFactor, 16, 16);
        const leftLung = new THREE.Mesh(lungGeo, endoMat);
        leftLung.position.set(0.4 * scaleFactor, 0.25 * scaleFactor, 0.35 * scaleFactor);
        const rightLung = new THREE.Mesh(lungGeo, endoMat);
        rightLung.position.set(-0.4 * scaleFactor, 0.25 * scaleFactor, 0.35 * scaleFactor);
        group.add(leftLung, rightLung);

        // Fetal Spine (Dorsal Column)
        for (let i = 0; i < 12; i++) {
          const vertGeo = new THREE.CylinderGeometry(0.12 * scaleFactor, 0.12 * scaleFactor, 0.12 * scaleFactor, 12);
          const vertMesh = new THREE.Mesh(vertGeo, somiteMat);
          vertMesh.position.set(0, (0.5 - i * 0.15) * scaleFactor, -0.6 * scaleFactor);
          group.add(vertMesh);
        }

        // Arms & Hands with distinct digits
        const fArmGeo = new THREE.CylinderGeometry(0.18 * scaleFactor, 0.14 * scaleFactor, 0.9 * scaleFactor, 16);
        const fLeftArm = new THREE.Mesh(fArmGeo, ectoMat);
        fLeftArm.position.set(0.9 * scaleFactor, 0.05 * scaleFactor, 0.4 * scaleFactor);
        fLeftArm.rotation.set(0.5, 0.0, -0.4);
        const fRightArm = new THREE.Mesh(fArmGeo, ectoMat);
        fRightArm.position.set(-0.9 * scaleFactor, 0.05 * scaleFactor, 0.4 * scaleFactor);
        fRightArm.rotation.set(0.5, 0.0, 0.4);
        group.add(fLeftArm, fRightArm);

        // Hands & Fingers
        const handGeo = new THREE.BoxGeometry(0.25 * scaleFactor, 0.35 * scaleFactor, 0.1 * scaleFactor);
        const leftHand = new THREE.Mesh(handGeo, mesoMat);
        leftHand.position.set(0.75 * scaleFactor, -0.4 * scaleFactor, 0.75 * scaleFactor);
        const rightHand = new THREE.Mesh(handGeo, mesoMat);
        rightHand.position.set(-0.75 * scaleFactor, -0.4 * scaleFactor, 0.75 * scaleFactor);
        group.add(leftHand, rightHand);

        // Legs & Feet (Flexed in utero position)
        const fLegGeo = new THREE.CylinderGeometry(0.22 * scaleFactor, 0.16 * scaleFactor, 1.0 * scaleFactor, 16);
        const fLeftLeg = new THREE.Mesh(fLegGeo, ectoMat);
        fLeftLeg.position.set(0.6 * scaleFactor, -1.0 * scaleFactor, 0.3 * scaleFactor);
        fLeftLeg.rotation.set(-0.7, 0.3, -0.4);
        const fRightLeg = new THREE.Mesh(fLegGeo, ectoMat);
        fRightLeg.position.set(-0.6 * scaleFactor, -1.0 * scaleFactor, 0.3 * scaleFactor);
        fRightLeg.rotation.set(-0.7, -0.3, 0.4);
        group.add(fLeftLeg, fRightLeg);

        // Umbilical Cord with Spiral Arteries & Vein
        const cordCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -0.4 * scaleFactor, 0.7 * scaleFactor),
          new THREE.Vector3(0.3, -0.8 * scaleFactor, 1.2 * scaleFactor),
          new THREE.Vector3(-0.2, -1.2 * scaleFactor, 1.6 * scaleFactor),
          new THREE.Vector3(0.1, -1.6 * scaleFactor, 2.0 * scaleFactor),
        ]);
        const fCordGeo = new THREE.TubeGeometry(cordCurve, 32, 0.18 * scaleFactor, 16, false);
        const fCordMesh = new THREE.Mesh(fCordGeo, cordMat);
        group.add(fCordMesh);
        break;
      }
    }

    currentScene.add(group);

    // Build Hotspot 3D Pins
    hotspotSpritesRef.current = [];
    if (settings.showHotspots && stage.hotspots) {
      stage.hotspots.forEach((pin) => {
        // Create canvas texture for pin badge
        const pinCanvas = document.createElement('canvas');
        pinCanvas.width = 128;
        pinCanvas.height = 128;
        const ctx = pinCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = selectedHotspotId === pin.id ? '#ef4444' : '#3b82f6';
          ctx.beginPath();
          ctx.arc(64, 64, 52, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 8;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // White center pulse
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(64, 64, 22, 0, Math.PI * 2);
          ctx.fill();
        }

        const texture = new THREE.CanvasTexture(pinCanvas);
        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          depthTest: false,
          transparent: true
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(pin.position[0], pin.position[1], pin.position[2]);
        sprite.scale.set(0.4, 0.4, 0.4);
        sprite.userData = { hotspot: pin };
        group.add(sprite);

        hotspotSpritesRef.current.push({
          id: pin.id,
          sprite,
          position: new THREE.Vector3(...pin.position)
        });
      });
    }
  }, [settings, selectedHotspotId]);

  // Initialize Three.js scene, camera, renderer, and lights
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Background color based on ultrasound or normal theme
    scene.background = new THREE.Color(settings.ultrasoundMode ? 0x05070a : 0x0b1120);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.5, 1.5, 4.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 15;
    controls.minDistance = 1.2;
    controlsRef.current = controls;

    // Camera sync change handler
    controls.addEventListener('change', () => {
      if (isApplyingExternalSyncRef.current) return;
      if (isInteractingRef.current && onCameraChange && cameraRef.current && controlsRef.current) {
        const cam = cameraRef.current;
        const tgt = controlsRef.current.target;
        onCameraChange({
          position: [cam.position.x, cam.position.y, cam.position.z],
          target: [tgt.x, tgt.y, tgt.z],
          senderId: viewerId
        });
      }
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, settings.ultrasoundMode ? 0.9 : 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0);
    dirLight2.position.set(-5, -3, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xf43f5e, 1.2, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Initial build
    buildEmbryoModel(currentStage, scene);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation
      if (settings.autoRotate && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.005;
      }

      // Heartbeat rhythmic pulsating animation
      if (settings.heartbeatAnimate && heartMeshRef.current && currentStage.heartRateBpm) {
        const bpm = currentStage.heartRateBpm;
        const bps = bpm / 60;
        const pulse = 1.0 + Math.sin(elapsedTime * bps * Math.PI * 2) * 0.12;
        heartMeshRef.current.scale.set(pulse, pulse * 1.1, pulse);
      }

      // Hotspot pulse
      hotspotSpritesRef.current.forEach(({ sprite }) => {
        const s = 0.38 + Math.sin(elapsedTime * 4) * 0.05;
        sprite.scale.set(s, s, s);
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update model when stage or settings change
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(settings.ultrasoundMode ? 0x030712 : 0x090d16);
      buildEmbryoModel(currentStage, sceneRef.current);
    }
  }, [currentStage, settings, buildEmbryoModel]);

  // Apply synchronized camera movements from sibling viewer in Split-View
  useEffect(() => {
    if (!cameraSyncState || cameraSyncState.senderId === viewerId) return;
    if (!cameraRef.current || !controlsRef.current) return;

    isApplyingExternalSyncRef.current = true;
    cameraRef.current.position.set(
      cameraSyncState.position[0],
      cameraSyncState.position[1],
      cameraSyncState.position[2]
    );
    controlsRef.current.target.set(
      cameraSyncState.target[0],
      cameraSyncState.target[1],
      cameraSyncState.target[2]
    );
    controlsRef.current.update();

    const t = setTimeout(() => {
      isApplyingExternalSyncRef.current = false;
    }, 50);
    return () => clearTimeout(t);
  }, [cameraSyncState, viewerId]);

  // Raycasting for interactive hotspots
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const sprites = hotspotSpritesRef.current.map((h) => h.sprite);
    const intersects = raycasterRef.current.intersectObjects(sprites, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Sprite;
      const hotspot = hit.userData?.hotspot as HotspotPin;
      if (hotspot) {
        setHoveredHotspot(hotspot);
        if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
        return;
      }
    }

    setHoveredHotspot(null);
    if (canvasRef.current) canvasRef.current.style.cursor = 'default';
  };

  const handlePointerDown = () => {
    isInteractingRef.current = true;
    if (hoveredHotspot) {
      onSelectHotspot(hoveredHotspot);
    }
  };

  const handlePointerUp = () => {
    isInteractingRef.current = false;
  };

  const handlePointerLeave = () => {
    isInteractingRef.current = false;
  };

  const handleWheel = () => {
    isInteractingRef.current = true;
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 300);
  };

  // Camera preset switches
  const setCameraView = (view: 'front' | 'side' | 'dorsal' | 'close') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActiveCameraView(view);
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (view) {
      case 'front':
        camera.position.set(0, 0, 4.5);
        break;
      case 'side':
        camera.position.set(4.0, 0.5, 1.5);
        break;
      case 'dorsal':
        camera.position.set(-0.2, 1.0, -4.5);
        break;
      case 'close':
        camera.position.set(1.5, 0.5, 1.8);
        break;
    }
    controls.target.set(0, 0, 0);
    controls.update();
  };

  const zoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.multiplyScalar(0.85);
    controlsRef.current.update();
  };

  const zoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.multiplyScalar(1.15);
    controlsRef.current.update();
  };

  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(3.5, 1.5, 4.0);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${
        isSplitView ? 'h-[460px] lg:h-[530px]' : 'h-[520px] lg:h-[620px]'
      } rounded-2xl overflow-hidden border border-slate-800 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 shadow-2xl flex flex-col select-none`}
    >
      {/* Background Dot Grid Matrix Texture */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

      {/* Subtle Cyan Viewport Glow */}
      <div className="absolute inset-0 bg-sky-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* HUD Viewport Lens Marker (Top Left) */}
      <div className="absolute top-3 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-12 sm:w-16 h-0.5 bg-sky-500/60" />
          <span className="text-[10px] text-sky-400 font-mono tracking-wider font-semibold">
            {viewerLabel || 'VIEWPORT_LENS_01'}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onWheel={handleWheel}
        className="w-full h-full block touch-none relative z-0"
      />

      {/* Top Left Floating HUD: Stage Badge & Morphometric Stats / Stage Selector */}
      <div className="absolute top-9 left-3 sm:left-4 z-20 flex flex-col gap-1.5 max-w-[280px] sm:max-w-sm">
        {onStageSelect && allStages ? (
          <div className="relative">
            <button
              id={`btn_stage_dropdown_${viewerId}`}
              onClick={() => setIsStagePickerOpen(!isStagePickerOpen)}
              className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-850 backdrop-blur-md border border-sky-500/50 hover:border-sky-400 px-3 py-1.5 rounded-xl shadow-2xl text-left transition-all group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1">
                  Week {currentStage.week}
                  {currentStage.carnegieStage && (
                    <span className="text-amber-300 font-mono font-semibold">CS{currentStage.carnegieStage}</span>
                  )}
                </span>
                <span className="text-xs font-bold text-white truncate max-w-[170px] sm:max-w-[200px]">
                  {currentStage.title}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform ${isStagePickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu for Carnegie Stage Selection */}
            {isStagePickerOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 max-h-64 overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 divide-y divide-slate-800/60 scrollbar-thin scrollbar-thumb-slate-700">
                <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Select Carnegie Stage
                </div>
                {allStages.map((stg) => {
                  const isSelected = stg.id === currentStage.id;
                  return (
                    <button
                      key={stg.id}
                      onClick={() => {
                        onStageSelect(stg);
                        setIsStagePickerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-sky-400">Wk {stg.week}</span>
                          {stg.carnegieStage && (
                            <span className="text-[10px] font-mono px-1 py-0.2 bg-slate-800 rounded text-amber-300">
                              CS{stg.carnegieStage}
                            </span>
                          )}
                          <span className="text-[11px] truncate font-medium text-slate-200">{stg.title}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1 rounded-xl shadow-2xl pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
              {currentStage.trimester}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-bold text-white">
              Week {currentStage.week} (Days {currentStage.dayStart}–{currentStage.dayEnd})
            </span>
            {currentStage.carnegieStage && (
              <span className="bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-[10px] font-mono px-1.5 py-0.5 rounded-md">
                CS {currentStage.carnegieStage}
              </span>
            )}
          </div>
        )}

        {/* Real-time Biological Measurements Overlay */}
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800/90 px-3 py-1.5 rounded-xl text-xs flex items-center gap-3 text-slate-300 shadow-xl pointer-events-none">
          <div>
            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-widest">Est. Length</span>
            <span className="font-bold text-white font-mono text-xs">{currentStage.crlMm} <span className="text-[10px] text-slate-400 font-normal">mm</span></span>
          </div>
          <div className="w-px h-5 bg-slate-800" />
          {currentStage.heartRateBpm ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-widest">Heart Rhythm</span>
                <span className="font-bold text-white font-mono text-xs">{currentStage.heartRateBpm} <span className="text-[10px] text-slate-400 font-normal">bpm</span></span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-widest">Morphogen</span>
              <span className="font-mono text-[11px] text-amber-300 truncate max-w-[90px] block">{currentStage.morphogens[0] || 'N/A'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Top Right: Quick Viewport Controls */}
      <div className="absolute top-3 right-3 sm:right-4 z-10 flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5">
          {onOpenTimeLapse && (
            <button
              id={`btn_open_timelapse_${viewerId}`}
              onClick={onOpenTimeLapse}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shadow-lg bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 text-sky-300 border-sky-500/50 shadow-sky-950/40"
              title="Launch Automated 23 Carnegie Stages Time-Lapse Playback"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Time-Lapse</span>
            </button>
          )}

          {onOpenARMode && (
            <button
              id={`btn_open_ar_mode_${viewerId}`}
              onClick={onOpenARMode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shadow-lg bg-gradient-to-r from-sky-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 text-sky-300 border-sky-500/50 shadow-sky-950/40"
              title="Project 3D Embryo into Real Physical Space via Device Camera (Augmented Reality)"
            >
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span>AR</span>
            </button>
          )}

          {onOpenVRMode && (
            <button
              id={`btn_open_vr_mode_${viewerId}`}
              onClick={onOpenVRMode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shadow-lg bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-sky-500/20 hover:from-purple-500/30 hover:to-sky-500/30 text-purple-300 border-purple-500/50 shadow-purple-950/40"
              title="Enter Full-Screen Immersive Virtual Reality (VR) Headset Mode"
            >
              <Glasses className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>VR Headset</span>
            </button>
          )}

          <button
            id={`btn_toggle_ultrasound_${viewerId}`}
            onClick={() => onUpdateSettings({ ultrasoundMode: !settings.ultrasoundMode })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border shadow-lg ${
              settings.ultrasoundMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-900/40'
                : 'bg-slate-900/85 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Toggle B-Mode Clinical Ultrasound Simulation"
          >
            <Radio className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Ultrasound</span>
          </button>

          <button
            id={`btn_toggle_autorotate_${viewerId}`}
            onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
            className={`w-7 sm:w-8 h-7 sm:h-8 bg-slate-900/85 border border-slate-700 rounded-lg flex items-center justify-center text-xs transition-all hover:text-white shadow-lg ${
              settings.autoRotate
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle 360° Orbit Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${settings.autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            id={`btn_toggle_wireframe_${viewerId}`}
            onClick={() => onUpdateSettings({ wireframe: !settings.wireframe })}
            className={`w-7 sm:w-8 h-7 sm:h-8 bg-slate-900/85 border border-slate-700 rounded-lg flex items-center justify-center text-xs transition-all hover:text-white shadow-lg ${
              settings.wireframe
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Wireframe Mesh Topology"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hovered Hotspot Callout Card */}
      {hoveredHotspot && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-slate-900/95 backdrop-blur-md border border-sky-500/50 px-4 py-2.5 rounded-xl shadow-2xl text-center max-w-sm">
          <p className="text-xs font-bold text-sky-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            {hoveredHotspot.name}
          </p>
          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{hoveredHotspot.shortDesc}</p>
          <span className="text-[10px] text-sky-400/80 font-mono mt-1 block">Click 3D Pin for Clinical Monograph</span>
        </div>
      )}

      {/* Bottom Floating Bar: Anatomical Cross-Section Slicing & Camera Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Anatomical Cross-Section Cutter */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs shadow-lg">
          <Scissors className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 font-medium text-[11px] hidden sm:inline">Section Plane:</span>
          <div className="flex items-center gap-1">
            {(['none', 'sagittal', 'transverse', 'coronal'] as const).map((plane) => (
              <button
                key={plane}
                id={`btn_cut_${plane}`}
                onClick={() => onUpdateSettings({ cutawayPlane: plane })}
                className={`px-2 py-1 rounded-md text-[11px] capitalize font-medium transition-all ${
                  settings.cutawayPlane === plane
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {plane}
              </button>
            ))}
          </div>

          {settings.cutawayPlane !== 'none' && (
            <input
              id="slider_cut_offset"
              type="range"
              min="-1.5"
              max="1.5"
              step="0.05"
              value={settings.cutawayOffset}
              onChange={(e) => onUpdateSettings({ cutawayOffset: parseFloat(e.target.value) })}
              className="w-20 sm:w-28 accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              title="Dissection Slicing Depth"
            />
          )}
        </div>

        {/* Camera Views & Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-lg">
          {(['front', 'side', 'dorsal', 'close'] as const).map((v) => (
            <button
              key={v}
              id={`btn_cam_${v}`}
              onClick={() => setCameraView(v)}
              className={`px-2.5 py-1 rounded-lg text-[11px] capitalize transition-all ${
                activeCameraView === v
                  ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {v}
            </button>
          ))}
          <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />
          <button
            id="btn_zoom_in"
            onClick={zoomIn}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn_zoom_out"
            onClick={zoomOut}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn_reset_cam"
            onClick={resetCamera}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Reset Camera Orientation"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
