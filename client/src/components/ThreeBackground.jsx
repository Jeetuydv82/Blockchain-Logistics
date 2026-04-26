import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThreeBackground = () => {
  const canvasRef = useRef(null);
  const { darkMode } = useTheme();
  
  const sceneRef = useRef(null);
  const matRef = useRef(null);
  const flipTargetRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!window.THREE) return;
    const THREE = window.THREE;
    const canvas = canvasRef.current;
    
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6.5;

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const SEG = 80;
    const geo = new THREE.SphereGeometry(1, SEG, SEG);
    const posArr = geo.attributes.position.array;
    const COUNT = geo.attributes.position.count;

    const base = new Float32Array(COUNT * 3);
    const POWER = 5.5; 

    for (let i = 0; i < COUNT; i++) {
      const x = posArr[i*3], y = posArr[i*3+1], z = posArr[i*3+2];
      const ax = Math.max(Math.abs(x), 1e-6);
      const ay = Math.max(Math.abs(y), 1e-6);
      const az = Math.max(Math.abs(z), 1e-6);
      const ex = Math.sign(x) * Math.pow(ax, 2 / POWER);
      const ey = Math.sign(y) * Math.pow(ay, 2 / POWER);
      const ez = Math.sign(z) * Math.pow(az, 2 / POWER);
      const len = Math.sqrt(ex*ex + ey*ey + ez*ez);
      base[i*3] = ex/len; base[i*3+1] = ey/len; base[i*3+2] = ez/len;
    }

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        baseColor: { value: new THREE.Vector3(0.02, 0.02, 0.02) },
        rimColor:  { value: new THREE.Vector3(0.6, 0.6, 0.6) },
        rimPow:    { value: 2.8 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        uniform vec3 baseColor;
        uniform vec3 rimColor;
        uniform float rimPow;
        void main(){
          vec3 n = normalize(vNormal);
          vec3 v = normalize(vViewDir);
          float rim = 1.0 - abs(dot(n, v));
          rim = pow(rim, rimPow);
          gl_FragColor = vec4(baseColor + rimColor * rim, 1.0);
        }
      `
    });
    matRef.current = mat;

    const blob = new THREE.Mesh(geo, mat);
    scene.add(blob);

    function sn(x, y, z) {
      return (
        Math.sin(x * 1.4 + y * 2.2) * Math.cos(y * 1.8 + z * 1.5) +
        Math.sin(z * 2.5 + x * 1.2) * Math.cos(x * 2.0 + y * 0.9) +
        Math.cos(x * 0.8 + z * 2.1 + y * 1.6)
      ) * 0.333;
    }

    const BSIZE = 2.2;  
    const NAMT  = 0.14; 

    function updateBlob(t) {
      for (let i = 0; i < COUNT; i++) {
        const bx = base[i*3], by = base[i*3+1], bz = base[i*3+2];
        const n = sn(bx * 1.9 + t * 0.38, by * 1.9 + t * 0.32, bz * 1.9 + t * 0.28);
        const s = BSIZE + n * NAMT * BSIZE;
        posArr[i*3] = bx * s; posArr[i*3+1] = by * s; posArr[i*3+2] = bz * s;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
    }

    let autoY = 0, autoX = 0;
    let flipCurrent = 0;

    window.spinBlob = () => {
      flipTargetRef.current += Math.PI;
    };

    function animate() {
      animationRef.current = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      updateBlob(t);

      autoY += 0.0035;
      autoX += 0.0018;
      flipCurrent += (flipTargetRef.current - flipCurrent) * 0.055;

      blob.rotation.y = autoY + flipCurrent;
      blob.rotation.x = autoX;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      delete window.spinBlob;
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !matRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const scene = sceneRef.current;
    const mat = matRef.current;

    if (!darkMode) {
      scene.background = new THREE.Color(0xeaeaeb);
      mat.uniforms.baseColor.value.set(0.82, 0.82, 0.84);
      mat.uniforms.rimColor.value.set(0.3, 0.3, 0.35);
      mat.uniforms.rimPow.value = 2.4;
    } else {
      scene.background = new THREE.Color(0x000000);
      mat.uniforms.baseColor.value.set(0.02, 0.02, 0.02);
      mat.uniforms.rimColor.value.set(0.6, 0.6, 0.6);
      mat.uniforms.rimPow.value = 2.8;
    }
  }, [darkMode]);

  return <canvas id="c" ref={canvasRef} className="three-bg-canvas" />;
};

export default ThreeBackground;
