import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec2 uMouse;
  uniform float uDarkMode;
  
  varying vec2 vUv;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 mouseEffect = (uMouse - 0.5) * 0.02;
    float t = uTime * 0.1;
    
    vec2 noiseCoord = uv * 2.5 + mouseEffect;
    
    float noise1 = fbm(noiseCoord + vec2(t * 0.3, t * 0.15));
    float noise2 = fbm(noiseCoord * 1.5 - vec2(t * 0.15, t * 0.3) + 30.0);
    float noise3 = fbm(noiseCoord * 0.8 + vec2(t * 0.1, t * 0.25) + 60.0);
    float noise4 = fbm(noiseCoord * 2.0 - vec2(t * 0.2, t * 0.1) + 90.0);
    
    float n1 = noise1 * 0.5 + 0.5;
    float n2 = noise2 * 0.5 + 0.5;
    float n3 = noise3 * 0.5 + 0.5;
    float n4 = noise4 * 0.5 + 0.5;
    
    vec3 color = uColor1;
    
    float violetMask = smoothstep(0.45, 0.7, n1) * smoothstep(0.8, 0.5, n2);
    float fuchsiaMask = smoothstep(0.5, 0.75, n2) * smoothstep(0.85, 0.5, n3);
    float cyanMask = smoothstep(0.4, 0.65, n3) * smoothstep(0.75, 0.4, n1);
    float pinkMask = smoothstep(0.55, 0.8, n4) * smoothstep(0.7, 0.4, n2);
    
    color = mix(color, uColor2, violetMask * 0.7);
    color = mix(color, uColor3, fuchsiaMask * 0.6);
    color = mix(color, uColor4, cyanMask * 0.5);
    color = mix(color, uColor3, pinkMask * 0.4);
    
    float glow = smoothstep(0.3, 0.8, n1 * n2);
    color += glow * 0.06;
    
    vec2 centered = uv - 0.5;
    float vignette = 1.0 - smoothstep(0.15, 0.75, length(centered) * 1.2);
    color *= mix(0.4, 1.0, vignette);
    
    float alpha = smoothstep(0.0, 0.35, n1 * n3) * 0.6 + 0.35;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const LiquidMesh = ({ 
  primaryColor = '#0b1326',
  secondaryColor = '#8B5CF6',
  tertiaryColor = '#D946EF',
  quaternaryColor = '#06B6D4',
  speed = 0.3,
  darkMode = true,
  mousePosition = { x: 0.5, y: 0.5 }
}) => {
  const meshRef = useRef();
  const { size } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uColor1: { value: new THREE.Color(primaryColor) },
    uColor2: { value: new THREE.Color(secondaryColor) },
    uColor3: { value: new THREE.Color(tertiaryColor) },
    uColor4: { value: new THREE.Color(quaternaryColor) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uDarkMode: { value: darkMode ? 1.0 : 0.0 },
  }), []);
  
  useEffect(() => {
    uniforms.uColor1.value.set(primaryColor);
    uniforms.uColor2.value.set(secondaryColor);
    uniforms.uColor3.value.set(tertiaryColor);
    uniforms.uColor4.value.set(quaternaryColor);
    uniforms.uDarkMode.value = darkMode ? 1.0 : 0.0;
  }, [primaryColor, secondaryColor, tertiaryColor, quaternaryColor, darkMode, uniforms]);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value += 0.008 * speed;
      meshRef.current.material.uniforms.uResolution.value.set(size.width, size.height);
      const u = meshRef.current.material.uniforms.uMouse.value;
      u.x += (mousePosition.x - u.x) * 0.025;
      u.y += (mousePosition.y - u.y) * 0.025;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

const AnimatedLiquidBackground = ({ 
  primaryColor = '#0b1326',
  secondaryColor = '#8B5CF6',
  tertiaryColor = '#D946EF',
  quaternaryColor = '#06B6D4',
  darkMode = true,
  speed = 0.3,
  interactive = true,
  className = ''
}) => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  const handleMouseMove = (e) => {
    if (interactive) {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: 1 - (e.clientY / window.innerHeight)
      });
    }
  };
  
  const bgColor = darkMode ? primaryColor : '#f1f5f9';
  
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full -z-10"
      onMouseMove={interactive ? handleMouseMove : undefined}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: bgColor }}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <LiquidMesh 
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          tertiaryColor={tertiaryColor}
          quaternaryColor={quaternaryColor}
          speed={speed}
          darkMode={darkMode}
          mousePosition={mousePos}
        />
      </Canvas>
      
      {!darkMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 -z-10" />
      )}
    </div>
  );
};

export default AnimatedLiquidBackground;