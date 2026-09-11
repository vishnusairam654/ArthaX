'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ShopVault3DCanvasProps {
  className?: string;
  height?: number | string;
}

export function ShopVault3DCanvas({ className = '', height = 340 }: ShopVault3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let reqId: number;
    let clock = 0;

    const width = container.clientWidth || 400;
    const canvasHeight = typeof height === 'number' ? height : container.clientHeight || 340;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 1000);
    camera.position.set(0, 1.2, 5.2);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Institutional Materials: Deep Blue #1E3A5F & Arth Gold #D4A359 & Cream #F4EDE0
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xD4A359,
      roughness: 0.28,
      metalness: 0.85
    });

    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x1E3A5F,
      roughness: 0.35,
      metalness: 0.6
    });

    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xF4EDE0,
      roughness: 0.2,
      metalness: 0.3
    });

    // Central Monolith (Octagonal Sovereign Ledger Node)
    const coreGeo = new THREE.CylinderGeometry(0.8, 0.95, 1.8, 8);
    const coreMesh = new THREE.Mesh(coreGeo, blueMat);
    coreMesh.position.y = 0;
    masterGroup.add(coreMesh);

    // Gold Core Ring / Caps
    const capGeo = new THREE.CylinderGeometry(0.85, 0.82, 0.15, 8);
    const capMeshTop = new THREE.Mesh(capGeo, goldMat);
    capMeshTop.position.y = 0.98;
    masterGroup.add(capMeshTop);

    const capMeshBottom = new THREE.Mesh(capGeo, goldMat);
    capMeshBottom.position.y = -0.98;
    masterGroup.add(capMeshBottom);

    // Floating Nested Orbital Rings (Financial Continuous Linked Settlement Ring)
    const ringGeo1 = new THREE.TorusGeometry(1.65, 0.035, 16, 80);
    const ring1 = new THREE.Mesh(ringGeo1, goldMat);
    ring1.rotation.x = Math.PI / 3;
    masterGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.05, 0.025, 16, 80);
    const ring2 = new THREE.Mesh(ringGeo2, lightMat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    masterGroup.add(ring2);

    // Orbiting Settlement Nodes
    const nodeGroup = new THREE.Group();
    masterGroup.add(nodeGroup);

    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeCount = 5;
    const nodes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const node = new THREE.Mesh(sphereGeo, i % 2 === 0 ? goldMat : lightMat);
      node.userData = { angle, distance: 1.65, speed: 0.015 + i * 0.002 };
      nodeGroup.add(node);
      nodes.push(node);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const blueFill = new THREE.PointLight(0x66A3BF, 2.4, 15);
    blueFill.position.set(-4, -2, 3);
    scene.add(blueFill);

    const goldPoint = new THREE.PointLight(0xD4A359, 3.2, 10);
    goldPoint.position.set(3, 2, -2);
    scene.add(goldPoint);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / (rect.width || 1)) * 2 - 1;
      mouseY = -(y / (rect.height || 1)) * 2 + 1;
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = typeof height === 'number' ? height : container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      clock += 0.016;

      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.25;

      masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.05 + 0.003;
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.05;

      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;
      ring2.rotation.x += Math.sin(clock * 0.5) * 0.002;

      nodes.forEach((node) => {
        node.userData.angle += node.userData.speed;
        node.position.x = Math.cos(node.userData.angle) * node.userData.distance;
        node.position.y = Math.sin(node.userData.angle * 2) * 0.35;
        node.position.z = Math.sin(node.userData.angle) * node.userData.distance;
      });

      const s = 1 + Math.sin(clock * 1.5) * 0.015;
      coreMesh.scale.set(s, 1, s);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      coreGeo.dispose();
      capGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      sphereGeo.dispose();
      goldMat.dispose();
      blueMat.dispose();
      lightMat.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none pointer-events-auto ${className}`}
      style={{ height }}
    />
  );
}
