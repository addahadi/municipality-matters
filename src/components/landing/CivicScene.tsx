/**
 * CivicScene.tsx
 * ------------------------------------------------------------------
 * A procedural low-poly civic skyline rendered with React Three Fiber.
 * - Zero external 3D files (no .glb to source/host/license).
 * - Colors mirror the .landing-theme tokens (navy / gold / teal).
 * - Slow, dignified auto-rotation. No flashy motion.
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
  navy: "#1b2b4b", // hsl(222 47% 18%)
  navyDeep: "#101a2e", // hsl(222 50% 12%)
  gold: "#b8893f", // hsl(41 46% 48%)
  teal: "#1a9488", // hsl(173 70% 34%)
  ground: "#16233d",
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
        buildings.push({
          x: (ix - grid / 2 + 0.5) * spacing,
          z: (iz - grid / 2 + 0.5) * spacing,
          w: 0.7 + rand() * 0.3,
          d: 0.7 + rand() * 0.3,
          h,
          lit: rand() > 0.82,
        });
      }
    }
    return buildings;
  }, []);
}

function City() {
  const group = useRef<THREE.Group>(null);
  const city = useCity();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.06; // slow, dignified
  });

  return (
    <group ref={group}>
      {/* Ground plate */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <cylinderGeometry args={[7.5, 7.5, 0.2, 48]} />
        <meshStandardMaterial color={COLOR.ground} flatShading />
      </mesh>

      {/* Buildings */}
      {city.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} castShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial
            color={b.lit ? COLOR.gold : COLOR.navy}
            emissive={b.lit ? COLOR.gold : COLOR.navyDeep}
            emissiveIntensity={b.lit ? 0.35 : 0.08}
            flatShading
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Central civic landmark (town-hall spire) on the plaza */}
      <Float speed={1.1} rotationIntensity={0} floatIntensity={0.4}>
        <group position={[0, 0, 0]}>
          <mesh position={[0, 1.1, 0]} castShadow>
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
          {/* Gold beacon */}
          <mesh position={[0, 3.35, 0]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color={COLOR.gold}
              emissive={COLOR.gold}
              emissiveIntensity={0.9}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export default function CivicScene() {
  return (
    <Canvas
      camera={{ position: [6.5, 4.8, 6.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 3]} intensity={1.1} color="#f4e4c1" />
      <directionalLight position={[-6, 4, -4]} intensity={0.4} color={COLOR.teal} />
      <City />
      <fog attach="fog" args={[COLOR.navyDeep, 12, 22]} />
    </Canvas>
  );
}
