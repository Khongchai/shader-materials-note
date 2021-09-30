import * as THREE from "three"
import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import img1 from "./img/Img1.jpg"
import img2 from "./img/Img2.jpg"
import disp from "./img/displacement/10.jpg"
import "./ImageFadeMaterial"

function FadingImage() {
  const ref = useRef()
  const [texture1, texture2, dispTexture] = useLoader(THREE.TextureLoader, [img1, img2, disp])
  const [hovered, setHover] = useState(false)
  useFrame(() => (ref.current.dispFactor = THREE.MathUtils.lerp(ref.current.dispFactor, !!hovered, 0.1)))
  return (
    <mesh onPointerMove={(e) => setHover(true)} onPointerOut={(e) => setHover(false)}>
      <planeGeometry />
      <imageFadeMaterial ref={ref} tex={texture1} tex2={texture2} disp={dispTexture} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
      <Suspense fallback={null}>
        <FadingImage />
      </Suspense>
    </Canvas>
  )
}
