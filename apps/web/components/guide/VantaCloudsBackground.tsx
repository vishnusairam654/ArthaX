'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VantaEffectInstance {
  destroy: () => void;
  resize: () => void;
  animationLoop?: () => void;
  req?: number | null;
}

declare global {
  interface Window {
    THREE?: unknown;
    VANTA?: {
      CLOUDS: (options: Record<string, unknown>) => VantaEffectInstance;
      [key: string]: unknown;
    };
  }
}

export function VantaCloudsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<VantaEffectInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Respect prefers-reduced-motion (Skill 21 / ambient-motion-vanta rule 2)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
      return;
    }

    let isDestroyed = false;

    // Helper to load a script as a Promise
    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existing = document.getElementById(id) as HTMLScriptElement | null;
        if (existing) {
          if (existing.getAttribute('data-loaded') === 'true') {
            resolve();
            return;
          }
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', (e) => reject(e));
          return;
        }

        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = false; // preserve order
        script.onload = () => {
          script.setAttribute('data-loaded', 'true');
          resolve();
        };
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });
    };

    const initClouds = () => {
      if (isDestroyed || !containerRef.current || vantaEffect.current) return;
      if (!window.VANTA?.CLOUDS) return;

      try {
        // ARTHAX Sovereign Palette:
        // skyColor: Soft Blue (#66a3bf)
        // cloudColor: Sage Mint (#dcebe8)
        // cloudShadowColor: Deep Blue (#1e4266)
        // sunColor / sunlight: Arth Gold (#b8822d / #faeed9)
        vantaEffect.current = window.VANTA.CLOUDS({
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 2.0,
          speed: 0.85,
          skyColor: 0x66a3bf,
          cloudColor: 0xdcebe8,
          cloudShadowColor: 0x1e4266,
          sunColor: 0xb8822d,
          sunlightColor: 0xfaeed9,
          sunGlareColor: 0xc99238,
          backgroundColor: 0xf2efe7,
        });

        setIsLoaded(true);

        // Force an initial resize once DOM layout finishes settling
        setTimeout(() => {
          if (vantaEffect.current) {
            vantaEffect.current.resize();
          }
        }, 100);
      } catch (err) {
        console.warn('[Vanta Clouds] Init error:', err);
      }
    };

    // 2. Load Three.js r134 then Vanta Clouds
    const init = async () => {
      try {
        if (!window.THREE) {
          // Try local vendor first, fallback to CDN
          try {
            await loadScript('/vendor/three.r134.min.js', 'three-r134-script');
          } catch {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', 'three-r134-script');
          }
        }

        if (!window.VANTA?.CLOUDS) {
          try {
            await loadScript('/vendor/vanta.clouds.min.js', 'vanta-clouds-script');
          } catch {
            await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js', 'vanta-clouds-script');
          }
        }

        initClouds();
      } catch (err) {
        console.warn('[Vanta Clouds] Script loading failed:', err);
      }
    };

    init();

    // 3. ResizeObserver to keep canvas sized accurately when hero image or viewport changes
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (vantaEffect.current) {
          vantaEffect.current.resize();
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    // 4. Page Visibility API to pause rendering when tab is hidden (Skill 27 rule 3)
    const handleVisibilityChange = () => {
      if (!vantaEffect.current) return;
      if (document.hidden) {
        if (vantaEffect.current.req) {
          window.cancelAnimationFrame(vantaEffect.current.req);
          vantaEffect.current.req = null;
        }
      } else {
        if (!vantaEffect.current.req && typeof vantaEffect.current.animationLoop === 'function') {
          vantaEffect.current.animationLoop();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. Cleanup on unmount
    return () => {
      isDestroyed = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  if (reducedMotion) {
    return (
      <div 
        className="w-full h-full bg-gradient-to-b from-[#66a3bf] via-[#dcebe8]/30 to-[#f2efe7]" 
        aria-hidden="true" 
      />
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-80'
      }`}
      style={{ minHeight: '100%', minWidth: '100%' }}
      aria-hidden="true"
    />
  );
}

export default VantaCloudsBackground;
