import * as THREE from  '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';


var scene = new THREE.Scene();    // Create main scene
var stats = new Stats(); // To show FPS information
var renderer = initRenderer();    // View function in util/utils

var keyboard = new KeyboardState();

scene.add(new THREE.HemisphereLight()); 

// Main camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0.0, 2.0, 0.0);
  camera.up.set( 0, 1, 0 );

var cameraObj = new THREE.Object3D();
  cameraObj.position.set(0.0, 2.0, 0.0);
  cameraObj.lookAt(0, 0, 0);
  cameraObj.up.set(0, 1, 0);
  scene.add(cameraObj);
  cameraObj.add(camera);

// Enable mouse rotation, pan, zoom etc.
// var trackballControls = new TrackballControls(camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlaneWired(500, 500, 1000, 500); // width, height, resolutionW, resolutionH
  groundPlane.rotateX(degreesToRadians(-180));
scene.add(groundPlane);


render();


function controlledRender()
{
  renderer.setClearColor("rgb(60, 50, 150)");  // Use a darker clear color in the small viewport 
  renderer.clear(); // Clean the small viewport
  renderer.render(scene, camera);  // Render scene of the virtual camera
}

function keyboardUpdate() {  
  keyboard.update();
    var angle = degreesToRadians(1);
    var rotX = new THREE.Vector3(1, 0, 0); // Set X axis
    var rotY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var rotZ = new THREE.Vector3(0, 0, 1); // Set Z axis

    if (keyboard.pressed("left")) cameraObj.rotateOnAxis(rotY, angle);
    if (keyboard.pressed("right")) cameraObj.rotateOnAxis(rotY, -angle);
    if (keyboard.pressed("up")) cameraObj.rotateOnAxis(rotX, -angle);
    if (keyboard.pressed("down")) cameraObj.rotateOnAxis(rotX, angle);
    if (keyboard.pressed("<")) cameraObj.rotateOnAxis(rotZ, angle);
    if (keyboard.pressed(">")) cameraObj.rotateOnAxis(rotZ, -angle);
    if (keyboard.pressed(",")) cameraObj.rotateOnAxis(rotZ, angle);
    if (keyboard.pressed(".")) cameraObj.rotateOnAxis(rotZ, -angle);
    if (keyboard.pressed("space")) cameraObj.translateZ(-0.2) //translateZ(0.2);
}

function render()
{
  stats.update(); // Update FPS
  // trackballControls.update();
  requestAnimationFrame(render);
  keyboardUpdate();
  controlledRender();
}