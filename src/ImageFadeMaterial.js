import * as THREE from "three"
import { extend } from "@react-three/fiber"

export class ImageFadeMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        effectFactor: { value: 1.2 },
        dispFactor: { value: 0 },
        tex: { value: undefined },
        tex2: { value: undefined },
        disp: { value: undefined }
      },
      vertexShader: `varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
      fragmentShader: `varying vec2 vUv;
      uniform sampler2D tex;
      uniform sampler2D tex2;
      uniform sampler2D disp;
      uniform float _rot;
      uniform float dispFactor;
      uniform float effectFactor;
      void main() {
        vec2 uv = vUv;
        vec4 disp = texture2D(disp, uv);

        /*
          With only uv.x and uv.y, it would be a cross fade between the two image, thanks to the mix function.
          (1.0 - dispFactor) is an offset. Once dispFactor is 1.0, yOffset will be 0, so no more offset.

          Lastly, lerpTexture is the texture we would like to use as the transition point. The texture will be 
          visible when dispFactor is not 0 -- when lerping is in effect.
        */
        float offset = 1.0 - dispFactor;
        float lerpTexture = (disp.r + 1.0) * effectFactor;
        float swipeInDistance = 0.2;
        vec2 distortedPosition = vec2(uv.x  , uv.y + dispFactor * lerpTexture);
        vec2 distortedPosition2 = vec2(uv.x , uv.y - (offset * lerpTexture) * swipeInDistance);

        vec4 _texture = texture2D(tex, distortedPosition);
        vec4 _texture2 = texture2D(tex2, distortedPosition2);
        vec4 finalTexture = mix(_texture, _texture2, dispFactor);

        gl_FragColor = finalTexture;
      }`
    })
  }

  get effectFactor() {
    return this.uniforms.effectFactor.value
  }
  set effectFactor(v) {
    return (this.uniforms.effectFactor.value = v)
  }
  get dispFactor() {
    return this.uniforms.dispFactor.value
  }
  set dispFactor(v) {
    return (this.uniforms.dispFactor.value = v)
  }
  get tex() {
    return this.uniforms.tex.value
  }
  set tex(v) {
    return (this.uniforms.tex.value = v)
  }
  get tex2() {
    return this.uniforms.tex2.value
  }
  set tex2(v) {
    return (this.uniforms.tex2.value = v)
  }
  get disp() {
    return this.uniforms.disp.value
  }
  set disp(v) {
    return (this.uniforms.disp.value = v)
  }
}

extend({ ImageFadeMaterial })
