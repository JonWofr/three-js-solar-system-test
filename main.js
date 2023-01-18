import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Light
const light = new THREE.PointLight(0xffffff, 2, 1000);
scene.add(light);
const lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

// Grid
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight
);
camera.position.z = 40;
camera.position.y = 2;
camera.position.x = -12;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    emissive: 0xdddddd,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = new Array(3).fill().map(() => Math.random() * 100 - 50);
  star.position.set(x, y, z);
  scene.add(star);
}
new Array(200).fill().forEach(addStar);

// Moon
const moonTexture = new THREE.TextureLoader().load('/moon.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);
scene.add(moon);

// Earth
const earthTexture = new THREE.TextureLoader().load('/earth.jpeg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: earthTexture })
);
scene.add(earth);

// Sun
const sunTexture = new THREE.TextureLoader().load('/sun.jpeg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshStandardMaterial({
    emissiveMap: sunTexture,
    emissive: 0xffffff,
  })
);
scene.add(sun);

const backgroundTexture = new THREE.CubeTextureLoader().load([
  '/right.png',
  '/left.png',
  '/top.png',
  '/bottom.png',
  '/front.png',
  '/back.png',
]);
scene.background = backgroundTexture;

function render(time) {
  time *= 0.001;

  const earthOrbitAngle = ((time % 10) / 10) * Math.PI * 2;
  const earthOrbitRadius = 20;
  const earthX = Math.cos(earthOrbitAngle) * earthOrbitRadius;
  const earthZ = Math.sin(earthOrbitAngle) * earthOrbitRadius;
  earth.rotateY(((time % 10) / 10) * 0.01);

  earth.position.x = earthX;
  earth.position.z = earthZ;

  const moonOrbitAngle = ((time % 2) / 2) * Math.PI * 2;
  const moonOrbitRadius = 5;
  const moonX = earthX + Math.cos(moonOrbitAngle) * moonOrbitRadius;
  const moonZ = earthZ + Math.sin(moonOrbitAngle) * moonOrbitRadius;

  moon.position.x = moonX;
  moon.position.z = moonZ;
  moon.rotateY(((time % 10) / 10) * 0.01);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

function moveCamera() {
  const progress =
    document.documentElement.scrollTop /
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight);
  camera.position.z = 40 - progress * 50;
  camera.rotation.y = progress * -Math.PI * 0.5;
  camera.position.x = -12 - progress * 10;
}

document.body.onscroll = moveCamera;
