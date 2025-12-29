'use client';

import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';
import { useSpring } from 'react-spring';

export default function Globe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();

        // Adjust size based on screen width
        const isMobile = width < 600;

        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [1, 1, 1],
            markerColor: [0.83, 0.68, 0.21], // #D4AF37 Gold
            glowColor: [0, 0.12, 0.25], // #001F3F Navy
            markers: [
                // Europe
                { location: [48.8566, 2.3522], size: isMobile ? 0.08 : 0.1 }, // Paris
                { location: [51.5074, -0.1278], size: isMobile ? 0.08 : 0.1 }, // London
                { location: [52.5200, 13.4050], size: isMobile ? 0.08 : 0.1 }, // Berlin
                // Africa
                { location: [36.8065, 10.1815], size: isMobile ? 0.08 : 0.1 }, // Tunis
                { location: [30.0444, 31.2357], size: isMobile ? 0.08 : 0.1 }, // Cairo
                // Middle East
                { location: [25.2048, 55.2708], size: isMobile ? 0.08 : 0.1 }, // Dubai
                { location: [24.7136, 46.6753], size: isMobile ? 0.08 : 0.1 }, // Riyadh
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                if (!pointerInteracting.current) {
                    phi += 0.005;
                }
                state.phi = phi + r.get();
                state.width = width * 2;
                state.height = width * 2;
            },
        });
        setTimeout(() => (canvasRef.current!.style.opacity = '1'));
        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div className="w-full max-w-[600px] aspect-square mx-auto relative cursor-grab active:cursor-grabbing" style={{ contain: 'layout paint size' }}>
            <canvas
                ref={canvasRef}
                className="w-full h-full opacity-0 transition-opacity duration-1000"
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    canvasRef.current!.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 200,
                        });
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.touches[0]) {
                        const delta = e.touches[0].clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 100,
                        });
                    }
                }}
            />
        </div>
    );
}
