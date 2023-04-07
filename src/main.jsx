import * as THREE from 'three';
import * as OIMO from 'oimo';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-3, 0, 30);
scene.add(camera);

// Oimo
const world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
    worldscale: 1,
    random: true,
    info: true // display statistique
});


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background
//var backgroundColor = 0xCDD3D6;
//renderer.setClearColor(backgroundColor, 1);

//var count = 0, sum = 0, average = 0;

// Blue cube
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x0752FF });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 20, 0);
scene.add(cube);

// Cube oimo collider
var body = world.add({
    type: 'box',
    size: [10, 10, 10],
    pos: [0, 20, 0],
    rot: [0, 0, 0],
    move: true,
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    belongsTo: 1,
    collidesWith: 0xffffffff
});




// Floor
const plane = new THREE.PlaneGeometry(1000, 1000, 1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xa2a7a9
});
const floor = new THREE.Mesh(plane, planeMaterial);
floor.position.y = 0.0;
// sets floor even
floor.rotation.x = - Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);


// Floor collider in Oimo
//const floorShape = new OIMO.BoxShape(1000, 0.1, 1000);
const ground = world.add({
    type: 'box',
    size: [1000, 1, 1000],
    pos: [0, -0.1, 0],
    density: 1,
    move: false,
    friction: 0.9,
    restitution: 0.1
})

// Create a OIMO.Body object for the floor with a static type
/*const floorBody = new OIMO.Body({
    type: 'static',
    position: [0, -0.1, 0], // Set the position slightly below the visual mesh
    rotation: [0, 0, 0],
    move: false,
    shapes: [floorShape]
});*/

// Add the physics body to the Oimo.js world
//world.addBody(floorBody);

// Torus

const geometry2 = new THREE.TorusGeometry(10, 3, 16, 100);
const material2 = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry2, material2);
torus.position.set(0, 20, 0);

scene.add(torus);

// Lights 
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 50, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function render() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    if (cube.rotation.x > 360 || cube.rotation.y > 360 || torus.rotation.x > 360 || torus.rotation.y > 360) {
        cube.rotation.x = 0;
        cube.rotation.y = 0;
        torus.rotation.x = 0;
        torus.rotation.y = 0;
    }
    cube.position.copy(body.getPosition());
    cube.quaternion.copy(body.getQuaternion());
    world.step();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function Environment() {

}

render();
/*import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
*/
