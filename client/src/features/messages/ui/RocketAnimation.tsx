import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type RocketWithFireProps = {
  message: string;
};

export const Rocket = ({ message }: RocketWithFireProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  function createRocketWithPorthole(): THREE.Group {
    const group = new THREE.Group();
    const radius = 0.2;
    const cylinderHeight = 0.7;
    const segments = 32;

    const bodyGeometry = new THREE.CylinderGeometry(radius, radius, cylinderHeight, segments);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.7,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, material);
    bodyMesh.position.y = cylinderHeight / 2;
    group.add(bodyMesh);

    const coneHeight = 0.3;
    const coneGeometry = new THREE.ConeGeometry(radius, coneHeight, segments);
    const coneMesh = new THREE.Mesh(coneGeometry, material);
    coneMesh.position.y = cylinderHeight + coneHeight / 2;
    group.add(coneMesh);

    const wingGeometry = new THREE.PlaneGeometry(0.12, 0.28);
    const wingMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.2,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0, 0.15, 0.22);
    rightWing.rotation.y = Math.PI / 2;
    group.add(rightWing);

    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(0, 0.15, -0.22);
    leftWing.rotation.y = -Math.PI / 2;
    group.add(leftWing);

    const holeRadius = 0.07;
    const portholeGeometry = new THREE.CircleGeometry(holeRadius, 32);
    const portholeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.2,
    });
    const porthole = new THREE.Mesh(portholeGeometry, portholeMaterial);
    porthole.position.set(radius + 0.005, cylinderHeight / 2, 0);
    porthole.rotation.y = -Math.PI / 2;
    group.add(porthole);

    return group;
  }

  function createFire(): THREE.Group {
    const fireGroup = new THREE.Group();

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.ConeGeometry(0.08, 0.25, 8);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xffa500),
        emissive: new THREE.Color(0xff4500),
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const flame = new THREE.Mesh(geometry, material);
      flame.position.x = (i - 1) * 0.08;
      flame.position.y = -0.15;
      fireGroup.add(flame);
    }

    return fireGroup;
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 3, 4);
    scene.add(directionalLight);

    const rocket = createRocketWithPorthole();
    rocket.scale.set(0.2, 0.2, 0.2);
    rocket.rotation.y = -Math.PI / 2;
    scene.add(rocket);

    const fireGroup = createFire();
    fireGroup.position.y = 0;
    rocket.add(fireGroup);

    const clock = new THREE.Clock();

    const minSpeed = 0.5;
    const maxSpeed = 5.0;
    const maxMessageLength = 200;
    const clampedLength = Math.min(message.length, maxMessageLength);
    const speed = minSpeed + (maxSpeed - minSpeed) * (clampedLength / maxMessageLength);

    const directionAngle = ((Math.random() - 0.5) * Math.PI) / 6;
    const directionVector = new THREE.Vector3(Math.sin(directionAngle), 1, 0).normalize();

    rocket.position.set((Math.random() - 0.5) * 2, -3, 0);

    let animationFrameId: number;
    const animate = () => {
      const delta = clock.getDelta();
      const moveDistance = speed * delta;

      rocket.position.addScaledVector(directionVector, moveDistance);

      fireGroup.children.forEach((child, i) => {
        if (!(child instanceof THREE.Mesh)) return;

        const flame = child;
        const time = clock.elapsedTime;

        flame.scale.y = 1.5 + 1.0 * Math.sin(time * 20 + (i * Math.PI) / 2);
        flame.scale.x = 1 + 0.5 * Math.sin(time * 25 + i);
        flame.scale.z = 1 + 0.5 * Math.sin(time * 25 + i);

        const hue = 0.08 + 0.15 * Math.sin(time * 30 + i);
        const lightness = 0.4 + 0.5 * Math.sin(time * 30 + i);

        const material = flame.material as THREE.MeshStandardMaterial;
        material.color.setHSL(hue, 1, lightness);
        material.opacity = 0.6 + 0.6 * Math.sin(time * 30 + i * 3);
        material.emissiveIntensity = 1.2 + 1.0 * Math.sin(time * 30 + i * 3);
      });

      renderer.render(scene, camera);

      if (rocket.position.y < 5) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      container.removeChild(renderer.domElement);
    };
  }, [message]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};
