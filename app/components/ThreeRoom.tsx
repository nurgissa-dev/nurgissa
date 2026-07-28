'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

export type FocusTarget = 'passport' | 'keyboard' | 'phone' | 'mug' | 'map' | 'book' | 'project' | null;

interface ThreeRoomProps {
  focused: FocusTarget;
  focusedBookId?: string | null;
  focusedProjectId?: string | null;
  onSelectObject: (target: FocusTarget, extraId?: string) => void;
  isIdle?: boolean;
}

// ── LERP CONSTANTS FOR CAMERA FOCUS ──────────────────────────────
const CAMERA_PRESETS: Record<string, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
  default:  { pos: [0, 1.75, 2.6],    lookAt: [0, 0.95, -0.4] },
  passport: { pos: [-1.3, 1.45, 0.55], lookAt: [-1.3, 0.82, 0.1] },
  keyboard: { pos: [-0.25, 1.45, 0.85],lookAt: [-0.25, 0.82, 0.4] },
  phone:    { pos: [1.25, 1.45, 0.75], lookAt: [1.25, 0.82, 0.3] },
  mug:      { pos: [1.1, 1.35, 0.05],  lookAt: [1.1, 0.82, -0.4] },
  map:      { pos: [0.65, 1.4, 0.4],   lookAt: [0.65, 0.82, -0.05] },
  book:     { pos: [-1.95, 1.6, 0.2],  lookAt: [-2.4, 1.5, -0.6] },
  project:  { pos: [1.95, 1.6, 0.2],   lookAt: [2.4, 1.5, -0.6] },
};

