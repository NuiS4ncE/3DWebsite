import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var backgroundColor = 0xCDD3D6;


// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

///background
renderer.setClearColor(backgroundColor, 1);



const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x0752FF });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function render() {
	

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
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
