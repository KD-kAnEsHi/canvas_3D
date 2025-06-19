// src/modelViewer.js
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

function STLModel({ url }) {
  try {
    const geometry = useLoader(STLLoader, url);
    return (
      <mesh geometry={geometry} scale={0.02}>
        <meshStandardMaterial color="skyblue" />
      </mesh>
    );
  } catch (err) {
    console.error("Error loading STL:", err);
    return null;
  }
}

function ModelViewer({ modelUrl }) {
  return (
    <div style={{ width: "100%", height: "500px", marginTop: "24px", border: "1px solid #ccc" }}>
      <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            {modelUrl ? (
              <STLModel url={modelUrl} />
            ) : (
              // cube shown before model is loaded
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            )}
          </Stage>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default ModelViewer;
