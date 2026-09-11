'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface CentralGuideHero3DCanvasProps {
  className?: string;
  onLoaded?: () => void;
}

export const CentralGuideHero3DCanvas: React.FC<CentralGuideHero3DCanvasProps> = ({
  className = '',
  onLoaded,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 1100;
    let height = container.clientHeight || 580;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);

    // Responsive Camera Framing for ~14 unit wide diorama
    const updateCamera = (cam: THREE.PerspectiveCamera, w: number, h: number) => {
      const aspect = w / h;
      cam.aspect = aspect;
      const targetWidth = 14.2;
      const fovRad = THREE.MathUtils.degToRad(cam.fov);
      const distForWidth = (targetWidth * 1.05) / (2 * Math.tan(fovRad / 2) * aspect);
      const distForHeight = 7.0;
      cam.position.set(0, 1.2, Math.max(distForWidth, distForHeight));
      cam.lookAt(0, 0.4, 0);
      cam.updateProjectionMatrix();
    };

    updateCamera(camera, width, height);

    // WebGL Renderer with ACES Filmic tone mapping
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL init error', e);
      setIsLoading(false);
      return;
    }

    // Studio Environment Reflections
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      const roomEnv = new RoomEnvironment();
      scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
      roomEnv.dispose();
      pmremGenerator.dispose();
    } catch {
      // Safe fallback
    }

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Cinematic Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xf4f7ff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 3.5);
    keyLight.position.set(7, 8, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7fb2d9, 2.0);
    fillLight.position.set(-8, 3, 6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(0, 9, -5);
    scene.add(rimLight);

    const holoLight = new THREE.PointLight(0x00f0ff, 4.0, 15);
    holoLight.position.set(0, 0.6, 1.5);
    scene.add(holoLight);

    const goldLight = new THREE.PointLight(0xa8742a, 3.5, 20);
    goldLight.position.set(0, -0.5, 3.0);
    scene.add(goldLight);

    // Load Central Guide Hero GLB
    const loader = new GLTFLoader();
    let isMounted = true;

    loader.load(
      '/assets/guide/central_guide_hero.glb',
      (gltf) => {
        if (!isMounted) return;
        const model = gltf.scene;

        // Optimize materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.12, mat.roughness);
              if (mat.name.includes('Gold') || mat.name.includes('CG_Gold')) {
                mat.metalness = 0.95;
                mat.roughness = 0.16;
              } else if (mat.name.includes('Obsidian') || mat.name.includes('CG_Obsidian')) {
                mat.metalness = 0.88;
                mat.roughness = 0.20;
              }
              mat.needsUpdate = true;
            }
          }
        });

        // Compute Bounding Box to center properly
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y);
        const scale = 14.0 / (maxDim || 1);

        model.scale.setScalar(scale);
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale - 0.2;
        model.position.z = -center.z * scale;

        rootGroup.add(model);
        setIsLoading(false);
        onLoaded?.();
      },
      undefined,
      (err) => {
        console.warn('Could not load Central Guide Hero 3D GLB:', err);
        setIsLoading(false);
      }
    );

    // Dragging & Interactive Parallax
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      container.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        targetRotationY += deltaX * 0.007;
        targetRotationX += deltaY * 0.004;
        targetRotationX = Math.max(-0.35, Math.min(0.40, targetRotationX));
      } else {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationY = normX * 0.28;
        targetRotationX = normY * 0.15;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture?.(e.pointerId);
      } catch {
        // Safe ignore
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating breathing motion
      const idleFloatY = Math.sin(elapsed * 0.9) * 0.08;
      const idleTiltY = Math.sin(elapsed * 0.4) * 0.05;

      const destRotY = targetRotationY + (isDragging ? 0 : idleTiltY);
      const destRotX = targetRotationX;

      currentRotationY += (destRotY - currentRotationY) * 0.06;
      currentRotationX += (destRotX - currentRotationX) * 0.06;

      rootGroup.rotation.y = currentRotationY;
      rootGroup.rotation.x = currentRotationX;
      rootGroup.position.y = idleFloatY;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 1100;
      height = container.clientHeight || 580;
      updateCamera(camera, width, height);
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onLoaded]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F8F9FF]/60 backdrop-blur-sm z-10 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full border-2 border-[#3368A0]/30 border-t-[#A8742A] animate-spin" />
          <span className="text-xs font-mono tracking-widest text-[#3368A0] uppercase">
            Synthesizing 3D Sovereign Diorama...
          </span>
        </div>
      )}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="Interactive 3D Central Guide Hero Diorama"
        role="img"
      />
    </div>
  );
};

export default CentralGuideHero3DCanvas;
