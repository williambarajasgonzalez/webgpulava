import React, { Suspense, useState } from "react";
import * as THREE from "three/webgpu";
import { Canvas, extend } from "@react-three/fiber";
import Experience from "./GameEngine/Experience";
import { Physics } from "@react-three/rapier";
import { Html, OrbitControls, Stats } from "@react-three/drei";
import { PostProcessing } from "./GameEngine/PostProcessing";
import {useControls} from "leva"
extend(THREE);

export default function App() {
  const ppSettings = useControls("Post Processing", {
    strength: {
      value: 1.3,
      min: 0,
      max: 10,
      step: 0.1,
    },
    radius: {
      value: 0,
      min: 0,
      max: 10,
      step: 0.1,
    },
    threshold: {
      value: 0.33,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });
  return (
    <div className="w-full h-screen">
      <h1 className="absolute text-white z-20 w-full flex justify-center p-2" >Lava</h1>
      <Canvas
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props);
          await renderer.init();
          return renderer;
        }}
      >
        <Stats />
        <OrbitControls />
        <ambientLight intensity={1.0} />
        <Suspense fallback={<Html><h1>loading...</h1></Html>}>
          <Physics>
            <Experience />
          </Physics>
        </Suspense>
        <PostProcessing {...ppSettings}/>
      </Canvas>
    </div>
  );
}

extend({
  MeshBasicNodeMaterial: THREE.MeshBasicNodeMaterial,
  MeshStandardNodeMaterial: THREE.MeshStandardNodeMaterial,
});
