import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//initialize the scene
const scene = new THREE.Scene();

// add objects to the scene
const cubeGeometry = new THREE.BoxGeometry(1,1,1)
const cubeMaterial = new THREE.MeshBasicMaterial({color:"red", wireframe:true})

const cubeMesh = new THREE.Mesh(cubeGeometry,cubeMaterial);
scene.add(cubeMesh);

// cubeMesh.rotation.x = THREE.MathUtils.degToRad(50)

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// initialize the camera
const camera = new THREE.PerspectiveCamera(75, 
  window.innerWidth / window.innerHeight, 0.1, 200)

// const aspectRatio = window.innerWidth / window.innerHeight
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio,1 * aspectRatio,1,-1,0.1,200)
  // position
  camera.position.z = 5

  scene.add(camera)

  // initailize the renderer
  const canvas = document.querySelector('canvas.threejs')
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  })
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

// initailize the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = false;

const renderloop = () => {
  controls.update()
  renderer.render(scene,camera)
  window.requestAnimationFrame(renderloop)
}

renderloop();