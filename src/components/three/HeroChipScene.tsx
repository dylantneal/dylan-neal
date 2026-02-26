"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

function DylanModel() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/models/dylan.glb");

  const { scale: s, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Scale the model so its height is exactly 2.4 units
    // (leaves comfortable margin in a ~3.2-unit vertical frustum)
    const targetHeight = 3.2;
    const scale = targetHeight / size.y;

    return {
      scale,
      centerOffset: new THREE.Vector3(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      ),
    };
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={[s, s, s]}
      position={[centerOffset.x, centerOffset.y, centerOffset.z]}
    >
      <primitive object={scene} />
    </group>
  );
}

function ModelScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/*
        Camera positioned so a 2.4-unit tall object fits with ~15% padding.
        fov=40 at z=4 gives ~2.9 units of vertical visibility,
        plenty of room for the 2.4-unit model.
      */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <directionalLight position={[-3, 3, -2]} intensity={0.4} />
      <pointLight position={[1, 1, 3]} intensity={0.3} color="#c5a44e" />
      <Suspense fallback={null}>
        <DylanModel />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

export default ModelScene;
