"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh, Points } from "three";

/**
 * Ambient Guide Board background — a slow "currency current":
 * a breathing wire torus knot (the ledger's continuous flow) drifting through
 * a field of floating ARTH motes. Palette-locked, DPR-capped, pauses offscreen,
 * renders nothing under prefers-reduced-motion.
 */

function Knot() {
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!mesh.current) return;
    mesh.current.rotation.x = t * 0.12;
    mesh.current.rotation.y = t * 0.18;
    mesh.current.position.y = Math.sin(t * 0.4) * 0.25;
  });
  return (
    <mesh ref={mesh} position={[2.2, 0, -1]}>
      <torusKnotGeometry args={[1.6, 0.045, 220, 16]} />
      <meshStandardMaterial
        color="#66A3BF"
        emissive="#3368A0"
        emissiveIntensity={0.55}
        metalness={0.6}
        roughness={0.35}
      />
    </mesh>
  );
}

function Motes({ count = 260 }: { count?: number }) {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.getElapsedTime();
    points.current.rotation.y = t * 0.02;
    points.current.position.y = Math.sin(t * 0.15) * 0.15;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#A8742A" transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

export function LedgerCurrent() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  }
  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 3]} intensity={1.1} color="#F2EFE7" />
        <Knot />
        <Motes />
      </Canvas>
    </div>
  );
}
