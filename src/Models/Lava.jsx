import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useMemo, useRef } from "react";
import { DoubleSide } from "three";
import { color, mix,uv, time,mul,mx_fractal_noise_vec3,step,sin,positionLocal,add,vertexIndex,hash,vec3,uniform } from "three/tsl";
import { useControls } from "leva";
export default function Lava() {
  const colorSetting = useControls("Post Processing", {
    colorA: {
      value: "#db7f3e"
    },
    colorB: {
      value: "#e5330b"
    } 
  });
  const groupRef = useRef()

  const {nodes,uniforms} = useMemo(()=>{
    const uniforms = {
      colorA: uniform(color(colorSetting.colorA)),
      colorB: uniform(color(colorSetting.colorB))
    }
    const uvFlow = uv().add(vec3(time.mul(0.05), time.mul(0.03), 0))
    const uvDistorted = uvFlow.add(mx_fractal_noise_vec3(uv().mul(4)).mul(0.2))
    const baseNoise = mx_fractal_noise_vec3(uvDistorted.mul(6)).x
    const fineNoise = mx_fractal_noise_vec3(uvDistorted.mul(20)).x
    const combinedNoise = mix(baseNoise, fineNoise, 0.5)
    const finalColor = mix(color(uniforms.colorA),color(uniforms.colorB),combinedNoise)
    const randHeight = hash(vertexIndex).mul(0.1).mul(sin(time.mul(1.5)))
    const finalPosition = positionLocal.add(vec3(randHeight.mul(1.5),randHeight,randHeight))
    return {
        uniforms,
        nodes :{
            side: DoubleSide,
            emissiveNode: finalColor,
            colorNode: finalColor,
            positionNode: finalPosition
        }
    }
  },[])
  useFrame((scene,delta)=>{
    uniforms.colorA.value.set(colorSetting.colorA)
    uniforms.colorB.value.set(colorSetting.colorB)
  })

 

  return (
    <RigidBody type="fixed">
      <mesh rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[10,10,25,25]}/>
        <meshStandardNodeMaterial {...nodes}/>
      </mesh>
      
    </RigidBody>
  );
}
