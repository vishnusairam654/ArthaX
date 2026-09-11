'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const ArthaxLogo3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 540;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 1000);

    // Dynamic Camera Distance calculation to ensure the 2.5x enlarged logo (target width 12.5)
    // perfectly fits horizontally on widescreen while dynamically framing on narrow/mobile viewports
    const updateCameraDistance = (cam: THREE.PerspectiveCamera, w: number, h: number) => {
      const aspect = w / h;
      cam.aspect = aspect;
      const targetWidth = 12.5; // 2.5x enlarged width
      const fovRad = THREE.MathUtils.degToRad(cam.fov);
      const distForWidth = (targetWidth * 1.12) / (2 * Math.tan(fovRad / 2) * aspect);
      const distForHeight = 5.8;
      cam.position.z = Math.max(distForWidth, distForHeight);
      cam.updateProjectionMatrix();
    };

    updateCameraDistance(camera, width, height);

    // High performance antialiased transparent renderer
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
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed', e);
      return;
    }

    // Studio Environment Reflections for rich metallic sheen across obsidian & gold
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      const roomEnv = new RoomEnvironment();
      scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
      roomEnv.dispose();
      pmremGenerator.dispose();
    } catch {
      // Graceful fallback if PMREM not available
    }

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Studio Lighting calibrated for 2.5x wide span
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 3.6);
    keyLight.position.set(8, 8, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90b8d0, 2.2);
    fillLight.position.set(-9, -3, 7);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.4);
    rimLight.position.set(0, 10, 4);
    scene.add(rimLight);

    const goldAccentLight = new THREE.PointLight(0xa8742a, 5.5, 35);
    goldAccentLight.position.set(0, 1.5, 4);
    scene.add(goldAccentLight);

    // Load 3D ARTHAX Logo GLB (Scaled 2.5x)
    const loader = new GLTFLoader();
    let isMounted = true;

    loader.load(
      '/assets/brand/arthax_logo_3d.glb',
      (gltf) => {
        if (!isMounted) return;
        const model = gltf.scene;

        // Ensure materials have optimal metallic sheen and reflection
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.12, mat.roughness);
              mat.metalness = Math.min(0.98, Math.max(0.85, mat.metalness));
              mat.needsUpdate = true;
            }
          }
        });

        // Compute Bounding Box and scale by 2.5x (target max dimension = 12.5)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y);
        const scale = 12.5 / (maxDim || 1); // 2.5x the original 5.0 scale

        model.scale.setScalar(scale);
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        modelGroup.add(model);
      },
      undefined,
      (err) => {
        console.warn('Could not load 3D GLB model:', err);
      }
    );

    // Interaction State: Dragging & Parallax with Smooth Inertia
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
        targetRotationX += deltaY * 0.005;
        targetRotationX = Math.max(-0.45, Math.min(0.45, targetRotationX));
      } else {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationY = normX * 0.32;
        targetRotationX = normY * 0.18;
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

    // Animation Loop with Smooth Damping (Lerp)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Majestic gentle floating breathing motion
      const idleFloatY = Math.sin(elapsedTime * 1.0) * 0.12;
      const idleTiltY = Math.sin(elapsedTime * 0.45) * 0.08;

      // Smooth interpolation for rotation
      const destRotY = targetRotationY + (isDragging ? 0 : idleTiltY);
      const destRotX = targetRotationX;

      currentRotationY += (destRotY - currentRotationY) * 0.06;
      currentRotationX += (destRotX - currentRotationX) * 0.06;

      modelGroup.rotation.y = currentRotationY;
      modelGroup.rotation.x = currentRotationX;
      modelGroup.position.y = idleFloatY;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 1000;
      const newHeight = container.clientHeight || 540;
      updateCameraDistance(camera, newWidth, newHeight);
      renderer.setSize(newWidth, newHeight);
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
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      aria-label="Interactive 3D ARTHAX Sovereign Emblem (Enlarged 2.5x)"
      role="img"
    />
  );
};

export default ArthaxLogo3DCanvas;
