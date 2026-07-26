"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const CORAL = "#E294A2";
const GOLD = "#E8BF87";
const AZURE = "#1E9AFF";

function heartShape() {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;
  shape.moveTo(x, y + 0.3);
  shape.bezierCurveTo(x, y + 0.3, x - 0.5, y - 0.2, x - 1, y + 0.3);
  shape.bezierCurveTo(x - 1.6, y + 0.9, x - 0.8, y + 1.3, x, y + 0.6);
  shape.bezierCurveTo(x + 0.8, y + 1.3, x + 1.6, y + 0.9, x + 1, y + 0.3);
  shape.bezierCurveTo(x + 0.5, y - 0.2, x, y + 0.3, x, y + 0.3);
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
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
    geo.scale(0.25, 0.25, 0.25);
    geo.center();
    return geo;
  }, []);

  const [placements, setPlacements] = useState<HeartPlacement[]>([]);

  useEffect(() => {
    setPlacements(
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        rotation: [0, 0, Math.random() * Math.PI] as [number, number, number],
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
  speed: number;
  scale: number;
};

function Stars({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const [placements, setPlacements] = useState<StarPlacement[]>([]);

  useEffect(() => {
    setPlacements(
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        speed: 0.4 + Math.random() * 1.2,
        scale: 0.15 + Math.random() * 0.15,
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
          <mesh scale={p.scale}>
            <icosahedronGeometry args={[1, 0]} />
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
  // eslint-disable-next-line react-hooks/immutability
  useFrame(() => {
    if (reduceMotion) return;
    target.current.x = pointer.x * 0.6;
    target.current.y = pointer.y * 0.4;
    camera.position.x += (target.current.x - camera.position.x) * 0.03;
    camera.position.y += (target.current.y - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

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
