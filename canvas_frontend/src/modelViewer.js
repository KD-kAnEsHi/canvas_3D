import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { MeshStandardMaterial } from "three"; // AmbientLight and PointLight are components, not imports

function STLModel({ url }) {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry} scale={0.02}>
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}

function ModelViewer({ modelUrl }) {
  return (
    <div style={{ width: 500, height: 400 }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <STLModel url={modelUrl} />
          </Stage>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default ModelViewer;
