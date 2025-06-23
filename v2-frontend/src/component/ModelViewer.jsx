import React, { Suspense, useRef, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

import "./ModelViewer.css"

function PlaceholderBox({position}) {
    const ref = useRef();
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false)

    useFrame((state, delta) => {
        if(ref.current) {
            ref.current.rotation.y += delta;
            ref.current.rotation.x += delta * 0.5;
        }
    });

    return (
        <mesh
        ref={ref}
        position={position}
        scale={active ? 1.4 : 1}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? "#ff69b4" : "#ffa500"} />
        </mesh>
    );
}

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
        <div className="obj-container">
            <Canvas camera={{ position: [0, 0, 5] }} className="obj-board">
                <ambientLight intensity={.5} />
                <pointLight position={[40, 10, 10]} />
                <Suspense fallback={null}>
                    <Stage>
                        {url ? (<STLModel url={url}/>) : (
                        <>
                            <PlaceholderBox position={[-1.5, 0, 0]} />
                            <PlaceholderBox position={[1.5, 0, 0]} />
                        </>
                        )}
                    </Stage>
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
}
export default ModelViewer;
