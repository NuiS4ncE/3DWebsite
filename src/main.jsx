import * as THREE from "three";
import * as OIMO from "oimo";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Threejs scene
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(15, 15, 30);
scene.add(camera);

// Oimo world setup
const world = new OIMO.World({
  timestep: 1 / 60,
  iterations: 8,
  broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
  worldscale: 1,
  random: true,
  info: true, // display statistique
  gravity: [0, -9.81, 0],
});

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background
//var backgroundColor = 0xCDD3D6;
//renderer.setClearColor(backgroundColor, 1);

// Mixer variable for later use
let mixer;

let danceIndex;
const trueValue = false;
if(trueValue) {
  danceIndex = 1;
} else {
  danceIndex = 0;

}
// GLTF loading
const loader = new GLTFLoader();
loader.load('src/GLBFiles/aliendancemixamo.glb', function ( gltf )
{
  // Scale the model
  gltf.scene.scale.set(10, 10, 10);

  // Add model to the scene
  scene.add(gltf.scene);

  // Add model to an AnimationMixer
  mixer = new THREE.AnimationMixer(gltf.scene);

  // Add one of the model's animations to mixer clips
  const danceAction = mixer.clipAction(gltf.animations[danceIndex]);
  
  // Play the animation
  danceAction.play();
}, function ( xhr ) {
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
} 
, function ( error) {
  console.error( error );
});

// Blue sphere
const geometry = new THREE.SphereGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x0752ff });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 20, 0);
//scene.add(sphere);

// Cube Oimo collider
const sphereRigidBody = world.add({
  type: "sphere",
  size: [10, 10, 10],
  pos: [0, 20, 0],
  rot: [0, 0, 0],
  move: true,
  density: 1,
  friction: 0.2,
  restitution: 0.2,
  belongsTo: 1,
  collidesWith: 0xffffffff,
});

sphereRigidBody.connectMesh(sphere);

// Floor
const planeSize = [1000, 1, 1000];
const plane = new THREE.PlaneGeometry(1000, 1000, 1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xa2a7a9,
});
const floor = new THREE.Mesh(plane, planeMaterial);
floor.position.y = 0.0;
// sets floor even
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Floor collider in Oimo
const ground = world.add({
  type: "box",
  size: planeSize,
  pos: [0, -0.1, 0],
  density: 1,
  move: false,
  friction: 0.9,
  restitution: 0.1,
});

//ground.connectMesh(floor);

// Sphere 2
const geometry2 = new THREE.SphereGeometry(8, 8, 8);
const material2 = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const sphere2 = new THREE.Mesh(geometry2, material2);
sphere2.position.set(0, 40, 0);
scene.add(sphere2);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 50, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// Scene mouse-paning controls
const orbitControls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
// Main render loop
function render() {
  requestAnimationFrame(render);

  sphere2.rotation.x += 0.01;
  sphere2.rotation.y += 0.01;

  if (sphere2.rotation.x > 360 || sphere2.rotation.y > 360) {
    sphere2.rotation.x = 0;
    sphere2.rotation.y = 0;
  }

  const deltaTime = clock.getDelta();

  // Oimo physics render function
  world.step();

  if(mixer) {
    mixer.update(deltaTime);
  }
  //setupKeyLogger();

  renderer.render(scene, camera);
}

function setupKeyLogger() {
  document.onkeydown = function (e) {
    console.log(e);
  };
}


render();