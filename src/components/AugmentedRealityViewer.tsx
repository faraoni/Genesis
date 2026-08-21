import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EmbryoStage, HotspotPin, ViewerSettings } from '../types';
import { buildEmbryo3DModel } from '../utils/embryoModelBuilder';
import {
  Camera,
  X,
  RotateCw,
  Maximize2,
  Minimize2,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  Scissors,
  Download,
  Info,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Crosshair,
  Sliders,
  Sun,
  Activity,
  AlertCircle,
  HelpCircle,
  Scale,
  Zap,
  Grid
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStage: EmbryoStage;
  allStages: EmbryoStage[];
  onSelectStage: (stage: EmbryoStage) => void;
  onSelectHotspot?: (hotspot: HotspotPin) => void;
}

export const AugmentedRealityViewer: React.FC<Props> = ({
  isOpen,
  onClose,
  currentStage,
  allStages,
  onSelectStage,
  onSelectHotspot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js State
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const reticleMeshRef = useRef<THREE.Mesh | null>(null);
  const shadowPlaneRef = useRef<THREE.Mesh | null>(null);
  const hotspotSpritesRef = useRef<{ id: string; sprite: THREE.Sprite; position: THREE.Vector3; hotspot: HotspotPin }[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Media Stream
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // Interaction State
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(50); // Default 50x magnification for viewing
  const [isLifeSize, setIsLifeSize] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showReticle, setShowReticle] = useState<boolean>(true);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showShadow, setShowShadow] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [cutawayPlane, setCutawayPlane] = useState<'none' | 'sagittal' | 'transverse' | 'coronal'>('none');
  const [cutawayOffset, setCutawayOffset] = useState<number>(0);
  const [isHeartbeatAudioOn, setIsHeartbeatAudioOn] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(null);
  const [showHelpGuide, setShowHelpGuide] = useState<boolean>(false);
  const [isStageDrawerOpen, setIsStageDrawerOpen] = useState<boolean>(false);
  const [isSnapshotProcessing, setIsSnapshotProcessing] = useState<boolean>(false);
  const [snapshotPreviewUrl, setSnapshotPreviewUrl] = useState<string | null>(null);

  // Model Placement Coordinates in AR
  const modelPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, -4.5));
  const modelRotationRef = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0));
  const isDraggingRef = useRef<boolean>(false);
  const previousTouchRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartDistRef = useRef<number | null>(null);

  // Web Audio Context for Heartbeat Doppler sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<number | null>(null);

  // 1. Initialize Camera
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsCameraActive(true);

      // Check if torch/flashlight is supported
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = track.getCapabilities?.() as any;
        if (capabilities && 'torch' in capabilities) {
          setTorchAvailable(true);
        }
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      // Fallback: Try any camera without facingMode constraint
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (fallbackErr: any) {
        console.error('All camera access failed:', fallbackErr);
        setCameraError(
          fallbackErr.name === 'NotAllowedError'
            ? 'Camera permission was denied. Please allow camera access in your browser settings to project the embryo into your room.'
            : 'Unable to start camera feed. You can still interact with the embryo using the simulated laboratory AR environment.'
        );
        setIsCameraActive(false);
      }
    }
  }, []);

  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setIsTorchOn(nextState);
      } catch (e) {
        console.warn('Torch constraint error:', e);
      }
    }
  }, [isTorchOn]);

  // 2. Audio Heartbeat Synthesis
  const startHeartbeatAudio = useCallback(() => {
    if (!currentStage.heartRateBpm) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const bpm = currentStage.heartRateBpm;
      const intervalMs = (60 / bpm) * 1000;

      if (audioIntervalRef.current) {
        window.clearInterval(audioIntervalRef.current);
      }

      const playLubDub = () => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;

        // Lub (First Heart Sound S1)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(80, now);
        osc1.frequency.exponentialRampToValueAtTime(35, now + 0.08);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.08);

        // Dub (Second Heart Sound S2)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(105, now + 0.12);
        osc2.frequency.exponentialRampToValueAtTime(45, now + 0.18);
        gain2.gain.setValueAtTime(0.25, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.18);
      };

      playLubDub();
      audioIntervalRef.current = window.setInterval(playLubDub, intervalMs);
      setIsHeartbeatAudioOn(true);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }, [currentStage]);

  const stopHeartbeatAudio = useCallback(() => {
    if (audioIntervalRef.current) {
      window.clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    setIsHeartbeatAudioOn(false);
  }, []);

  // 3. Setup Three.js Scene
  useEffect(() => {
    if (!isOpen) return;

    startCamera(cameraFacing);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera (matches typical mobile device FOV)
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 0); // User is origin
    cameraRef.current = camera;

    // WebGL Renderer with Alpha transparency for camera pass-through
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true, // Required for AR Snapshot capture
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // AR Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    sunLight.position.set(3, 8, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x90caf9, 0.7);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // Reticle Surface Ring
    const reticleGeo = new THREE.RingGeometry(0.3, 0.35, 32);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.rotation.x = -Math.PI / 2;
    reticleMesh.position.set(0, -1.2, -4.5);
    reticleMeshRef.current = reticleMesh;
    scene.add(reticleMesh);

    // Soft Shadow Catch Plane underneath model
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.2, -4.5);
    shadowPlane.receiveShadow = true;
    shadowPlaneRef.current = shadowPlane;
    scene.add(shadowPlane);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Pulsating Reticle
      if (reticleMeshRef.current && showReticle) {
        const pulse = 1 + Math.sin(elapsedTime * 4) * 0.08;
        reticleMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // Auto Rotation
      if (modelGroupRef.current) {
        if (autoRotate) {
          modelGroupRef.current.rotation.y += 0.01;
        }

        // Cardiac mesh pulse animation
        if (heartMeshRef.current && currentStage.heartRateBpm) {
          const bpm = currentStage.heartRateBpm;
          const freq = (bpm / 60) * Math.PI * 2;
          const beat = Math.pow(Math.sin(elapsedTime * freq), 4);
          const s = 1.0 + beat * 0.18;
          heartMeshRef.current.scale.set(s, s, s);
        }

        // Billboarding for Hotspot Sprites so they always face user camera
        hotspotSpritesRef.current.forEach(({ sprite }) => {
          sprite.quaternion.copy(camera.quaternion);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      stopHeartbeatAudio();
      renderer.dispose();
    };
  }, [isOpen, startCamera, cameraFacing, autoRotate, showReticle, stopHeartbeatAudio, currentStage]);

  // 4. Build or Rebuild 3D Model when Stage or Slicing changes
  useEffect(() => {
    if (!sceneRef.current || !isOpen) return;
    const scene = sceneRef.current;

    // Remove existing model and hotspots
    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
    }
    hotspotSpritesRef.current = [];

    // Calculate effective scale
    // 1 unit in Three.js = 100mm. Stage crlMm:
    // If Life-size: scale = (crlMm / 100) * 0.5 (scaled relative to base model size)
    // If magnified: scale = (crlMm / 100) * (scaleMultiplier / 10)
    const baseModelScale = isLifeSize 
      ? Math.max(0.04, (currentStage.crlMm / 20) * 0.3)
      : Math.max(0.2, (scaleMultiplier / 50));

    const settings: Partial<ViewerSettings> = {
      cutawayPlane,
      cutawayOffset,
      wireframe,
      ultrasoundMode: false
    };

    const { group, heartMesh } = buildEmbryo3DModel(currentStage, settings, { isAR: true });
    heartMeshRef.current = heartMesh;

    group.position.copy(modelPositionRef.current);
    group.rotation.copy(modelRotationRef.current);
    group.scale.set(baseModelScale, baseModelScale, baseModelScale);

    // Build AR Hotspot Sprites
    if (showHotspots && currentStage.hotspots) {
      currentStage.hotspots.forEach((hs) => {
        // Create canvas texture for pin
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 128;
        pCanvas.height = 128;
        const ctx = pCanvas.getContext('2d');
        if (ctx) {
          ctx.beginPath();
          ctx.arc(64, 64, 40, 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.fill();
          ctx.lineWidth = 6;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(64, 64, 18, 0, Math.PI * 2);
          ctx.fillStyle = '#f8fafc';
          ctx.fill();
        }

        const texture = new THREE.CanvasTexture(pCanvas);
        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(0.25, 0.25, 0.25);
        sprite.position.set(hs.position[0], hs.position[1], hs.position[2]);
        group.add(sprite);

        hotspotSpritesRef.current.push({
          id: hs.id,
          sprite,
          position: new THREE.Vector3(hs.position[0], hs.position[1], hs.position[2]),
          hotspot: hs
        });
      });
    }

    modelGroupRef.current = group;
    scene.add(group);
  }, [currentStage, isOpen, isLifeSize, scaleMultiplier, cutawayPlane, cutawayOffset, wireframe, showHotspots]);

  // 5. Touch & Mouse Interaction for AR Manipulation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousTouchRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !previousTouchRef.current || !modelGroupRef.current) return;

    const deltaX = e.clientX - previousTouchRef.current.x;
    const deltaY = e.clientY - previousTouchRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.01;
    modelGroupRef.current.rotation.x += deltaY * 0.01;
    modelRotationRef.current.copy(modelGroupRef.current.rotation);

    previousTouchRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    previousTouchRef.current = null;
  };

  // Tap to reposition / Raycast Hotspot Selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cameraRef.current || !sceneRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    // Check if clicked any hotspot sprite
    const spriteObjects = hotspotSpritesRef.current.map((item) => item.sprite);
    const intersects = raycaster.intersectObjects(spriteObjects, false);

    if (intersects.length > 0) {
      const hitSprite = intersects[0].object as THREE.Sprite;
      const found = hotspotSpritesRef.current.find((item) => item.sprite === hitSprite);
      if (found) {
        setSelectedHotspot(found.hotspot);
        if (onSelectHotspot) onSelectHotspot(found.hotspot);
        return;
      }
    }

    // Otherwise, reposition embryo at reticle plane or tap location in space
    if (showReticle && modelGroupRef.current && reticleMeshRef.current) {
      // Reposition on horizontal plane
      const targetZ = modelPositionRef.current.z;
      const targetX = x * 2.5;
      const targetY = y * 2.0;

      modelGroupRef.current.position.set(targetX, targetY, targetZ);
      modelPositionRef.current.set(targetX, targetY, targetZ);

      if (shadowPlaneRef.current) {
        shadowPlaneRef.current.position.set(targetX, targetY - 1.2, targetZ);
      }
      if (reticleMeshRef.current) {
        reticleMeshRef.current.position.set(targetX, targetY - 1.2, targetZ);
      }
    }
  };

  // 6. High-Res AR Snapshot Capture
  const captureARSnapshot = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    setIsSnapshotProcessing(true);

    try {
      const video = videoRef.current;
      const webglCanvas = canvasRef.current;

      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = webglCanvas.width;
      outputCanvas.height = webglCanvas.height;
      const ctx = outputCanvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      // 1. Draw video background
      if (isCameraActive && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, outputCanvas.width, outputCanvas.height);
      } else {
        // Draw simulated lab gradient
        const grad = ctx.createLinearGradient(0, 0, 0, outputCanvas.height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
      }

      // 2. Composite WebGL 3D Embryo render
      ctx.drawImage(webglCanvas, 0, 0);

      // 3. Clinical Watermark & Metadata HUD Badge
      const pad = 24;
      const badgeW = 380;
      const badgeH = 110;
      const badgeX = pad;
      const badgeY = outputCanvas.height - badgeH - pad;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`EMBRYO3D CLINICAL AR SNAPSHOT`, badgeX + 16, badgeY + 28);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`Week ${currentStage.week} • ${currentStage.title}`, badgeX + 16, badgeY + 54);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px monospace';
      const dateStr = new Date().toLocaleDateString();
      const carnegieStr = currentStage.carnegieStage ? `CS${currentStage.carnegieStage}` : 'Early';
      ctx.fillText(`CRL: ${currentStage.crlMm}mm | ${carnegieStr} | Scale: ${isLifeSize ? '1:1 True' : `${scaleMultiplier}x`}`, badgeX + 16, badgeY + 76);
      ctx.fillText(`Timestamp: ${dateStr} • Langman Anatomical Standard`, badgeX + 16, badgeY + 94);

      const dataUrl = outputCanvas.toDataURL('image/png');
      setSnapshotPreviewUrl(dataUrl);
    } catch (e) {
      console.error('Snapshot capture error:', e);
    } finally {
      setIsSnapshotProcessing(false);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="ar_mode_overlay_container"
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col select-none overflow-hidden font-sans"
    >
      {/* 1. Real Camera Video Element (Positioned in Background) */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
          isCameraActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Simulated Lab Environment Backdrop (Fallback if camera is off or denied) */}
      {!isCameraActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12),transparent_70%)]" />
          <div className="text-center px-4 max-w-md z-10">
            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 inline-block mb-3 shadow-lg shadow-sky-950/50">
              <Camera className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Simulated Physical AR Stage</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {cameraError || 'Camera is warming up or permission is needed. The 3D embryo model is positioned on the virtual stage below.'}
            </p>
            <button
              onClick={() => startCamera(cameraFacing)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-2 shadow-lg transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Camera Permission</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Transparent Three.js WebGL Interactive Canvas */}
      <canvas
        id="ar_webgl_canvas"
        ref={canvasRef}
        onClick={handleCanvasClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* 3. Top Navigation & Status Bar */}
      <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent backdrop-blur-[2px]">
        {/* Left: Stage Title & Carnegie Info */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/50 text-sky-300 shadow-inner">
            <Crosshair className="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Week {currentStage.week} {currentStage.carnegieStage ? `(CS ${currentStage.carnegieStage})` : ''}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                AR MODE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block truncate max-w-xs">
              {currentStage.title} • CRL {currentStage.crlMm}mm
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Heartbeat Audio Toggle */}
          {currentStage.heartRateBpm && (
            <button
              id="btn_ar_heartbeat_audio"
              onClick={() => {
                if (isHeartbeatAudioOn) stopHeartbeatAudio();
                else startHeartbeatAudio();
              }}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all shadow-md ${
                isHeartbeatAudioOn
                  ? 'bg-rose-500/30 text-rose-300 border-rose-500/60 shadow-rose-950/50'
                  : 'bg-black/60 hover:bg-black/80 text-slate-300 border-slate-700'
              }`}
              title="Toggle Simulated Stethoscope Doppler Heartbeat Sound"
            >
              {isHeartbeatAudioOn ? <Volume2 className="w-4 h-4 text-rose-400 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline font-mono font-bold text-[11px]">{currentStage.heartRateBpm} BPM</span>
            </button>
          )}

          {/* Flashlight/Torch (if mobile supported) */}
          {torchAvailable && (
            <button
              id="btn_ar_toggle_torch"
              onClick={toggleTorch}
              className={`p-2 rounded-xl border text-xs transition-all shadow-md ${
                isTorchOn
                  ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
                  : 'bg-black/60 hover:bg-black/80 text-slate-300 border-slate-700'
              }`}
              title="Toggle Flashlight / Torch"
            >
              <Sun className="w-4 h-4" />
            </button>
          )}

          {/* Switch Camera (Front / Back) */}
          <button
            id="btn_ar_flip_camera"
            onClick={() => {
              const next = cameraFacing === 'environment' ? 'user' : 'environment';
              setCameraFacing(next);
              startCamera(next);
            }}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
            title="Switch between Front and Back camera"
          >
            <RefreshCw className="w-4 h-4 text-sky-400" />
          </button>

          {/* Help Guide */}
          <button
            id="btn_ar_help"
            onClick={() => setShowHelpGuide(!showHelpGuide)}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
            title="AR Gestures & Placement Guide"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          {/* Fullscreen */}
          <button
            id="btn_ar_fullscreen"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close AR View */}
          <button
            id="btn_close_ar_mode"
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white transition-all shadow-md"
            title="Exit AR Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4. Left Floating HUD: Scale & Measurement Controls */}
      <div className="absolute top-20 left-3 sm:left-4 z-20 flex flex-col gap-2.5 pointer-events-auto max-w-[200px] sm:max-w-[240px]">
        {/* Scale Mode Card */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1 text-sky-400">
              <Scale className="w-3.5 h-3.5" />
              Scale Projection
            </span>
            <span className="font-mono text-sky-300">
              {isLifeSize ? '1:1 Actual' : `${scaleMultiplier}x`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn_scale_life_size"
              onClick={() => setIsLifeSize(true)}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all border ${
                isLifeSize
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              1:1 Life Size
            </button>
            <button
              id="btn_scale_macro"
              onClick={() => setIsLifeSize(false)}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all border ${
                !isLifeSize
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Macro Study
            </button>
          </div>

          {!isLifeSize && (
            <div className="space-y-1 pt-1">
              <input
                id="slider_ar_scale"
                type="range"
                min="10"
                max="250"
                step="5"
                value={scaleMultiplier}
                onChange={(e) => setScaleMultiplier(parseInt(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>10x (Lens)</span>
                <span>100x</span>
                <span>250x (Micro)</span>
              </div>
            </div>
          )}

          {/* Size Analogy Visual Reminder */}
          <div className="bg-slate-900/90 border border-slate-800/80 p-2 rounded-xl text-[11px] text-slate-300">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Physical Scale Analogy:</span>
            <span className="text-amber-300 font-medium">{currentStage.sizeAnalogy}</span>
          </div>
        </div>

        {/* AR Caliper / Live Biological Metrics */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl shadow-xl space-y-1 text-xs">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Crown-Rump Length:</span>
            <span className="text-white font-bold">{currentStage.crlMm} mm</span>
          </div>
          {currentStage.weightGrams ? (
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Est. Weight:</span>
              <span className="text-emerald-400 font-bold">{currentStage.weightGrams} g</span>
            </div>
          ) : null}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Gestational Age:</span>
            <span className="text-sky-300 font-bold">Days {currentStage.dayStart}–{currentStage.dayEnd}</span>
          </div>
        </div>
      </div>

      {/* 5. Right Floating AR Toolset (Cross-section, Hotspots, Wireframe, Auto-rotate) */}
      <div className="absolute top-20 right-3 sm:right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Toggle Hotspots */}
        <button
          id="btn_ar_toggle_hotspots"
          onClick={() => setShowHotspots(!showHotspots)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-xl transition-all ${
            showHotspots
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sky-950/50'
              : 'bg-slate-950/80 hover:bg-slate-900 text-slate-400 border-slate-800'
          }`}
          title="Toggle 3D Interactive Hotspot Pins"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Anatomy Pins</span>
        </button>

        {/* Auto Rotate */}
        <button
          id="btn_ar_toggle_autorotate"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-xl transition-all ${
            autoRotate
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-indigo-950/50'
              : 'bg-slate-950/80 hover:bg-slate-900 text-slate-400 border-slate-800'
          }`}
          title="Toggle Continuous 360° Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Auto Rotate</span>
        </button>

        {/* Surface Reticle Guide Toggle */}
        <button
          id="btn_ar_toggle_reticle"
          onClick={() => setShowReticle(!showReticle)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-xl transition-all ${
            showReticle
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/50'
              : 'bg-slate-950/80 hover:bg-slate-900 text-slate-400 border-slate-800'
          }`}
          title="Toggle Surface Placement Reticle"
        >
          <Grid className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Surface Grid</span>
        </button>

        {/* Wireframe Toggle */}
        <button
          id="btn_ar_toggle_wireframe"
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-xl transition-all ${
            wireframe
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-950/50'
              : 'bg-slate-950/80 hover:bg-slate-900 text-slate-400 border-slate-800'
          }`}
          title="Toggle Mesh Topology"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wireframe</span>
        </button>

        {/* Cross-section Slicing Panel in AR */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl shadow-2xl space-y-2 text-xs w-48 sm:w-56 text-left">
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-400">
            <Scissors className="w-3.5 h-3.5" />
            <span>AR Internal Dissection</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(['none', 'sagittal', 'transverse', 'coronal'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setCutawayPlane(p)}
                className={`py-1 text-[10px] capitalize font-medium rounded-lg transition-all border ${
                  cutawayPlane === p
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500/60 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {p === 'none' ? 'Off' : p.slice(0, 4)}
              </button>
            ))}
          </div>
          {cutawayPlane !== 'none' && (
            <input
              type="range"
              min="-1.5"
              max="1.5"
              step="0.05"
              value={cutawayOffset}
              onChange={(e) => setCutawayOffset(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          )}
        </div>
      </div>

      {/* 6. Selected Hotspot Details Modal/Popover in AR */}
      {selectedHotspot && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md bg-slate-900/95 backdrop-blur-xl border border-sky-500/60 rounded-2xl p-4 shadow-2xl animate-fade-in text-left">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                <h4 className="text-sm font-bold text-white">{selectedHotspot.name}</h4>
              </div>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">
                Germ Layer: {selectedHotspot.germLayer.replace('_', ' ')}
              </span>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed mb-2.5">
            {selectedHotspot.fullDesc}
          </p>

          <div className="bg-rose-950/30 border border-rose-500/40 p-2.5 rounded-xl text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-rose-400 block tracking-wider">
              Clinical & Teratogenic Significance:
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {selectedHotspot.clinicalSignificance}
            </p>
          </div>
        </div>
      )}

      {/* 7. Help Guide Overlay */}
      {showHelpGuide && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>Augmented Reality Navigation Guide</span>
              </div>
              <button
                onClick={() => setShowHelpGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <Crosshair className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Tap to Place & Anchor:</span>
                  <span>Point your camera at a desk, tabletop, or floor. Tap anywhere on the screen to anchor the embryo at the reticle target.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <RotateCw className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Orbit & Rotate Gestures:</span>
                  <span>Drag with one finger or mouse to orbit 360°. Enable Auto-Rotate for continuous hands-free inspection.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <Scale className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Life-Size vs Macro Study:</span>
                  <span>Toggle between 1:1 true anatomical scale (actual millimeters) and 10x–250x macro magnification.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <Camera className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Clinical AR Snapshot:</span>
                  <span>Capture high-resolution photos of the embryo projected in your physical environment with automatic clinical watermark badges.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpGuide(false)}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg"
            >
              Got it, let's explore!
            </button>
          </div>
        </div>
      )}

      {/* 8. Snapshot Preview Modal */}
      {snapshotPreviewUrl && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-4 space-y-4 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                Clinical AR Snapshot Ready
              </span>
              <button
                onClick={() => setSnapshotPreviewUrl(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-black">
              <img
                src={snapshotPreviewUrl}
                alt="Embryo AR Snapshot"
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
              />
            </div>

            <div className="flex items-center gap-2">
              <a
                href={snapshotPreviewUrl}
                download={`Embryo3D_Week${currentStage.week}_AR_Snapshot.png`}
                className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Save to Photos / Device</span>
              </a>
              <button
                onClick={() => setSnapshotPreviewUrl(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Bottom Stage Selector & Shutter Bar */}
      <div className="mt-auto relative z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-[2px] flex flex-col gap-3">
        {/* Drawer for selecting other Carnegie stages without leaving AR */}
        {isStageDrawerOpen && (
          <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-3 shadow-2xl max-h-48 overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin scrollbar-thumb-slate-700 animate-slide-up">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 px-1">
              Switch Carnegie Developmental Stage in AR:
            </div>
            {allStages.map((stg) => {
              const isSelected = stg.id === currentStage.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    onSelectStage(stg);
                    setIsStageDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sky-400 font-bold">Wk {stg.week}</span>
                    {stg.carnegieStage && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-900 rounded text-amber-300 font-semibold">
                        CS {stg.carnegieStage}
                      </span>
                    )}
                    <span className="truncate max-w-[200px] text-slate-200">{stg.title}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {/* Stage Selector Drawer Trigger */}
          <button
            id="btn_ar_open_stage_drawer"
            onClick={() => setIsStageDrawerOpen(!isStageDrawerOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-850 border border-sky-500/40 rounded-xl text-xs font-semibold text-white shadow-lg transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-mono text-sky-300">Wk {currentStage.week}</span>
            <span className="truncate max-w-[120px] sm:max-w-[180px]">{currentStage.title}</span>
            {isStageDrawerOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white" />
            )}
          </button>

          {/* Central Camera Shutter Button */}
          <button
            id="btn_ar_take_snapshot"
            disabled={isSnapshotProcessing}
            onClick={captureARSnapshot}
            className="flex items-center justify-center p-3 sm:px-5 sm:py-2.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-slate-950 font-bold rounded-2xl shadow-xl shadow-sky-950/60 transition-all active:scale-95 group"
            title="Capture High-Res AR Clinical Snapshot"
          >
            <Camera className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline ml-2 text-xs">Capture Snapshot</span>
          </button>

          {/* Reset Position / Recenter Button */}
          <button
            id="btn_ar_recenter"
            onClick={() => {
              if (modelGroupRef.current) {
                modelGroupRef.current.position.set(0, 0, -4.5);
                modelGroupRef.current.rotation.set(0, 0, 0);
                modelPositionRef.current.set(0, 0, -4.5);
                modelRotationRef.current.set(0, 0, 0);
              }
              if (reticleMeshRef.current) {
                reticleMeshRef.current.position.set(0, -1.2, -4.5);
              }
              if (shadowPlaneRef.current) {
                shadowPlaneRef.current.position.set(0, -1.2, -4.5);
              }
            }}
            className="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white shadow-lg transition-all"
            title="Recenter Embryo in Front of Camera"
          >
            Recenter
          </button>
        </div>
      </div>
    </div>
  );
};