export default function ThreeRoom({
  focused,
  focusedBookId,
  focusedProjectId,
  onSelectObject,
  isIdle = false,
}: ThreeRoomProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const monitorCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const hoveredObjRef = useRef<THREE.Object3D | null>(null);

  // Monitor live screen state
  const [screenIndex, setScreenIndex] = useState(0);
  const [typedCmd, setTypedCmd] = useState('');
  const [cmdOutput, setCmdOutput] = useState('');

  // ── 1. MONITOR SCREEN ANIMATION & LIVE TYPING ──
  useEffect(() => {
    if (isIdle) return;
    const interval = setInterval(() => {
      setScreenIndex(prev => (prev + 1) % 4);
    }, 10000);
    return () => clearInterval(interval);
  }, [isIdle]);

  useEffect(() => {
    if (isIdle) return;
    const cmds = [
      ['git commit -m "feat: real-time 3D room"', '[main 9f3a12] 3D canvas active'],
      ['docker compose up -d', '✓ portfolio_web running'],
      ['pytest tests/ -v', '✓ 32 passed in 1.84s'],
      ['python main.py', 'INFO: Server running on :3000'],
    ];
    let timeoutId: NodeJS.Timeout;
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        const [cmd, out] = cmds[Math.floor(Math.random() * cmds.length)];
        let charIdx = 0;
        setTypedCmd('');
        setCmdOutput('');
        const typeTimer = setInterval(() => {
          setTypedCmd(cmd.slice(0, ++charIdx));
          if (charIdx >= cmd.length) {
            clearInterval(typeTimer);
            setTimeout(() => {
              setCmdOutput(out);
              setTimeout(() => {
                setTypedCmd('');
                setCmdOutput('');
                scheduleNext();
              }, 3000);
            }, 500);
          }
        }, 50);
      }, 12000 + Math.random() * 8000);
    };
    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [isIdle]);

  // Render Monitor Screen Texture to Hidden 2D Canvas
  useEffect(() => {
    const canvas = monitorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isIdle) {
      ctx.fillStyle = '#141e2e';
      ctx.font = '16px monospace';
      ctx.fillText('█ System Idle', 20, 40);
      return;
    }

    // Top Chrome
    ctx.fillStyle = '#0a0d18';
    ctx.fillRect(0, 0, canvas.width, 28);
    // Dots
    ['#ff5f57', '#febc2e', '#28c840'].forEach((color, i) => {
      ctx.beginPath();
      ctx.arc(16 + i * 14, 14, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
    // URL
    ctx.fillStyle = '#101624';
    ctx.fillRect(65, 5, 200, 18);
    ctx.fillStyle = '#4a6080';
    ctx.font = '10px monospace';
    ctx.fillText('localhost:3000', 75, 17);

    // Code area
    const screens = ['VSCODE', 'GITHUB', 'TERMINAL', 'DOCKER'];
    const currentMode = screens[screenIndex % 4];

    if (currentMode === 'VSCODE') {
      ctx.fillStyle = '#61afef';
      ctx.font = '12px monospace';
      ctx.fillText('import React from "react"', 20, 60);
      ctx.fillStyle = '#c678dd';
      ctx.fillText('export default function Portfolio() {', 20, 85);
      ctx.fillStyle = '#98c379';
      ctx.fillText('  const [mode] = useState("3D_WebGL")', 20, 110);
      ctx.fillStyle = '#e5c07b';
      ctx.fillText('  return <Room3D mood="night" />', 20, 135);
      ctx.fillStyle = '#c678dd';
      ctx.fillText('}', 20, 160);
    } else if (currentMode === 'GITHUB') {
      ctx.fillStyle = '#58A6FF';
      ctx.font = '13px monospace';
      ctx.fillText('nurgissa-dev / portfolio', 20, 60);
      ctx.fillStyle = '#a3b3c9';
      ctx.font = '11px monospace';
      ctx.fillText('● main  31 commits', 20, 85);
      ctx.fillText('feat: Three.js 3D WebGL Workshop', 20, 110);
      ctx.fillText('fix: real-time PBR lighting & shadows', 20, 135);
    } else if (currentMode === 'TERMINAL') {
      ctx.fillStyle = '#58A6FF';
      ctx.font = '12px monospace';
      ctx.fillText('~/portfolio $ npm run dev', 20, 60);
      ctx.fillStyle = '#3a7a3a';
      ctx.fillText('▲ Next.js 16 (Turbopack) ready', 20, 85);
      ctx.fillText('✓ Compiled in 420ms', 20, 110);
    } else {
      ctx.fillStyle = '#58A6FF';
      ctx.font = '12px monospace';
      ctx.fillText('DOCKER CONTAINERS', 20, 60);
      ctx.fillStyle = '#3a7a3a';
      ctx.fillText('● portfolio_web:3000   [UP]', 20, 85);
      ctx.fillText('● postgres_db:5432    [UP]', 20, 110);
      ctx.fillText('● chromadb:8000       [UP]', 20, 135);
    }

    // Live typing bar at bottom
    if (typedCmd) {
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
      ctx.fillStyle = '#58A6FF';
      ctx.font = '11px monospace';
      ctx.fillText(`$ ${typedCmd}_`, 15, canvas.height - 18);
      if (cmdOutput) {
        ctx.fillStyle = '#3a7a3a';
        ctx.fillText(cmdOutput, 200, canvas.height - 18);
      }
    }
  }, [screenIndex, typedCmd, cmdOutput, isIdle]);

  // ── 2. THREE.JS SCENE SETUP & ANIMATION LOOP ──
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // SCENE, FOG, RENDERER
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#04060b');
    scene.fog = new THREE.FogExp2('#04060b', 0.05);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 1.75, 2.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── LIGHTS ──
    const ambientLight = new THREE.AmbientLight('#0d1424', 0.7);
    scene.add(ambientLight);

    // Desk Lamp Spotlight
    const lampSpot = new THREE.SpotLight('#FFB84D', 3.8);
    lampSpot.position.set(-1.6, 2.0, -0.3);
    lampSpot.target.position.set(-0.8, 0.8, 0.1);
    lampSpot.angle = Math.PI / 4;
    lampSpot.penumbra = 0.6;
    lampSpot.castShadow = true;
    lampSpot.shadow.mapSize.width = 1024;
    lampSpot.shadow.mapSize.height = 1024;
    lampSpot.shadow.bias = -0.001;
    scene.add(lampSpot);
    scene.add(lampSpot.target);

    // Monitor Screen PointLight (Cool blue)
    const monitorLight = new THREE.PointLight('#58A6FF', 2.0, 3.5);
    monitorLight.position.set(-0.6, 1.35, -0.4);
    scene.add(monitorLight);

    // Neon Sign Light (Magenta/Cyan accent)
    const neonLight = new THREE.PointLight('#58A6FF', 1.2, 4.0);
    neonLight.position.set(1.5, 2.1, -1.8);
    scene.add(neonLight);

    // Soft directional light from window
    const windowDirLight = new THREE.DirectionalLight('#182840', 0.6);
    windowDirLight.position.set(0, 3, -4);
    scene.add(windowDirLight);

    // ── MATERIALS ──
    const woodMat = new THREE.MeshStandardMaterial({ color: '#3a2616', roughness: 0.4, metalness: 0.1 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: '#161822', roughness: 0.3, metalness: 0.7 });
    const monitorBodyMat = new THREE.MeshStandardMaterial({ color: '#0f111a', roughness: 0.5, metalness: 0.3 });
    const passportMat = new THREE.MeshStandardMaterial({ color: '#0a162e', roughness: 0.3, metalness: 0.4 });
    const phoneMat = new THREE.MeshStandardMaterial({ color: '#0d0d14', roughness: 0.2, metalness: 0.8 });
    const mugMat = new THREE.MeshStandardMaterial({ color: '#4a3222', roughness: 0.5 });
    const keyboardMat = new THREE.MeshStandardMaterial({ color: '#1a1c26', roughness: 0.4, metalness: 0.3 });
    const keyCapMat = new THREE.MeshStandardMaterial({ color: '#2a2c3a', roughness: 0.5 });
    const rgbKeyMat = new THREE.MeshStandardMaterial({ color: '#58A6FF', emissive: '#58A6FF', emissiveIntensity: 0.4 });
    const wallMat = new THREE.MeshStandardMaterial({ color: '#0a0d14', roughness: 0.9 });
    const floorMat = new THREE.MeshStandardMaterial({ color: '#090a10', roughness: 0.4, metalness: 0.2 });

    // Monitor Dynamic Canvas Texture
    const monitorCanvas = monitorCanvasRef.current;
    let monitorTex: THREE.CanvasTexture | null = null;
    let screenMat: THREE.MeshBasicMaterial;

    if (monitorCanvas) {
      monitorTex = new THREE.CanvasTexture(monitorCanvas);
      monitorTex.colorSpace = THREE.SRGBColorSpace;
      screenMat = new THREE.MeshBasicMaterial({ map: monitorTex });
    } else {
      screenMat = new THREE.MeshBasicMaterial({ color: '#060810' });
    }

    // ── OBJECT CONTAINERS FOR RAYCASTING ──
    const interactiveObjects: THREE.Object3D[] = [];

    // Helper to register interactive mesh recursively for all child meshes
    const makeInteractive = (obj: THREE.Object3D, name: FocusTarget, extraId?: string) => {
      obj.userData = { name, extraId };
      interactiveObjects.push(obj);
      obj.traverse(child => {
        child.userData = { name, extraId };
        if (child instanceof THREE.Mesh) {
          interactiveObjects.push(child);
        }
      });
    };

    // ── 3D MESHS CREATION ──

    // 1. FLOOR & ROOM WALLS
    const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 8), floorMat);
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.1), wallMat);
    backWall.position.set(0, 2.5, -2.5);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5, 8), wallMat);
    leftWall.position.set(-4.5, 2.5, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5, 8), wallMat);
    rightWall.position.set(4.5, 2.5, 0);
    scene.add(rightWall);

    // 2. WINDOW FRAME & GLASS (Back wall center)
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 0.12), darkMetalMat);
    windowFrame.position.set(0, 2.7, -2.44);
    scene.add(windowFrame);

    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(4.0, 2.0),
      new THREE.MeshPhysicalMaterial({ color: '#061020', transparent: true, opacity: 0.7, roughness: 0.1, transmission: 0.6 })
    );
    windowGlass.position.set(0, 2.7, -2.37);
    scene.add(windowGlass);

    // Window Crossbars
    const barV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.0, 0.05), darkMetalMat);
    barV.position.set(0, 2.7, -2.36);
    scene.add(barV);

    const barH = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.04, 0.05), darkMetalMat);
    barH.position.set(0, 2.7, -2.36);
    scene.add(barH);

    // 3. DESK (Walnut top + Steel legs)
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.08, 1.8), woodMat);
    deskTop.position.set(0, 0.8, -0.2);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    scene.add(deskTop);

    // Beveled Desk Front Lip
    const deskEdge = new THREE.Mesh(new THREE.BoxGeometry(3.84, 0.06, 0.08), woodMat);
    deskEdge.position.set(0, 0.77, 0.73);
    scene.add(deskEdge);

    // Desk Steel Legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.8, 0.08);
    const legPositions: [number, number, number][] = [
      [-1.8, 0.4, -1.0],
      [1.8, 0.4, -1.0],
      [-1.8, 0.4, 0.6],
      [1.8, 0.4, 0.6],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, darkMetalMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      scene.add(leg);
    });

    // 4. MONITOR & STAND
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(-0.6, 0.84, -0.5);

    // Stand Base & Neck
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.3), darkMetalMat);
    baseMesh.position.set(0, 0.01, 0);
    baseMesh.castShadow = true;
    monitorGroup.add(baseMesh);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16), darkMetalMat);
    neckMesh.position.set(0, 0.2, -0.05);
    neckMesh.castShadow = true;
    monitorGroup.add(neckMesh);

    // Monitor Outer Body (16:9 ratio)
    const monitorBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.95, 0.06), monitorBodyMat);
    monitorBody.position.set(0, 0.65, -0.05);
    monitorBody.castShadow = true;
    monitorGroup.add(monitorBody);

    // Screen Mesh
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 0.87), screenMat);
    screenMesh.position.set(0, 0.65, -0.018);
    monitorGroup.add(screenMesh);

    makeInteractive(monitorGroup, 'keyboard');
    scene.add(monitorGroup);

    // 5. KEYBOARD & MOUSE (Foreground center)
    const kbGroup = new THREE.Group();
    kbGroup.position.set(-0.25, 0.85, 0.4);

    const kbBase = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.03, 0.36), keyboardMat);
    kbBase.castShadow = true;
    kbBase.receiveShadow = true;
    kbGroup.add(kbBase);

    // Keyboard Keycaps (6 rows)
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 14; col++) {
        const isRGB = (row === 1 && (col === 2 || col === 8)) || (row === 2 && col === 5);
        const keyMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.02, 0.05),
          isRGB ? rgbKeyMat : keyCapMat
        );
        keyMesh.position.set(-0.44 + col * 0.068, 0.025, -0.12 + row * 0.06);
        kbGroup.add(keyMesh);
      }
    }
    // Spacebar
    const spaceKey = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.02, 0.05), keyCapMat);
    spaceKey.position.set(0, 0.025, 0.12);
    kbGroup.add(spaceKey);

    makeInteractive(kbGroup, 'keyboard');
    scene.add(kbGroup);

    // Mouse
    const mouseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.18), keyboardMat);
    mouseMesh.position.set(0.6, 0.85, 0.4);
    mouseMesh.castShadow = true;
    makeInteractive(mouseMesh, 'keyboard');
    scene.add(mouseMesh);

    // 6. PASSPORT (Desk left)
    const passportGroup = new THREE.Group();
    passportGroup.position.set(-1.3, 0.85, 0.1);
    passportGroup.rotation.y = -0.15;

    const passportCover = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.34), passportMat);
    passportCover.castShadow = true;
    passportCover.receiveShadow = true;
    passportGroup.add(passportCover);

    // Gold emblem box on passport
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.022, 16), rgbKeyMat);
    emblem.position.set(0, 0.005, 0);
    passportGroup.add(emblem);

    makeInteractive(passportGroup, 'passport');
    scene.add(passportGroup);

    // 7. PHONE (Desk right)
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(1.25, 0.85, 0.3);
    phoneGroup.rotation.y = 0.25;

    const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.015, 0.32), phoneMat);
    phoneBody.castShadow = true;
    phoneGroup.add(phoneBody);

    const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.29), new THREE.MeshBasicMaterial({ color: '#090d18' }));
    phoneScreen.rotation.x = -Math.PI / 2;
    phoneScreen.position.set(0, 0.009, 0);
    phoneGroup.add(phoneScreen);

    makeInteractive(phoneGroup, 'phone');
    scene.add(phoneGroup);

    // 8. COFFEE MUG (Desk right back)
    const mugGroup = new THREE.Group();
    mugGroup.position.set(1.1, 0.85, -0.4);

    const mugCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.2, 24), mugMat);
    mugCylinder.castShadow = true;
    mugGroup.add(mugCylinder);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16, Math.PI), mugMat);
    handle.position.set(0.09, 0, 0);
    handle.rotation.z = -Math.PI / 2;
    mugGroup.add(handle);

    makeInteractive(mugGroup, 'mug');
    scene.add(mugGroup);

    // 9. BOOKSHELF & 3D BOOKS (Left wall)
    const shelfBoard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 1.4), woodMat);
    shelfBoard.position.set(-4.3, 1.8, -0.6);
    scene.add(shelfBoard);

    const bookColors = ['#7a3b2e', '#2a4a3a', '#1a2a4a', '#2a4220', '#3a1850'];
    bookColors.forEach((color, i) => {
      const bookMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.28, 0.06),
        new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
      );
      bookMesh.position.set(-4.3, 1.96, -1.0 + i * 0.08);
      bookMesh.castShadow = true;
      makeInteractive(bookMesh, 'book', `book_${i}`);
      scene.add(bookMesh);
    });

    // 10. PROJECT CABINET (Right wall)
    const cabBoard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 1.4), woodMat);
    cabBoard.position.set(4.3, 1.8, -0.6);
    scene.add(cabBoard);

    const projColors = ['#FFB84D', '#5a9a5a', '#58A6FF'];
    projColors.forEach((color, i) => {
      const projBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.24, 0.12),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
      );
      projBox.position.set(4.3, 1.94, -0.9 + i * 0.18);
      projBox.castShadow = true;
      makeInteractive(projBox, 'project', `proj_${i}`);
      scene.add(projBox);
    });

    // 11. DESK LAMP (Left desk surface)
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-1.6, 0.84, -0.3);

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.03, 24), darkMetalMat);
    lampGroup.add(lampBase);

    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 12), darkMetalMat);
    lampArm.position.set(0.15, 0.35, 0);
    lampArm.rotation.z = -Math.PI / 6;
    lampGroup.add(lampArm);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.2, 24), darkMetalMat);
    lampShade.position.set(0.32, 0.65, 0.1);
    lampShade.rotation.z = Math.PI / 4;
    lampGroup.add(lampShade);

    scene.add(lampGroup);

    // ── 3. RAYCASTING HOVER & CLICK HANDLERS ──
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;

      mouseVector.set(x, y);
      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      if (intersects.length > 0) {
        let topObj: THREE.Object3D | null = intersects[0].object;
        while (topObj && !topObj.userData?.name && topObj.parent) {
          topObj = topObj.parent;
        }

        if (topObj && topObj.userData?.name) {
          container.style.cursor = 'pointer';
          hoveredObjRef.current = topObj;
          return;
        }
      }

      container.style.cursor = 'default';
      hoveredObjRef.current = null;
    };

    const onPointerDown = (e: MouseEvent) => {
      if (hoveredObjRef.current && hoveredObjRef.current.userData?.name) {
        const { name, extraId } = hoveredObjRef.current.userData;
        onSelectObject(name as FocusTarget, extraId);
      }
    };

    window.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('click', onPointerDown);

    // ── 4. RESIZE HANDLER ──
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── 5. RENDER LOOP (WITH CAMERA LERP & PARALLAX) ──
    let animationFrameId: number;

    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();
    const currentLook = new THREE.Vector3(0, 0.95, -0.4);

    const animate = () => {
      // 1. Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // 2. Camera target preset lerp
      const presetKey = focused || 'default';
      const preset = CAMERA_PRESETS[presetKey] || CAMERA_PRESETS.default;

      // Add mouse parallax offset if default view
      const parallaxX = focused ? 0 : mouseRef.current.x * 0.25;
      const parallaxY = focused ? 0 : mouseRef.current.y * 0.15;

      targetPos.set(preset.pos[0] + parallaxX, preset.pos[1] + parallaxY, preset.pos[2]);
      targetLook.set(preset.lookAt[0], preset.lookAt[1], preset.lookAt[2]);

      // Lerp Camera Position
      camera.position.lerp(targetPos, 0.055);

      // Lerp LookAt Target
      currentLook.lerp(targetLook, 0.055);
      camera.lookAt(currentLook);

      // Update monitor dynamic texture
      if (monitorTex) {
        monitorTex.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('click', onPointerDown);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [focused, onSelectObject]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Hidden 2D Canvas for Monitor Live Code Texture */}
      <canvas
        ref={monitorCanvasRef}
        width={512}
        height={320}
        style={{ display: 'none' }}
      />
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
