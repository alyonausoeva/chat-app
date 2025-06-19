import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Poop = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 2);
    scene.add(directionalLight);

    const material = new THREE.MeshStandardMaterial({
      color: 0x7a5230,
      roughness: 0.7,
      metalness: 0.1,
    });

    const geometry = new THREE.CylinderGeometry(0.66, 0.76, 1.8, 32, 24, true);
    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const wave = 0.06 * Math.sin(y * 10 + x * 5 + z * 5);
      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z) + wave;
      posAttr.setX(i, Math.cos(angle) * radius);
      posAttr.setZ(i, Math.sin(angle) * radius);
    }
    geometry.computeVertexNormals();

    function createBumpySphere(yPos: number, radius: number) {
      const sphereGeom = new THREE.SphereGeometry(radius, 32, 24);
      const posAttr = sphereGeom.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);
        const wave = 0.04 * Math.sin(x * 15 + y * 15 + z * 15);
        const len = Math.sqrt(x * x + y * y + z * z);
        const newLen = radius + wave;
        posAttr.setXYZ(i, (x / len) * newLen, (y / len) * newLen, (z / len) * newLen);
      }
      sphereGeom.computeVertexNormals();
      const mesh = new THREE.Mesh(sphereGeom, material);
      mesh.position.y = yPos;
      return mesh;
    }

    const bodyMesh = new THREE.Mesh(geometry, material);
    scene.add(bodyMesh);
    const topSphere = createBumpySphere(0.9, 0.66);
    scene.add(topSphere);
    const bottomSphere = createBumpySphere(-0.9, 0.76);
    scene.add(bottomSphere);

    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xf8f8f8 });
    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x2a1f17,
      roughness: 0.3,
      metalness: 0.1,
    });
    const highlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });

    const createMediumEye = (x: number) => {
      const eyeGroup = new THREE.Group();

      const sclera = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), scleraMat);
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.24, 32), irisMat);
      const highlight = new THREE.Mesh(new THREE.CircleGeometry(0.105, 16), highlightMat);

      sclera.position.set(0, 0, 0);
      iris.position.set(0, 0, 0.01);
      highlight.position.set(0.105, 0.105, 0.015);

      eyeGroup.add(sclera, iris, highlight);
      eyeGroup.position.set(x, 0.4, 0.82);
      return eyeGroup;
    };

    const leftEye = createMediumEye(-0.32);
    const rightEye = createMediumEye(0.32);
    scene.add(leftEye, rightEye);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      const jump = Math.abs(Math.sin(time * 2)) * 0.12;
      bodyMesh.position.y = jump;
      topSphere.position.y = 0.9 + jump;
      bottomSphere.position.y = -0.9 + jump;
      leftEye.position.y = 0.4 + jump;
      rightEye.position.y = 0.4 + jump;

      const blink = Math.sin(time * 2.2);
      const scaleY = blink > 0.9 ? 0.15 : 1;
      leftEye.scale.y = scaleY;
      rightEye.scale.y = scaleY;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: 500, height: 340, pointerEvents: 'none' }} />;
};
