import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

function STLModel({ url }) {
    const geometry = useLoader(STLLoader, url);
    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial color="lightblue" />
        </mesh>
    );
}

function ModelViewer({ url }) {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
                <Stage>
                    <STLModel url={url} />
                </Stage>
            </Suspense>
            <OrbitControls />
        </Canvas>
    );
}

export default ModelViewer;
