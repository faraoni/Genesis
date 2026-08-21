import * as THREE from 'three';
import { EmbryoStage, ViewerSettings } from '../types';

export interface ModelBuildResult {
  group: THREE.Group;
  heartMesh: THREE.Mesh | null;
}

export function buildEmbryo3DModel(
  stage: EmbryoStage,
  settings: Partial<ViewerSettings> = {},
  options: { isAR?: boolean } = {}
): ModelBuildResult {
  const group = new THREE.Group();
  group.name = 'embryo_model_group';
  let heartMesh: THREE.Mesh | null = null;

  // Clipping planes setup
  const clippingPlanes: THREE.Plane[] = [];
  const cutawayPlane = settings.cutawayPlane || 'none';
  const cutawayOffset = settings.cutawayOffset ?? 0;
  const wireframe = !!settings.wireframe;
  const ultrasoundMode = !!settings.ultrasoundMode;

  if (cutawayPlane === 'sagittal') {
    clippingPlanes.push(new THREE.Plane(new THREE.Vector3(1, 0, 0), cutawayOffset));
  } else if (cutawayPlane === 'transverse') {
    clippingPlanes.push(new THREE.Plane(new THREE.Vector3(0, 1, 0), cutawayOffset));
  } else if (cutawayPlane === 'coronal') {
    clippingPlanes.push(new THREE.Plane(new THREE.Vector3(0, 0, 1), cutawayOffset));
  }

  // Material helper
  const createMaterial = (
    color: number,
    opacity = 1.0,
    roughness = 0.4,
    metalness = 0.1,
    transparent = false
  ) => {
    if (ultrasoundMode) {
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
      roughness: options.isAR ? Math.max(0.2, roughness * 0.8) : roughness,
      metalness: options.isAR ? metalness + 0.05 : metalness,
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

        // Nucleus
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

    case 'morula': {
      // Zona pellucida
      const zpGeo = new THREE.SphereGeometry(1.6, 32, 32);
      const zpMat = createMaterial(0xa5f3fc, 0.25, 0.1, 0.0, true);
      const zpMesh = new THREE.Mesh(zpGeo, zpMat);
      group.add(zpMesh);

      // 16 tightly compacted spherical blastomeres in a mulberry arrangement
      for (let i = 0; i < 16; i++) {
        const phi = Math.acos(-1 + (2 * i) / 16);
        const theta = Math.sqrt(16 * Math.PI) * phi;
        const x = 0.8 * Math.cos(theta) * Math.sin(phi);
        const y = 0.8 * Math.sin(theta) * Math.sin(phi);
        const z = 0.8 * Math.cos(phi);

        const bGeo = new THREE.SphereGeometry(0.42, 16, 16);
        const bMat = createMaterial(0x38bdf8, 0.9, 0.3, 0.05, true);
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(x, y, z);
        group.add(bMesh);
      }
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

      // Connecting stalk
      const stalkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 16);
      const stalkMesh = new THREE.Mesh(stalkGeo, mesoMat);
      stalkMesh.position.set(-1.0, 0.4, 0);
      stalkMesh.rotation.z = Math.PI / 3;
      group.add(stalkMesh);
      break;
    }

    case 'trilaminar_gastrula': {
      // 3 Distinct Germ Layers (Trilaminar disc)
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

      // Hensen's Node
      const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const nodeMesh = new THREE.Mesh(nodeGeo, streakMat);
      nodeMesh.position.set(0, 0.45, 0.7);
      group.add(nodeMesh);

      // Mesoderm
      const mesoGeo = new THREE.BoxGeometry(2.3, 0.25, 1.4);
      const mesoMesh = new THREE.Mesh(mesoGeo, mesoMat);
      mesoMesh.position.set(0, 0.05, 0);
      group.add(mesoMesh);

      // Notochord rod
      const notochordGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
      const notoMat = createMaterial(0xef4444, 1.0, 0.3, 0.2);
      const notoMesh = new THREE.Mesh(notochordGeo, notoMat);
      notoMesh.rotation.x = Math.PI / 2;
      notoMesh.position.set(0, 0.05, -0.1);
      group.add(notoMesh);

      // Endoderm
      const endoGeo = new THREE.BoxGeometry(2.2, 0.2, 1.3);
      const endoMesh = new THREE.Mesh(endoGeo, endoMat);
      endoMesh.position.set(0, -0.2, 0);
      group.add(endoMesh);
      break;
    }

    case 'neurula_week4': {
      // C-shaped curved embryo body with prominent somites, neural tube & heart tube
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 1.5, -0.2),
        new THREE.Vector3(0, 0.8, 0.9),
        new THREE.Vector3(0, -0.8, 0.7),
        new THREE.Vector3(0, -1.3, -0.4)
      );

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

      // Cranial Head Fold
      const cranialHeadGeo = new THREE.SphereGeometry(0.7, 24, 24);
      const cranialHeadMesh = new THREE.Mesh(cranialHeadGeo, neuralMat);
      cranialHeadMesh.position.set(0, 1.5, 0.1);
      cranialHeadMesh.scale.set(0.9, 1.1, 1.0);
      group.add(cranialHeadMesh);

      // Segmented Somites
      for (let i = 0; i < 16; i++) {
        const t = 0.15 + (i / 16) * 0.7;
        const pt = curve.getPoint(t);
        const sGeo = new THREE.BoxGeometry(0.2, 0.15, 0.18);
        const sLeft = new THREE.Mesh(sGeo, somiteMat);
        sLeft.position.set(0.4, pt.y, pt.z - 0.2);
        const sRight = new THREE.Mesh(sGeo, somiteMat);
        sRight.position.set(-0.4, pt.y, pt.z - 0.2);
        group.add(sLeft, sRight);
      }

      // Heart Tube Bulge
      const heartGeo = new THREE.SphereGeometry(0.45, 24, 24);
      const hMesh = new THREE.Mesh(heartGeo, heartMat);
      hMesh.position.set(0, 0.3, 0.65);
      hMesh.scale.set(1.1, 1.3, 0.9);
      heartMesh = hMesh;
      group.add(hMesh);

      // Branchial Arches
      for (let i = 0; i < 3; i++) {
        const archGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16);
        const archMat = createMaterial(0xa855f7, 0.95, 0.3, 0.1);
        const archMesh = new THREE.Mesh(archGeo, archMat);
        archMesh.rotation.z = Math.PI / 2;
        archMesh.position.set(0, 0.95 - i * 0.25, 0.45);
        group.add(archMesh);
      }

      // Yolk stalk
      const yolkStalkGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.0, 16);
      const yolkStalkMesh = new THREE.Mesh(yolkStalkGeo, yolkMat);
      yolkStalkMesh.position.set(0, -0.4, 1.0);
      yolkStalkMesh.rotation.x = Math.PI / 3;
      group.add(yolkStalkMesh);
      break;
    }

    case 'organogenesis_week5':
    case 'organogenesis_week6': {
      // Main Head Form
      const headGeo = new THREE.SphereGeometry(0.9, 24, 24);
      const headMesh = new THREE.Mesh(headGeo, ectoMat);
      headMesh.position.set(0, 1.2, 0.2);
      headMesh.scale.set(1.0, 1.2, 1.1);
      group.add(headMesh);

      // Secondary brain vesicles
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

      // Upper Limb Buds
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

      // Heart Prominence
      const heartBulgeGeo = new THREE.SphereGeometry(0.55, 24, 24);
      const heartBulgeMesh = new THREE.Mesh(heartBulgeGeo, heartMat);
      heartBulgeMesh.position.set(0, 0.35, 0.7);
      heartMesh = heartBulgeMesh;
      group.add(heartBulgeMesh);

      // Physiological Midgut Herniation
      const herniationGeo = new THREE.TorusGeometry(0.25, 0.12, 16, 24);
      const herniationMesh = new THREE.Mesh(herniationGeo, endoMat);
      herniationMesh.position.set(0, -0.25, 0.95);
      herniationMesh.rotation.x = Math.PI / 2;
      group.add(herniationMesh);

      // Umbilical Cord
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
    case 'term_week38':
    default: {
      // Full Fetal Morphological Silhouette
      const scaleFactor = stage.modelType === 'fetus_week8' ? 0.9 :
                         stage.modelType === 'fetus_week12' ? 1.05 :
                         stage.modelType === 'fetus_week20' ? 1.2 :
                         stage.modelType === 'fetus_week28' ? 1.35 : 1.45;

      // Fetal Head
      const fHeadGeo = new THREE.SphereGeometry(1.0 * scaleFactor, 32, 32);
      const fHeadMesh = new THREE.Mesh(fHeadGeo, ectoMat);
      fHeadMesh.position.set(0, 1.1 * scaleFactor, 0.1);
      fHeadMesh.scale.set(0.9, 1.15, 1.05);
      group.add(fHeadMesh);

      // Nose
      const noseGeo = new THREE.ConeGeometry(0.18 * scaleFactor, 0.35 * scaleFactor, 16);
      const noseMesh = new THREE.Mesh(noseGeo, ectoMat);
      noseMesh.position.set(0, 0.95 * scaleFactor, 1.05 * scaleFactor);
      noseMesh.rotation.x = Math.PI / 3;
      group.add(noseMesh);

      // Eyes
      const fEyeGeo = new THREE.SphereGeometry(0.2 * scaleFactor, 16, 16);
      const fLeftEye = new THREE.Mesh(fEyeGeo, eyeMat);
      fLeftEye.position.set(0.55 * scaleFactor, 1.05 * scaleFactor, 0.85 * scaleFactor);
      const fRightEye = new THREE.Mesh(fEyeGeo, eyeMat);
      fRightEye.position.set(-0.55 * scaleFactor, 1.05 * scaleFactor, 0.85 * scaleFactor);
      group.add(fLeftEye, fRightEye);

      // Ears
      const earGeo = new THREE.TorusGeometry(0.2 * scaleFactor, 0.08 * scaleFactor, 12, 16);
      const leftEar = new THREE.Mesh(earGeo, ectoMat);
      leftEar.position.set(0.9 * scaleFactor, 1.1 * scaleFactor, 0.0);
      leftEar.rotation.y = Math.PI / 2;
      const rightEar = new THREE.Mesh(earGeo, ectoMat);
      rightEar.position.set(-0.9 * scaleFactor, 1.1 * scaleFactor, 0.0);
      rightEar.rotation.y = -Math.PI / 2;
      group.add(leftEar, rightEar);

      // Body
      const bodyGeo = new THREE.CylinderGeometry(
        0.8 * scaleFactor,
        0.7 * scaleFactor,
        1.8 * scaleFactor,
        24
      );
      const fBodyMesh = new THREE.Mesh(bodyGeo, ectoMat);
      fBodyMesh.position.set(0, -0.2 * scaleFactor, 0.1);
      group.add(fBodyMesh);

      // 4-Chamber Heart
      const fHeartGeo = new THREE.SphereGeometry(0.45 * scaleFactor, 24, 24);
      const fHeartMesh = new THREE.Mesh(fHeartGeo, heartMat);
      fHeartMesh.position.set(0, 0.2 * scaleFactor, 0.45 * scaleFactor);
      fHeartMesh.scale.set(1.1, 0.9, 0.9);
      heartMesh = fHeartMesh;
      group.add(fHeartMesh);

      // Lungs
      const lungGeo = new THREE.SphereGeometry(0.35 * scaleFactor, 16, 16);
      const leftLung = new THREE.Mesh(lungGeo, endoMat);
      leftLung.position.set(0.4 * scaleFactor, 0.25 * scaleFactor, 0.35 * scaleFactor);
      const rightLung = new THREE.Mesh(lungGeo, endoMat);
      rightLung.position.set(-0.4 * scaleFactor, 0.25 * scaleFactor, 0.35 * scaleFactor);
      group.add(leftLung, rightLung);

      // Spine
      for (let i = 0; i < 12; i++) {
        const vertGeo = new THREE.CylinderGeometry(0.12 * scaleFactor, 0.12 * scaleFactor, 0.12 * scaleFactor, 12);
        const vertMesh = new THREE.Mesh(vertGeo, somiteMat);
        vertMesh.position.set(0, (0.5 - i * 0.15) * scaleFactor, -0.6 * scaleFactor);
        group.add(vertMesh);
      }

      // Arms & Hands
      const fArmGeo = new THREE.CylinderGeometry(0.18 * scaleFactor, 0.14 * scaleFactor, 0.9 * scaleFactor, 16);
      const fLeftArm = new THREE.Mesh(fArmGeo, ectoMat);
      fLeftArm.position.set(0.9 * scaleFactor, 0.05 * scaleFactor, 0.4 * scaleFactor);
      fLeftArm.rotation.set(0.5, 0.0, -0.4);
      const fRightArm = new THREE.Mesh(fArmGeo, ectoMat);
      fRightArm.position.set(-0.9 * scaleFactor, 0.05 * scaleFactor, 0.4 * scaleFactor);
      fRightArm.rotation.set(0.5, 0.0, 0.4);
      group.add(fLeftArm, fRightArm);

      const handGeo = new THREE.BoxGeometry(0.25 * scaleFactor, 0.35 * scaleFactor, 0.1 * scaleFactor);
      const leftHand = new THREE.Mesh(handGeo, mesoMat);
      leftHand.position.set(0.75 * scaleFactor, -0.4 * scaleFactor, 0.75 * scaleFactor);
      const rightHand = new THREE.Mesh(handGeo, mesoMat);
      rightHand.position.set(-0.75 * scaleFactor, -0.4 * scaleFactor, 0.75 * scaleFactor);
      group.add(leftHand, rightHand);

      // Legs & Feet
      const fLegGeo = new THREE.CylinderGeometry(0.22 * scaleFactor, 0.16 * scaleFactor, 1.0 * scaleFactor, 16);
      const fLeftLeg = new THREE.Mesh(fLegGeo, ectoMat);
      fLeftLeg.position.set(0.6 * scaleFactor, -1.0 * scaleFactor, 0.3 * scaleFactor);
      fLeftLeg.rotation.set(0.8, 0.2, -0.3);
      const fRightLeg = new THREE.Mesh(fLegGeo, ectoMat);
      fRightLeg.position.set(-0.6 * scaleFactor, -1.0 * scaleFactor, 0.3 * scaleFactor);
      fRightLeg.rotation.set(0.8, -0.2, 0.3);
      group.add(fLeftLeg, fRightLeg);

      const footGeo = new THREE.BoxGeometry(0.25 * scaleFactor, 0.15 * scaleFactor, 0.5 * scaleFactor);
      const leftFoot = new THREE.Mesh(footGeo, mesoMat);
      leftFoot.position.set(0.6 * scaleFactor, -1.45 * scaleFactor, 0.65 * scaleFactor);
      const rightFoot = new THREE.Mesh(footGeo, mesoMat);
      rightFoot.position.set(-0.6 * scaleFactor, -1.45 * scaleFactor, 0.65 * scaleFactor);
      group.add(leftFoot, rightFoot);

      // Umbilical Cord
      const fCordCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, -0.4 * scaleFactor, 0.6 * scaleFactor),
        new THREE.Vector3(0.5, -0.8 * scaleFactor, 1.2 * scaleFactor),
        new THREE.Vector3(0, -1.2 * scaleFactor, 1.8 * scaleFactor)
      );
      const fCordGeo = new THREE.TubeGeometry(fCordCurve, 20, 0.15 * scaleFactor, 12, false);
      const fCordMesh = new THREE.Mesh(fCordGeo, cordMat);
      group.add(fCordMesh);
      break;
    }
  }

  return { group, heartMesh };
}
