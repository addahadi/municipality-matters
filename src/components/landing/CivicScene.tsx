/**
 * CivicScene.tsx
 * ------------------------------------------------------------------
 * A procedural low-poly civic skyline rendered with React Three Fiber.
 * - Zero external 3D files (no .glb to source/host/license).
 * - Colors mirror the .landing-theme tokens (navy / gold / teal).
 * - Slow, dignified sway (not a full spin) so the plaza + spire stay
 *   in frame. Real shadow mapping + a hemisphere light give the
 *   buildings depth instead of flat-shaded silhouettes.
 * - The caller is responsible for NOT mounting this on
 *   mobile / prefers-reduced-motion (see LandingPage.tsx). A static
 *   image fallback is shown instead.
 *
 * Requires (run once):
 *   npm install three @react-three/fiber @react-three/drei
 * ------------------------------------------------------------------
 */
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* Hex equivalents of the .landing-theme HSL tokens (keep in sync). */
const COLOR = {
  navy: "#2a3d61", // lightened vs. the raw token so buildings read against the dark backdrop
  navyDeep: "#101a2e", // hsl(222 50% 12%)
  gold: "#a9873f", // muted brass; the raw token reads too neon on lit facades
  teal: "#1a9488", // hsl(173 70% 34%)
  ground: "#2c4270",
  sky: "#7d97c2", // hemisphere sky tone, lifts shadow-side faces
} as const;

/* Deterministic pseudo-random so the skyline is stable across renders. */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

type Building = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  lit: boolean; // gold-lit landmark
};

function useCity(): Building[] {
  return useMemo(() => {
    const rand = seeded(42);
    const buildings: Building[] = [];
    const grid = 6;
    const spacing = 1.6;
    for (let ix = 0; ix < grid; ix++) {
      for (let iz = 0; iz < grid; iz++) {
        // Center square is the civic plaza (skip -> open space + landmark).
        const isPlaza = ix >= 2 && ix <= 3 && iz >= 2 && iz <= 3;
        if (isPlaza) continue;
        const distToCenter = Math.hypot(ix - 2.5, iz - 2.5);
        const h = 0.6 + (grid - distToCenter) * 0.35 * (0.6 + rand() * 0.9);
        // Only the ring hugging the plaza is gold-lit, like a civic quarter
        // gathered around city hall, rather than lights scattered at random.
        const lit = distToCenter <= 1.6 && rand() > 0.55;
        buildings.push({
          x: (ix - grid / 2 + 0.5) * spacing,
          z: (iz - grid / 2 + 0.5) * spacing,
          w: 0.7 + rand() * 0.3,
          d: 0.7 + rand() * 0.3,
          h,
          lit,
        });
      }
    }
    return buildings;
  }, []);
}

// Faces the plaza opening toward the camera instead of a bare grid corner.
const BASE_ANGLE = Math.PI / 4;

function City() {
  const group = useRef<THREE.Group>(null);
  const city = useCity();

  useFrame(({ clock }) => {
    if (!group.current) return;
    // A gentle sway, not a full spin: keeps the landmark roughly camera-facing
    // at all times instead of drifting through awkward, self-blocking angles.
    group.current.rotation.y = BASE_ANGLE + Math.sin(clock.elapsedTime * 0.15) * 0.28;
  });

  return (
    // Shifted down so the skyline's vertical midpoint sits at the camera's
    // look-at point, instead of the ground plane (which crops rooftops into
    // empty sky and building bases below the frame).
    <group ref={group} position-y={-1.6}>
      {/* Ground plate */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <cylinderGeometry args={[7.5, 7.5, 0.2, 48]} />
        <meshStandardMaterial color={COLOR.ground} flatShading />
      </mesh>

      {/* Buildings */}
      {city.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} castShadow receiveShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial
            color={b.lit ? COLOR.gold : COLOR.navy}
            emissive={b.lit ? COLOR.gold : COLOR.navyDeep}
            emissiveIntensity={b.lit ? 0.22 : 0.12}
            flatShading
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Central civic landmark (town-hall spire) on the plaza */}
      <Float speed={1.1} rotationIntensity={0} floatIntensity={0.4}>
        <group position={[0, 0, 0]}>
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 2.2, 1.2]} />
            <meshStandardMaterial color={COLOR.navy} flatShading roughness={0.8} />
          </mesh>
          <mesh position={[0, 2.6, 0]} castShadow>
            <coneGeometry args={[0.95, 1.1, 4]} />
            <meshStandardMaterial
              color={COLOR.teal}
              emissive={COLOR.teal}
              emissiveIntensity={0.25}
              flatShading
            />
          </mesh>
          {/* Gold beacon, with a real light so it casts a warm glow on the roof below it */}
          <mesh position={[0, 3.35, 0]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color={COLOR.gold}
              emissive={COLOR.gold}
              emissiveIntensity={0.9}
            />
          </mesh>
          <pointLight position={[0, 3.35, 0]} color={COLOR.gold} intensity={0.6} distance={3} />
        </group>
      </Float>
    </group>
  );
}

export default function CivicScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [16, 9, 16], fov: 26 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.45} />
      <hemisphereLight args={[COLOR.sky, COLOR.navyDeep, 1.1]} />
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.15}
        color="#f4e4c1"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      <directionalLight position={[-6, 3, -8]} intensity={0.55} color={COLOR.teal} />
      <City />
      <fog attach="fog" args={[COLOR.navyDeep, 22, 32]} />
    </Canvas>
  );
}
