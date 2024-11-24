import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// to be able to read the GLB  file format we are importing GLTF Loader library
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
// import { gsap } from 'https://cdn.skypack.dev/gsap';

// 1. camera
const camera = new THREE.PerspectiveCamera(
    // first value is viewing angle (increasing or decreasing will make us see more or less things)
    10,
    // second value is aspect (ratio of the frame wo contain 3D model)
    window.innerWidth / window.innerHeight,
    // third value is "near" (used to determine the closest distance the camera can see)
    .1,
    // forth value is "far" (determins the farthest distance the camera can see)
    1000
);

// camera position
// moving the camera position away from the axis to be able to see the whole scene
camera.position.z = 13;

// scene (will contain all the things related to the 3D frame, such as the model, the light...)
const scene = new THREE.Scene();

// importing 3D model to be able to use it in this project
let model;

const loader = new GLTFLoader();
// using load method to get the file information
loader.load('./assets/3d-model/3Dmodel.glb',
    // callback function that will run when the loading of the model is complete
    function(gltf) {
        // if the file upload is successfull, putting the model into the scene
        model.gltf.scene();
        scene.add(model);
    },
    // 2nd callback function will continuously run during the loading process to help the user check the loading file process
    function(xhr) {},
    // error reporting function, will run if an error occurs during the loading process
    function(error) {}
);