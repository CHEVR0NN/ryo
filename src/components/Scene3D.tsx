"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const CORAL = "#E294A2";
const GOLD = "#E8BF87";
const AZURE = "#1E9AFF";

function starShape() {
  const outerRadius = 0.5;
  const innerRadius = 0.2;
  const points = 5;
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  }
  shape.closePath();
  return shape;
}

function heartShape() {
  // Two symmetric lobes with a cleft at 70% height, tapering to a single
  // point at the bottom — the standard proportions behind the canonical
  // "canvas heart" tutorial shape. The previous control points (borrowed
  // from three.js's own example) only trace a single-peaked, lopsided
  // blob with a shallow dimple near the bottom, not a heart.
  const shape = new THREE.Shape();
  const halfW = 0.5;
  const top = 1;
  const cleft = 0.7;
  const mid = 0.35;
  shape.moveTo(0, cleft);
  shape.bezierCurveTo(0, top, -halfW, top, -halfW, cleft);
  shape.bezierCurveTo(-halfW, mid, 0, mid, 0, 0);
  shape.bezierCurveTo(0, mid, halfW, mid, halfW, cleft);
  shape.bezierCurveTo(halfW, top, 0, top, 0, cleft);
  return shape;
}

type HeartPlacement = {
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
};

function Hearts({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(heartShape(), {
      depth: 0.4,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    geo.scale(0.25, 0.25, 0.25);
    geo.center();
    return geo;
  }, []);

  const [placements, setPlacements] = useState<HeartPlacement[]>([]);

  useEffect(() => {
    // One-time random placement generation for a decorative background;
    // there is no way to derive this from props/state, so it must live in
    // an effect rather than render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlacements(
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        rotation: [0, 0, (Math.random() - 0.5) * 0.6] as [number, number, number],
        speed: 0.5 + Math.random() * 1.5,
      }))
    );
  }, [count]);

  return (
    <>
      {placements.map((p, i) => (
        <Float
          key={i}
          speed={reduceMotion ? 0 : p.speed}
          rotationIntensity={reduceMotion ? 0 : 0.6}
          floatIntensity={reduceMotion ? 0 : 1.2}
          position={p.position}
        >
          <mesh geometry={geometry} rotation={p.rotation}>
            <meshStandardMaterial color={CORAL} roughness={0.4} metalness={0.1} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

type StarPlacement = {
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  scale: number;
};

function Stars({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(starShape(), {
      depth: 0.15,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    geo.center();
    return geo;
  }, []);

  const [placements, setPlacements] = useState<StarPlacement[]>([]);

  useEffect(() => {
    // One-time random placement generation for a decorative background;
    // there is no way to derive this from props/state, so it must live in
    // an effect rather than render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlacements(
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        rotation: [0, 0, (Math.random() - 0.5) * 0.6] as [number, number, number],
        speed: 0.4 + Math.random() * 1.2,
        scale: 0.6 + Math.random() * 0.6,
      }))
    );
  }, [count]);

  return (
    <>
      {placements.map((p, i) => (
        <Float
          key={i}
          speed={reduceMotion ? 0 : p.speed}
          rotationIntensity={reduceMotion ? 0 : 1}
          floatIntensity={reduceMotion ? 0 : 1.5}
          position={p.position}
        >
          <mesh geometry={geometry} rotation={p.rotation} scale={p.scale}>
            <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.2} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function PointerRig({ reduceMotion }: { reduceMotion: boolean }) {
  const { camera, pointer } = useThree();
  const target = useRef({ x: 0, y: 0 });

  // react-three-fiber's useFrame runs outside React's render cycle; mutating
  // camera/object transforms here is the standard r3f animation pattern.
  /* eslint-disable react-hooks/immutability */
  useFrame(() => {
    if (reduceMotion) return;
    target.current.x = pointer.x * 0.6;
    target.current.y = pointer.y * 0.4;
    camera.position.x += (target.current.x - camera.position.x) * 0.03;
    camera.position.y += (target.current.y - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

export default function Scene3D() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} color={AZURE} />
      <Hearts count={10} reduceMotion={reduceMotion} />
      <Stars count={8} reduceMotion={reduceMotion} />
      <Sparkles count={40} scale={10} size={2} speed={reduceMotion ? 0 : 0.3} color={GOLD} />
      <PointerRig reduceMotion={reduceMotion} />
    </Canvas>
  );
}
