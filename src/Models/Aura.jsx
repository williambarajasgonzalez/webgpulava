import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useMemo, useRef } from "react";
import { DoubleSide } from "three";
import { color, mix,uv, time,mul,mx_fractal_noise_vec3,step,sin,positionLocal,add,vertexIndex,hash,vec3,uniform } from "three/tsl";
import { useControls } from "leva";
export default function Aura() {
  const colorSetting = useControls("Post Processing", {
    colorA: {
      value: "#6ef74f"
    },
    colorB: {
      value: "#33f507"
    } 
  });
  const groupRef = useRef()

  const {nodes,uniforms} = useMemo(()=>{
    const uniforms = {
      colorA: uniform(color(colorSetting.colorA)),
      colorB: uniform(color(colorSetting.colorB))
    }
    const uvCoord = uv()
    const scaledUV = mul(uvCoord,25.0)
    const noise = mx_fractal_noise_vec3(scaledUV).x
    const surfaceColor = mix(uniforms.colorA, uniforms.colorB, sin(noise.mul(time.mul(10))))
    const alpha = step(surfaceColor,noise)
    const randHeight = hash(vertexIndex).mul(0.2).mul(sin(time.mul(0.5)))
    const finalPosition = positionLocal.add(vec3(randHeight,randHeight,randHeight))
    return {
        uniforms,
        nodes :{
            colorNode: surfaceColor,
            side: DoubleSide,
            opacityNode: alpha,
            emissiveNode: surfaceColor,
            positionNode: finalPosition
        }
    }
  },[])
  useFrame((scene,delta)=>{
    if(groupRef.current){
      groupRef.current.rotation.y += delta * 0.05
      uniforms.colorA.value.set(colorSetting.colorA)
      uniforms.colorB.value.set(colorSetting.colorB)
    }
  })

  return (
    <RigidBody type="fixed">
      <group scale={[0.7,1.5,1]} ref={groupRef}>
      <mesh>
        <torusKnotGeometry args={[1.2,0.08,150,4]} />
        <meshStandardNodeMaterial {...nodes} transparent />
      </mesh>
      <mesh position={[0.1,0.1,0.2]} rotation={[1,0,0]} >
        <torusKnotGeometry args={[1.2,0.08,150,4]} />
        <meshStandardNodeMaterial {...nodes} transparent />
      </mesh>
      <mesh scale={[2.0,0.5,0.5]} position={[0,-1,0.2]} rotation={[1,0,0]}>
        <torusKnotGeometry args={[1.2,0.08,150,4]} />
        <meshStandardNodeMaterial {...nodes} transparent />
      </mesh>
      </group >
      
      
    </RigidBody>
  );
}
