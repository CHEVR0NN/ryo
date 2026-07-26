"use client";

import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function Scene3DCanvas() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Scene3D />
    </div>
  );
}
