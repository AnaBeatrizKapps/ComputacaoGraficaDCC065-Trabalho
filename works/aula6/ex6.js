import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initCamera,
    InfoBox,
    onWindowResize,
    degreesToRadians,
    initDefaultBasicLight
} from "../libs/util/util.js";

var stats = new Stats(); // To show FPS information
var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -50, 35)); // Init camera in this position
var light  = initDefaultBasicLight(scene, new THREE.Vector3(7, 7, 7));
var metal_dourado = new THREE.MeshPhongMaterial({color: 0xb8860b, side: THREE.DoubleSide});
var metal_azul = new THREE.MeshToonMaterial({color: 0x0031e7, side: THREE.DoubleSide});

initDefaultBasicLight(scene, 1, new THREE.Vector3(10, -10, 25));

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(15);
axesHelper.visible = false;
scene.add(axesHelper);

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(0, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// NEW

// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 1, 0.5);
var cubeMaterial = new THREE.MeshPhongMaterial({ color: "gree" });

var cube = [];
cube[0] = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube[1] = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube[0].rotation.z = degreesToRadians(45);
cube[1].rotation.z = degreesToRadians(-45);

//cilindro base
var geometry = new THREE.CylinderGeometry(0.3, 0.5, 15, 32);
var material = new THREE.MeshPhongMaterial({ color: "#FFFC8D" });
var cylinder = new THREE.Mesh(geometry, material);

//motor
var motorGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.5);
var motorMaterial = new THREE.MeshPhongMaterial({ color: "#17C7E2" });
var motor = new THREE.Mesh(motorGeometry, motorMaterial);

//ponta motor
var geometryPontaMotor = new THREE.CylinderGeometry(0.3, 0.6, 1, 32);
var pontaMaterial = metal_azul;
var pontaMotor = new THREE.Mesh(geometryPontaMotor, pontaMaterial);

//helices
var helicesGeometry = new THREE.ConeGeometry(0.6, 7);
var helicesMaterial = metal_dourado;
var helices = []
for (var i = 0; i < 3; i++) {
    helices[i] = new THREE.Mesh(helicesGeometry, helicesMaterial);
    pontaMotor.add(helices[i]);
}

// position the cube
cube[0].position.set(0.0, 0.0, -1.25);
cube[1].position.set(0.0, 0.0, -1.25);
cylinder.position.set(0.0, 0.0, 5.25);
cylinder.rotation.x = degreesToRadians(90);

motor.position.set(0.0, 8.0, 0.0);
motor.rotation.y = degreesToRadians(-45);

pontaMotor.rotation.x = degreesToRadians(90);
pontaMotor.position.set(0.0, 0.0, 1.0);

helices[0].rotation.z = degreesToRadians(-90);
helices[0].position.x = helicesGeometry.parameters.height/2;
helices[0].position.y = -0.4;

helices[1].rotation.z = Math.PI/2;
helices[1].rotation.y = degreesToRadians(60);
helices[1].position.x = -helicesGeometry.parameters.height/4;
helices[1].position.z = helicesGeometry.parameters.height/2.5;
helices[1].position.y = -0.4;

helices[2].rotation.z = Math.PI/2;
helices[2].rotation.y = degreesToRadians(-60);
helices[2].position.x = -helicesGeometry.parameters.height/4;
helices[2].position.z = -helicesGeometry.parameters.height/2.5;
helices[2].position.y = -0.4;


// add the cube to the scene
scene.add(cube[0]);
scene.add(cube[1]);
cube[0].add(cylinder);
cylinder.add(motor);
motor.add(pontaMotor);

// Set angles of rotation
var angle = 0;
var speed = 1;
var animationOn = false; // control if animation is on or of

function rotateBlades() {
    // Set angle's animation speed
    if (animationOn) {
        //angle += speed;
        pontaMotor.rotation.y += degreesToRadians(speed);
    }
}
// END NEW


function buildInterface() {
    var controls = new function() {
        this.onChangeAnimation = function() {
            animationOn = !animationOn;
        };
        this.speed = 1;
        this.viewAxes = false;

        this.changeSpeed = function() {
            speed = this.speed;
        };
        this.onViewAxes = function() {
            axesHelper.visible = this.viewAxes;
        };
    };

    // GUI interface
    var gui = new GUI();
    gui.add(controls, 'onChangeAnimation', true).name("Start/Stop");
    gui.add(controls, 'speed', 1, 30)
        .onChange(function(e) { controls.changeSpeed() })
        .name("Velocidade");
}


// Listen window size changes
window.addEventListener('resize', function() { onWindowResize(camera, renderer) }, false);
buildInterface();
render();

function render() {
    stats.update(); // Update FPS
    trackballControls.update(); // Enable mouse movements
    requestAnimationFrame(render);
    rotateBlades();
    renderer.setClearColor("rgb(150,200,220)");
    renderer.render(scene, camera) // Render scene
}