import * as THREE from "three"
import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import img1 from "./img/Img1.jpg"
import img2 from "./img/Img2.jpg"
import disp from "./img/displacement/10.jpg"
import "./ImageFadeMaterial"

function FadingImage() {
  const ref = useRef()
  const [texture1, texture2, dispTexture] = useLoader(THREE.TextureLoader, [img1, img2, disp])
  const [hovered, setHover] = useState(false)
  useFrame(() => {
    /**
     * dispFactor is used in the ImageFadeMaterial to determine which image to use.
     * hint: it's actually a value for the mix() function in glsl
     */
    ref.current.dispFactor = lerp(ref.current.dispFactor, !!hovered, 0.1)
  })
  return (
    <mesh onPointerMove={(e) => setHover(true)} onPointerOut={(e) => setHover(false)}>
      <planeGeometry />
      <imageFadeMaterial ref={ref} tex={texture1} tex2={texture2} disp={dispTexture} />
    </mesh>
  )
}

/**
 * t = where do you want the lerping to start (0.5 = middle)
 *
 */
function lerp(x, y, t) {
  return x + (y - x) * t
  //re-arrange
  // return x + (t * y - t * x)
  // return (1 - t) * x + t * y
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
