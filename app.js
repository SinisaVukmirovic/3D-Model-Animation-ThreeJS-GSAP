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
// initializing mixer variable to use for model animation
let mixer; 

const loader = new GLTFLoader();
// using load method to get the file information
loader.load('./assets/3Dmodel.glb',
    // callback function that will run when the loading of the model is complete
    function(gltf) {
        // if the file upload is successfull, putting the model into the scene
        model = gltf.scene;
        model.scale.set(.25,.25,.25);

        model.position.x = .3;
        model.position.y = -.3;
        model.position.z = 0;

        model.rotation.y = .75;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();
    },
    // 2nd callback function will continuously run during the loading process to help the user check the loading file process
    function(xhr) {},
    // error reporting function, will run if an error occurs during the loading process
    function(error) {}
);

// with all this data we can drow on the screen
// the task of the renderer is to create the canvas API tag in HTML
// since default BG canvas color is black, adding alpra:true to make it transparent
const renderer = new THREE.WebGLRenderer( {alpha:true} );
// setting the canvas size the same as the browser window
renderer.setSize(window.innerWidth, window.innerHeight);
// putting the canvas into the container3D DIV element we created in HTML
document.querySelector('#container3D').appendChild(renderer.domElement);

// 3. using light on our 3D model to not be black entirely
// when working with 3D models, we have 2 basic types of light - abmient light and directional light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
// first value is the color of the light, second value is the intensity
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// using data from the scene and the camera to draw 3D model on the canvas
// calling that function to repeatedly rerender with request animation frame for smoother performance
const reRendered3D = () => {
    requestAnimationFrame(reRendered3D);

    renderer.render(scene, camera);

    if (mixer) mixer.update(.03);
}

reRendered3D();

// array of values for model position when scrolling
let arrPositionModel = [
    {
        id: 'banner',
        position: { x: -1, y: -.3, z: -5 },
        rotation: { x: 0, y: 1.5, z: 0 }
    },
    {
        id: 'intro',
        position: { x: .6, y: -.2, z: 5 },
        rotation: { x: .5, y: -.5, z: 8 }
    },
    {
        id: 'description',
        position: { x: -1, y: -1, z: -5 },
        rotation: { x: 0, y: .5, z: 0 }
    },
    {
        id: 'contact',
        position: { x: 1, y: -1, z: 0 },
        rotation: { x: .3, y: -.5, z: 0 }
    }
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;

    sections.forEach(section => {
        // getting sections current possition information
        const rect = section.getBoundingClientRect();
        // if its current distance is less than 1/3 of the screen height
        // we take the height of that section as the current possition 
        if (rect.bottom <= window.innerHeight / 1.5) {
            currentSection = section.id;
        }
        if (rect.top <= window.innerHeight / 3) {
            model.position.x = .3;
        }
    });
    
    // finding the position of the active section with findIndex() method
    let position_active = arrPositionModel.findIndex(val => 
        val.id == currentSection
    );
    // if the found position if greated than or equal to 0, 
    // it means we found it in the original array
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        model.position.x = new_coordinates.position.x;
        model.position.y = new_coordinates.position.y;
        model.position.z = new_coordinates.position.z;
    }
}

// capturing when the user scrolls
window.addEventListener('scroll', () => {
    // perform this only if the 3D model has been loaded
    if (model) {
        modelMove();
    }
});