import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EmbryoStage, HotspotPin } from '../types';
import { AnkiFlashcard } from '../data/ankiFlashcardsData';
import { buildEmbryo3DModel, dispose3DGroup } from '../utils/embryo3dBuilder';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  EyeOff, 
  Camera, 
  Maximize2, 
  Compass,
  Sparkles,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface Props {
  currentStage: EmbryoStage;
  activeFlashcard: AnkiFlashcard;
  isRevealed: boolean;
  onToggleReveal?: () => void;
  hideAllLabels?: boolean;
  onSelectPin?: (pinId: string) => void;
}

export const AnkiFlashcardViewer3D: React.FC<Props> = ({
  currentStage,
  activeFlashcard,
  isRevealed,
  onToggleReveal,
  hideAllLabels = true,
  onSelectPin
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const targetBeaconRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const spritesGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [activeAngle, setActiveAngle] = useState<'front' | 'side' | 'dorsal'>('side');

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Deep slate/black
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.8, 1.8, 3.8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 15;
    controls.minDistance = 1.2;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainSpot = new THREE.DirectionalLight(0x38bdf8, 2.2);
    mainSpot.position.set(5, 8, 5);
    scene.add(mainSpot);

    const warmRim = new THREE.DirectionalLight(0xf59e0b, 1.5);
    warmRim.position.set(-5, -3, -5);
    scene.add(warmRim);

    const underGlow = new THREE.PointLight(0x818cf8, 1.0, 10);
    underGlow.position.set(0, -3, 2);
    scene.add(underGlow);

    // Grid Floor
    const grid = new THREE.GridHelper(8, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -2.2;
    scene.add(grid);

    // Sprites Group for pins
    const spritesGroup = new THREE.Group();
    scene.add(spritesGroup);
    spritesGroupRef.current = spritesGroup;

    // Target Beacon Group
    const beaconGroup = new THREE.Group();
    scene.add(beaconGroup);
    targetBeaconRef.current = beaconGroup;

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Controls update
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 1.5;
        controlsRef.current.update();
      }

      // Heart pulsation animation
      if (heartMeshRef.current) {
        const pulse = 1 + Math.sin(elapsedTime * 6.5) * 0.08;
        heartMeshRef.current.scale.set(pulse * 1.1, pulse * 0.95, pulse * 0.95);
      }

      // Target Beacon Ring rotation & pulse
      if (targetBeaconRef.current) {
        targetBeaconRef.current.rotation.y += delta * 1.8;
        const ring = targetBeaconRef.current.getObjectByName('beacon_ring');
        if (ring) {
          const s = 1 + Math.sin(elapsedTime * 4) * 0.15;
          ring.scale.set(s, s, s);
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW && newH && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update 3D Embryo Model when currentStage changes
  useEffect(() => {
    if (!sceneRef.current) return;

    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
      dispose3DGroup(modelGroupRef.current);
    }

    const { group, heartMesh } = buildEmbryo3DModel(currentStage);
    sceneRef.current.add(group);
    modelGroupRef.current = group;
    heartMeshRef.current = heartMesh;
  }, [currentStage]);

  // Update Target Pin Beacon and Occlusion Badges
  useEffect(() => {
    if (!spritesGroupRef.current || !targetBeaconRef.current) return;

    // Clear old sprites & beacon objects
    while (spritesGroupRef.current.children.length > 0) {
      const child = spritesGroupRef.current.children[0];
      spritesGroupRef.current.remove(child);
    }
    while (targetBeaconRef.current.children.length > 0) {
      const child = targetBeaconRef.current.children[0];
      targetBeaconRef.current.remove(child);
    }

    const [tx, ty, tz] = activeFlashcard.pinPosition;

    // 1. Build Target Beacon Assembly at active pin coordinates
    const beacon = targetBeaconRef.current;
    beacon.position.set(tx, ty, tz);

    // Glowing wireframe pulse ring
    const ringGeo = new THREE.TorusGeometry(0.35, 0.02, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isRevealed ? 0x10b981 : 0x06b6d4,
      wireframe: false,
      transparent: true,
      opacity: 0.8
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.name = 'beacon_ring';
    ringMesh.rotation.x = Math.PI / 2;
    beacon.add(ringMesh);

    // Vertical locator line down to structure
    const lineMat = new THREE.LineBasicMaterial({
      color: isRevealed ? 0x10b981 : 0x06b6d4,
      transparent: true,
      opacity: 0.7
    });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.45, 0)
    ]);
    const line = new THREE.Line(lineGeo, lineMat);
    beacon.add(line);

    // 2. Build 2D/3D Canvas Label Sprite for all hotspots on this stage
    const hotspots = currentStage.hotspots || [];
    hotspots.forEach((pin, idx) => {
      const isThisActiveCard = pin.id === activeFlashcard.hotspotId || pin.name.toLowerCase() === activeFlashcard.structureName.toLowerCase();
      const pinCanvas = document.createElement('canvas');
      pinCanvas.width = 384;
      pinCanvas.height = 128;
      const ctx = pinCanvas.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, 384, 128);

        if (isThisActiveCard) {
          // TARGET CARD BADGE
          if (isRevealed) {
            // REVEALED STATE: Bold emerald/sky banner with full structure name
            ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
            ctx.strokeStyle = '#10b981'; // Emerald
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(16, 24, 352, 80, 16);
            ctx.fill();
            ctx.stroke();

            // Checkmark icon circle
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(60, 64, 22, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✓', 60, 65);

            // Structure Name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Inter, sans-serif';
            ctx.textAlign = 'left';
            const displayName = pin.name.length > 20 ? pin.name.substring(0, 18) + '…' : pin.name;
            ctx.fillText(displayName, 95, 54);

            // Subtitle
            ctx.fillStyle = '#a7f3d0';
            ctx.font = '14px monospace';
            ctx.fillText(activeFlashcard.germLayer.toUpperCase(), 95, 82);
          } else {
            // MASKED / OCCLUSION STATE: Pulsing Cyan Question Mark
            ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
            ctx.strokeStyle = '#06b6d4'; // Cyan
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.roundRect(40, 24, 304, 80, 20);
            ctx.fill();
            ctx.stroke();

            // Question Mark Icon
            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.arc(88, 64, 26, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#030712';
            ctx.font = '900 28px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 88, 65);

            // Text Prompt
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('IDENTIFY STRUCTURE', 128, 54);

            ctx.fillStyle = '#67e8f9';
            ctx.font = 'bold 14px monospace';
            ctx.fillText('ACTIVE FLASHCARD PIN', 128, 80);
          }
        } else {
          // OTHER PINS ON MODEL (DIMMED / NUMBERED OCCLUSION)
          if (hideAllLabels) {
            // Numbered occlusion dot: [ 1 ], [ 2 ], etc.
            ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(192, 64, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${idx + 1}`, 192, 65);
          } else {
            // Small subtle tag
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(96, 40, 192, 48, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#cbd5e1';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const shortName = pin.name.length > 14 ? pin.name.substring(0, 12) + '…' : pin.name;
            ctx.fillText(shortName, 192, 64);
          }
        }

        const texture = new THREE.CanvasTexture(pinCanvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          depthTest: false,
          depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        const [px, py, pz] = pin.position;
        sprite.position.set(px, py + (isThisActiveCard ? 0.6 : 0.35), pz);
        sprite.scale.set(isThisActiveCard ? 1.5 : 1.0, isThisActiveCard ? 0.5 : 0.33, 1);
        sprite.userData = { pinId: pin.id };
        spritesGroupRef.current.add(sprite);
      }
    });
  }, [currentStage, activeFlashcard, isRevealed, hideAllLabels]);

  // Camera presets
  const handleSetCameraAngle = (view: 'front' | 'side' | 'dorsal') => {
    setActiveAngle(view);
    if (!cameraRef.current || !controlsRef.current) return;

    switch (view) {
      case 'front':
        cameraRef.current.position.set(0, 0.4, 4.2);
        break;
      case 'side':
        cameraRef.current.position.set(3.8, 1.2, 1.2);
        break;
      case 'dorsal':
        cameraRef.current.position.set(0, 1.0, -4.2);
        break;
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(2.8, 1.8, 3.8);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = direction === 'in' ? 0.8 : 1.25;
    cameraRef.current.position.multiplyScalar(factor);
    controlsRef.current.update();
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group select-none"
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Overlay: Carnegie Stage Indicator */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-slate-200 font-semibold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-cyan-300">W{currentStage.week} (CS {currentStage.carnegieStage || '—'})</span>
          <span className="text-slate-400">|</span>
          <span className="text-white">{currentStage.title}</span>
        </div>

        {/* Occlusion Mode Status Badge */}
        <div className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border backdrop-blur-md flex items-center gap-1.5 shadow-md ${
          isRevealed 
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
            : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
        }`}>
          {isRevealed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>LABEL REVEALED</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACTIVE OCCLUSION</span>
            </>
          )}
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
        {/* Auto Rotate Button */}
        <button
          id="btn_3d_flashcard_autorotate"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl border text-xs transition-all shadow-md ${
            autoRotate
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
          title="Toggle Auto-Rotation"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Reset Camera Button */}
        <button
          id="btn_3d_flashcard_reset_cam"
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all shadow-md"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Zoom In/Out */}
        <button
          id="btn_3d_flashcard_zoomin"
          onClick={() => handleZoom('in')}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all shadow-md"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="btn_3d_flashcard_zoomout"
          onClick={() => handleZoom('out')}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all shadow-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Center: Camera View Angles Ribbon & Reveal Prompt */}
      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
        {/* Camera Angle Selector */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl pointer-events-auto">
          {(['side', 'front', 'dorsal'] as const).map((angle) => (
            <button
              key={angle}
              onClick={() => handleSetCameraAngle(angle)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                activeAngle === angle
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {angle}
            </button>
          ))}
        </div>

        {/* Quick 3D Interaction Tip */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400 font-mono">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Drag to rotate • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};
