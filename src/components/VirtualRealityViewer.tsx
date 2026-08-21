import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EmbryoStage, HotspotPin, ViewerSettings } from '../types';
import { buildEmbryo3DModel } from '../utils/embryoModelBuilder';
import {
  Glasses,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  RotateCw,
  Layers,
  Scissors,
  Eye,
  Sliders,
  Sparkles,
  Heart,
  Compass,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Info,
  HelpCircle,
  Zap,
  Grid,
  Activity,
  Smartphone,
  Headphones
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStage: EmbryoStage;
  allStages: EmbryoStage[];
  onSelectStage: (stage: EmbryoStage) => void;
  onSelectHotspot?: (hotspot: HotspotPin) => void;
}

type VRDisplayMode = 'sbs' | 'mono' | 'webxr';

export const VirtualRealityViewer: React.FC<Props> = ({
  isOpen,
  onClose,
  currentStage,
  allStages,
  onSelectStage,
  onSelectHotspot
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const leftCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rightCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const monoCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const hotspotObjectsRef = useRef<{ id: string; mesh: THREE.Group; hotspot: HotspotPin }[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // VR Modes & Settings
  const [displayMode, setDisplayMode] = useState<VRDisplayMode>('sbs');
  const [ipdOffset, setIpdOffset] = useState<number>(0.064); // 64mm standard human IPD
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(40); // 40x macro default for VR inspection
  const [isLifeSize, setIsLifeSize] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [cutawayPlane, setCutawayPlane] = useState<'none' | 'sagittal' | 'transverse' | 'coronal'>('none');
  const [cutawayOffset, setCutawayOffset] = useState<number>(0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [isHeartbeatAudioOn, setIsHeartbeatAudioOn] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(null);
  const [gazeProgress, setGazeProgress] = useState<number>(0);
  const [showHelpGuide, setShowHelpGuide] = useState<boolean>(false);
  const [isWebXRSupported, setIsWebXRSupported] = useState<boolean>(false);
  const [isGyroActive, setIsGyroActive] = useState<boolean>(false);
  const [isStageMenuOpen, setIsStageMenuOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Orientation & Head Tracking State
  const headEulerRef = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0, 'YXZ'));
  const targetEulerRef = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isPointerDownRef = useRef<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const gazeTargetRef = useRef<{ id: string; startTime: number; hotspot: HotspotPin } | null>(null);

  // Doppler Audio Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const heartbeatTimerRef = useRef<number | null>(null);

  // Check WebXR API support on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr?.isSessionSupported?.('immersive-vr')?.then((supported: boolean) => {
        setIsWebXRSupported(supported);
      }).catch(() => {
        setIsWebXRSupported(false);
      });
    }
  }, []);

  // Doppler Heartbeat Synthesizer
  const playHeartSound = useCallback((bpm: number) => {
    if (!isHeartbeatAudioOn || !bpm || bpm <= 0) return;

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // "Lub" Sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);

      // "Dub" Sound
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter2 = ctx.createBiquadFilter();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(100, now + 0.13);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.19);

      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(170, now + 0.13);

      gain2.gain.setValueAtTime(0.0001, now + 0.13);
      gain2.gain.linearRampToValueAtTime(0.2, now + 0.145);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.13);
      osc2.stop(now + 0.23);
    } catch {
      // Audio playback suspended
    }
  }, [isHeartbeatAudioOn]);

  useEffect(() => {
    if (!isOpen || !isHeartbeatAudioOn) {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      return;
    }

    const bpm = currentStage.heartRateBpm || 0;
    if (bpm > 0) {
      playHeartSound(bpm);
      const intervalMs = (60 / bpm) * 1000;
      const timer = window.setInterval(() => {
        playHeartSound(bpm);
      }, intervalMs);
      heartbeatTimerRef.current = timer;
      return () => clearInterval(timer);
    }
  }, [isOpen, isHeartbeatAudioOn, currentStage.heartRateBpm, playHeartSound]);

  // Request Device Orientation (Gyroscope) for VR Head Tracking
  const requestGyroscopePermission = useCallback(() => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission().then((res: string) => {
        if (res === 'granted') {
          setIsGyroActive(true);
        }
      }).catch(() => {
        setIsGyroActive(false);
      });
    } else {
      setIsGyroActive(true);
    }
  }, []);

  // Listen to device orientation when gyro is active
  useEffect(() => {
    if (!isOpen || !isGyroActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null && e.gamma !== null) {
        const x = THREE.MathUtils.degToRad(e.beta - 90);
        const y = THREE.MathUtils.degToRad(-e.alpha);
        const z = THREE.MathUtils.degToRad(-e.gamma);

        targetEulerRef.current.set(
          THREE.MathUtils.clamp(x, -Math.PI / 2.5, Math.PI / 2.5),
          y,
          0
        );
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isOpen, isGyroActive]);

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onClose();
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        setIsHeartbeatAudioOn((prev) => !prev);
      } else if (e.code === 'KeyR') {
        // Recenter head orientation
        headEulerRef.current.set(0, 0, 0);
        targetEulerRef.current.set(0, 0, 0);
      } else if (e.code === 'ArrowRight') {
        const currentIndex = allStages.findIndex(s => s.id === currentStage.id);
        if (currentIndex < allStages.length - 1) onSelectStage(allStages[currentIndex + 1]);
      } else if (e.code === 'ArrowLeft') {
        const currentIndex = allStages.findIndex(s => s.id === currentStage.id);
        if (currentIndex > 0) onSelectStage(allStages[currentIndex - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allStages, currentStage, onSelectStage, onClose]);

  // Three.js Scene Setup & Model Construction
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050814); // Deep immersive sci-fi cosmic void
    scene.fog = new THREE.FogExp2(0x050814, 0.04);

    // 2. Cameras: Left Eye, Right Eye, and Center Mono Camera
    const fov = 75;
    const aspect = width / height;
    const near = 0.1;
    const far = 100;

    const monoCam = new THREE.PerspectiveCamera(fov, aspect, near, far);
    monoCam.position.set(0, 0, 0);
    monoCameraRef.current = monoCam;

    const leftCam = new THREE.PerspectiveCamera(fov, (aspect / 2), near, far);
    leftCam.position.set(-ipdOffset / 2, 0, 0);
    leftCameraRef.current = leftCam;

    const rightCam = new THREE.PerspectiveCamera(fov, (aspect / 2), near, far);
    rightCam.position.set(ipdOffset / 2, 0, 0);
    rightCameraRef.current = rightCam;

    // 3. Renderer with local clipping enabled
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. VR Space Ambient Environment: Holographic Pedestal, Grid, Starfield
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.2);
    dirLight2.position.set(-6, -4, -5);
    scene.add(dirLight2);

    const spotLight = new THREE.SpotLight(0xffffff, 2.5);
    spotLight.position.set(0, 8, 2);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    scene.add(spotLight);

    // Holographic Circular Platform / Pedestal
    const platformGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.15, 36);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.15
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, -1.8, -3.5);
    scene.add(platform);

    // Glowing Concentric Ring
    const ringGeo = new THREE.RingGeometry(1.9, 2.1, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, -1.72, -3.5);
    scene.add(ring);

    // Spatial Grid Floor
    const gridHelper = new THREE.GridHelper(20, 20, 0x0284c7, 0x1e293b);
    gridHelper.position.set(0, -1.82, -3.5);
    scene.add(gridHelper);

    // Ambient floating starfield / particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 5. Build 3D Embryo Mesh Model for VR
    const viewerSettings: Partial<ViewerSettings> = {
      cutawayPlane,
      cutawayOffset,
      wireframe,
      ultrasoundMode: false
    };

    const { group: modelGroup, heartMesh } = buildEmbryo3DModel(currentStage, viewerSettings, { isAR: true });
    modelGroupRef.current = modelGroup;
    heartMeshRef.current = heartMesh;

    // Center model in front of user's eye-line in VR space (Z = -3.5)
    modelGroup.position.set(0, 0, -3.5);

    // Apply scale multiplier: Life-Size vs Macro Exploration
    const effectiveScale = isLifeSize
      ? Math.max(0.12, (currentStage.crlMm || 10) * 0.05)
      : Math.max(0.6, (scaleMultiplier / 35));
    modelGroup.scale.set(effectiveScale, effectiveScale, effectiveScale);

    scene.add(modelGroup);

    // 6. Build 3D Interactive Hotspot Pins in VR Space
    hotspotObjectsRef.current = [];
    if (showHotspots && currentStage.hotspots && currentStage.hotspots.length > 0) {
      currentStage.hotspots.forEach((hs) => {
        const hsGroup = new THREE.Group();

        // Glowing 3D Sphere Marker
        const sphereGeo = new THREE.SphereGeometry(0.06, 16, 16);
        let pinColor = 0x38bdf8;
        if (hs.germLayer === 'ectoderm') pinColor = 0x38bdf8;
        else if (hs.germLayer === 'mesoderm') pinColor = 0xf59e0b;
        else if (hs.germLayer === 'endoderm') pinColor = 0x22c55e;
        else if (hs.germLayer === 'neural_crest') pinColor = 0xc084fc;

        const sphereMat = new THREE.MeshStandardMaterial({
          color: pinColor,
          emissive: pinColor,
          emissiveIntensity: 0.8,
          roughness: 0.2,
          metalness: 0.5
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        hsGroup.add(sphere);

        // Surrounding Pulsing Ring
        const ringGeo2 = new THREE.RingGeometry(0.08, 0.11, 24);
        const ringMat2 = new THREE.MeshBasicMaterial({
          color: pinColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75
        });
        const pulseRing = new THREE.Mesh(ringGeo2, ringMat2);
        pulseRing.name = 'pulse_ring';
        hsGroup.add(pulseRing);

        // Position scaled to model coordinates
        const [x, y, z] = hs.position;
        hsGroup.position.set(
          x * effectiveScale,
          y * effectiveScale,
          z * effectiveScale
        );

        modelGroup.add(hsGroup);
        hotspotObjectsRef.current.push({
          id: hs.id,
          mesh: hsGroup,
          hotspot: hs
        });
      });
    }

    // 7. Raycaster for Gaze Reticle in VR
    const raycaster = new THREE.Raycaster();
    const centerVec = new THREE.Vector2(0, 0);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth Head Tracking Interpolation
      headEulerRef.current.x = THREE.MathUtils.lerp(headEulerRef.current.x, targetEulerRef.current.x, 0.15);
      headEulerRef.current.y = THREE.MathUtils.lerp(headEulerRef.current.y, targetEulerRef.current.y, 0.15);
      headEulerRef.current.z = THREE.MathUtils.lerp(headEulerRef.current.z, targetEulerRef.current.z, 0.15);

      // Rotate camera rig according to head orientation
      if (monoCameraRef.current) monoCameraRef.current.quaternion.setFromEuler(headEulerRef.current);
      if (leftCameraRef.current) {
        leftCameraRef.current.quaternion.setFromEuler(headEulerRef.current);
        leftCameraRef.current.position.set(-ipdOffset / 2, 0, 0).applyEuler(headEulerRef.current);
      }
      if (rightCameraRef.current) {
        rightCameraRef.current.quaternion.setFromEuler(headEulerRef.current);
        rightCameraRef.current.position.set(ipdOffset / 2, 0, 0).applyEuler(headEulerRef.current);
      }

      // Auto-Rotation of Model in VR Space
      if (autoRotate && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += delta * 0.4;
      }

      // Heartbeat 3D Mesh Pulsation
      if (heartMeshRef.current && currentStage.heartRateBpm && currentStage.heartRateBpm > 0) {
        const bpm = currentStage.heartRateBpm;
        const freq = (bpm / 60) * Math.PI * 2;
        const pulse = 1.0 + Math.sin(elapsedTime * freq) * 0.12;
        heartMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // Hotspot Billboarding & Pulse Animation
      hotspotObjectsRef.current.forEach((item) => {
        const pulseRing = item.mesh.getObjectByName('pulse_ring');
        if (pulseRing) {
          const s = 1.0 + Math.sin(elapsedTime * 4 + Number(item.id.charCodeAt(0))) * 0.25;
          pulseRing.scale.set(s, s, s);
        }
      });

      // Ambient Floating Particles Drift
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.02;
      }

      // Gaze Raycasting Interaction
      const activeCam = monoCameraRef.current || leftCameraRef.current;
      if (activeCam && hotspotObjectsRef.current.length > 0) {
        raycaster.setFromCamera(centerVec, activeCam);
        const intersectableMeshes: THREE.Object3D[] = [];
        hotspotObjectsRef.current.forEach(h => {
          h.mesh.traverse(child => {
            if ((child as THREE.Mesh).isMesh) intersectableMeshes.push(child);
          });
        });

        const intersects = raycaster.intersectObjects(intersectableMeshes, true);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object;
          const found = hotspotObjectsRef.current.find(h => {
            let matches = false;
            h.mesh.traverse(c => { if (c === hitMesh) matches = true; });
            return matches;
          });

          if (found) {
            if (!gazeTargetRef.current || gazeTargetRef.current.id !== found.id) {
              gazeTargetRef.current = { id: found.id, startTime: performance.now(), hotspot: found.hotspot };
            } else {
              const elapsedGaze = performance.now() - gazeTargetRef.current.startTime;
              const progress = Math.min(100, (elapsedGaze / 1200) * 100);
              setGazeProgress(progress);
              if (progress >= 100) {
                setSelectedHotspot(found.hotspot);
                if (onSelectHotspot) onSelectHotspot(found.hotspot);
                gazeTargetRef.current = null;
                setGazeProgress(0);
              }
            }
          }
        } else {
          if (gazeTargetRef.current) {
            gazeTargetRef.current = null;
            setGazeProgress(0);
          }
        }
      }

      // Render Viewport(s)
      const currentWidth = container.clientWidth || window.innerWidth;
      const currentHeight = container.clientHeight || window.innerHeight;

      if (displayMode === 'sbs' && leftCameraRef.current && rightCameraRef.current) {
        // Dual Stereoscopic Viewports (Side-by-Side Left & Right Eye)
        const halfWidth = Math.floor(currentWidth / 2);

        renderer.setScissorTest(true);

        // Left Eye Viewport
        renderer.setViewport(0, 0, halfWidth, currentHeight);
        renderer.setScissor(0, 0, halfWidth, currentHeight);
        leftCameraRef.current.aspect = halfWidth / currentHeight;
        leftCameraRef.current.updateProjectionMatrix();
        renderer.render(scene, leftCameraRef.current);

        // Right Eye Viewport
        renderer.setViewport(halfWidth, 0, halfWidth, currentHeight);
        renderer.setScissor(halfWidth, 0, halfWidth, currentHeight);
        rightCameraRef.current.aspect = halfWidth / currentHeight;
        rightCameraRef.current.updateProjectionMatrix();
        renderer.render(scene, rightCameraRef.current);

        renderer.setScissorTest(false);
      } else if (monoCameraRef.current) {
        // Fullscreen Monoscopic 360 Spatial Viewport
        renderer.setViewport(0, 0, currentWidth, currentHeight);
        monoCameraRef.current.aspect = currentWidth / currentHeight;
        monoCameraRef.current.updateProjectionMatrix();
        renderer.render(scene, monoCameraRef.current);
      }
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [
    isOpen,
    currentStage,
    displayMode,
    ipdOffset,
    scaleMultiplier,
    isLifeSize,
    autoRotate,
    showHotspots,
    cutawayPlane,
    cutawayOffset,
    wireframe,
    onSelectHotspot
  ]);

  // Touch / Drag Navigation when not using Gyroscope
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.004;
    targetEulerRef.current.y -= deltaX * sensitivity;
    targetEulerRef.current.x -= deltaY * sensitivity;
    targetEulerRef.current.x = THREE.MathUtils.clamp(
      targetEulerRef.current.x,
      -Math.PI / 2.2,
      Math.PI / 2.2
    );
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  if (!isOpen) return null;

  return (
    <div
      id="embryo_virtual_reality_modal"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between select-none overflow-hidden touch-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Center Dual-Eye Dividing Line (in SBS mode) */}
      {displayMode === 'sbs' && (
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-sky-500/20 pointer-events-none z-10 hidden sm:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-950/80 border border-sky-500/40 text-[9px] font-mono text-sky-400">
            VR
          </div>
        </div>
      )}

      {/* Center 3D Gaze Reticle (Crosshair) */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
        {displayMode === 'sbs' ? (
          <div className="w-full flex justify-around">
            {/* Left Eye Reticle */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)]" />
              {gazeProgress > 0 && (
                <svg className="absolute inset-0 w-6 h-6 -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="62.8"
                    strokeDashoffset={62.8 - (62.8 * gazeProgress) / 100}
                    className="transition-all duration-75"
                  />
                </svg>
              )}
            </div>

            {/* Right Eye Reticle */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)]" />
              {gazeProgress > 0 && (
                <svg className="absolute inset-0 w-6 h-6 -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="62.8"
                    strokeDashoffset={62.8 - (62.8 * gazeProgress) / 100}
                    className="transition-all duration-75"
                  />
                </svg>
              )}
            </div>
          </div>
        ) : (
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)]" />
            {gazeProgress > 0 && (
              <svg className="absolute inset-0 w-6 h-6 -rotate-90">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="62.8"
                  strokeDashoffset={62.8 - (62.8 * gazeProgress) / 100}
                  className="transition-all duration-75"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Top Floating Telemetry & VR Bar */}
      <div className="relative z-30 w-full p-3 md:p-5 flex items-center justify-between pointer-events-none">
        {/* Left: Active Stage Telemetry Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-sky-500/30 rounded-2xl px-3 py-1.5 shadow-xl text-xs">
          <div className="p-1 rounded-lg bg-sky-500/20 text-sky-400">
            <Glasses className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs">{currentStage.title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-sky-500/20 text-sky-300 rounded border border-sky-500/40">
                {currentStage.crlMm} mm
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Day {currentStage.dayStart} • {displayMode === 'sbs' ? 'Headset Stereoscopic (SBS)' : '360° Spatial Mono'}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 md:gap-2">
          {/* Gyroscope / Head Tracking Request Button */}
          {!isGyroActive && (
            <button
              id="btn_vr_enable_gyro"
              onClick={requestGyroscopePermission}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-indigo-300 text-xs font-bold transition-all shadow-md shadow-indigo-950/50"
              title="Enable Device Gyroscope for 360° Head Tracking"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Enable Gyro</span>
            </button>
          )}

          {/* Display Mode Selector (SBS vs Mono 360) */}
          <div className="flex items-center bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-1 gap-1 text-xs">
            <button
              id="btn_vr_mode_sbs"
              onClick={() => setDisplayMode('sbs')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                displayMode === 'sbs'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Stereoscopic Side-by-Side for VR Headset / Cardboard"
            >
              Headset SBS
            </button>

            <button
              id="btn_vr_mode_mono"
              onClick={() => setDisplayMode('mono')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                displayMode === 'mono'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full-Screen 360 Monoscopic Spatial View"
            >
              360° Spatial
            </button>
          </div>

          {/* Doppler Cardiac Pulse Audio Toggle */}
          <button
            id="btn_vr_heartbeat_audio"
            onClick={() => setIsHeartbeatAudioOn(!isHeartbeatAudioOn)}
            className={`p-2 rounded-xl border transition-all ${
              isHeartbeatAudioOn
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-md shadow-rose-950'
                : 'bg-slate-950/85 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isHeartbeatAudioOn ? 'Mute Heartbeat Audio' : 'Unmute Doppler Heartbeat Audio'}
          >
            {isHeartbeatAudioOn ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="btn_vr_fullscreen"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close VR Mode */}
          <button
            id="btn_vr_close"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950/85 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-all"
            title="Exit VR Mode (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating 3D Hotspot Inspection Card (If Selected in VR) */}
      {selectedHotspot && (
        <div className="relative z-30 max-w-lg w-[90%] mx-auto bg-slate-950/95 backdrop-blur-xl border border-sky-500/50 rounded-2xl p-4 shadow-[0_0_40px_rgba(56,189,248,0.25)] text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">{selectedHotspot.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  {selectedHotspot.germLayer.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedHotspot.shortDesc}</p>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 space-y-2">
            <p className="text-slate-300 leading-relaxed">{selectedHotspot.fullDesc}</p>
            {selectedHotspot.clinicalSignificance && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 text-[11px] text-amber-200">
                <span className="font-bold">Clinical Impact: </span>
                {selectedHotspot.clinicalSignificance}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom VR Spatial Controls Dock */}
      <div className="relative z-30 w-full p-3 md:p-5 flex flex-col items-center gap-2 pointer-events-none">
        {/* Floating In-VR Toolbar */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 md:gap-2.5 bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-2 shadow-2xl">
          {/* Previous Stage */}
          <button
            id="btn_vr_prev_stage"
            onClick={() => {
              const idx = allStages.findIndex(s => s.id === currentStage.id);
              if (idx > 0) onSelectStage(allStages[idx - 1]);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
            title="Previous Stage (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Stage Selector Drawer Trigger */}
          <button
            id="btn_vr_stage_selector"
            onClick={() => setIsStageMenuOpen(!isStageMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CS {currentStage.carnegieStage || 'Stage'} ({currentStage.week} Wk)</span>
          </button>

          {/* Next Stage */}
          <button
            id="btn_vr_next_stage"
            onClick={() => {
              const idx = allStages.findIndex(s => s.id === currentStage.id);
              if (idx < allStages.length - 1) onSelectStage(allStages[idx + 1]);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
            title="Next Stage (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Scale Toggle: Macro vs 1:1 Life Size */}
          <button
            id="btn_vr_toggle_scale"
            onClick={() => setIsLifeSize(!isLifeSize)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isLifeSize
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Toggle between 1:1 Life Size and Macro Exploration"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLifeSize ? '1:1 Life Size' : `${scaleMultiplier}x Macro`}</span>
          </button>

          {/* Cross-Section Slicing Tool */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
            <button
              onClick={() => setCutawayPlane(cutawayPlane === 'sagittal' ? 'none' : 'sagittal')}
              className={`px-2 py-1 rounded-lg transition-all ${
                cutawayPlane === 'sagittal' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sagittal Slicing Plane"
            >
              Sagittal
            </button>
            <button
              onClick={() => setCutawayPlane(cutawayPlane === 'transverse' ? 'none' : 'transverse')}
              className={`px-2 py-1 rounded-lg transition-all ${
                cutawayPlane === 'transverse' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Transverse Slicing Plane"
            >
              Transverse
            </button>
          </div>

          {/* Auto-Rotation Toggle */}
          <button
            id="btn_vr_auto_rotate"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl border transition-all ${
              autoRotate
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Auto-Rotation in VR Space"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          {/* Recenter Camera View */}
          <button
            id="btn_vr_recenter"
            onClick={() => {
              headEulerRef.current.set(0, 0, 0);
              targetEulerRef.current.set(0, 0, 0);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Recenter Headset Perspective (R)"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* IPD Slider for Headset Calibration in SBS Mode */}
        {displayMode === 'sbs' && (
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-xl px-3 py-1 text-[11px] text-slate-400">
            <span>IPD Lens Separation:</span>
            <input
              type="range"
              min="0.050"
              max="0.075"
              step="0.002"
              value={ipdOffset}
              onChange={(e) => setIpdOffset(parseFloat(e.target.value))}
              className="w-24 accent-sky-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-sky-400">{(ipdOffset * 1000).toFixed(0)} mm</span>
          </div>
        )}
      </div>

      {/* Stage Selector Drawer (Modal Popover) */}
      {isStageMenuOpen && (
        <div className="absolute inset-x-4 bottom-20 z-40 max-w-2xl mx-auto bg-slate-950/95 backdrop-blur-2xl border border-sky-500/40 rounded-3xl p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Select Embryonic Stage for VR Immersion
            </h4>
            <button
              onClick={() => setIsStageMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
            {allStages.map((stg) => {
              const isSelected = stg.id === currentStage.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    onSelectStage(stg);
                    setIsStageMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-500 text-sky-200 font-bold shadow-md shadow-sky-950'
                      : 'bg-slate-900/70 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold text-white truncate">{stg.title}</div>
                  <div className="text-[10px] font-mono text-slate-400">Day {stg.dayStart} • {stg.crlMm}mm</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
