// Global variables for scene, camera, renderer, etc.
var scene;
var cube;
var camera;
var renderer;
var clock;
var holder;
var intersects;
var particles = [];
var level = 1;
var totalLevels = 4;
var score = 0;
var totalTargets = 3;
var speed = 0.01;
var complete = false;
var comments = ["Easy", "Tricky", "Careful now", "INSANITY"];
var myLevel = document.getElementById("level");
var myScore = document.getElementById("score");

// Raycaster and mouse vector for mouse interaction
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Function to set up the initial scene
function myScene () {
    scene = new THREE.Scene();
    // Ambient light to illuminate the scene
    var light = new THREE.AmbientLight(0xffffff);
    var width = window.innerWidth;
    var height = window.innerHeight;
    // Camera setup with perspective projection
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 18;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    // Attach renderer to HTML element
    document.getElementById("webgl-container").appendChild(renderer.domElement);
    // Clock for timing purposes
    clock = new THREE.Clock();
    
    // Spotlight for additional lighting
    var sLight = new THREE.SpotLight(0xffffff);
    sLight.position.set(-100, 100, 100);
    scene.add(sLight);

    // Ambient light to globally illuminate the scene
    var aLight = new THREE.AmbientLight(0xffffff);
    scene.add(aLight);
}

// Function to create a spinning cube
function spinner() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({ color: "hotpink", ambient: "hotpink" });

    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = 10;
    var spinner = new THREE.Object3D();
    spinner.rotation.x = 6;

    spinner.add(cube);
    scene.add(spinner);
}

// Function to add a holder object containing multiple targets
function addHolder() {
    holder = new THREE.Object3D();
    holder.name = "holder";

    for (var i = 0; i < totalTargets; i++) {
        // Random color generation for each target
        var ranCol = new THREE.Color();
        ranCol.setRGB(Math.random(), Math.random(), Math.random());

        var geometry = new THREE.BoxGeometry(2, 2, 2);
        var material = new THREE.MeshPhongMaterial({ color: ranCol, ambient: ranCol });

        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = i * 5;
        cube.name = "cubeName" + i;

        var spinner = new THREE.Object3D();
        spinner.rotation.x = i * 2.5 * Math.PI;
        spinner.name = "spinnerName" + i;

        spinner.add(cube);
        holder.add(spinner);
    }
    scene.add(holder);
}

// Function to add an explosion effect at a given point
function addExplosion(point) {
    var timeNow = clock.getElapsedTime();

    for (var i = 0; i < 4; i++) {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x999999 });
        var part = new THREE.Mesh(geometry, material);
        part.position.x = point.x;
        part.position.y = point.y;
        part.position.z = point.z;
        part.name = "part" + i;
        part.birthDay = timeNow;
        scene.add(part);
        particles.push(part);
    }
}

// Function to continuously render the scene
function animate() {
    requestAnimationFrame(animate);
    render();
}

// Function to update the scene
function render() {        
    holder.children.forEach(function (elem, index) {
        elem.rotation.y += (speed * (6 - index));
        elem.children[0].rotation.x += 0.01;
        elem.children[0].rotation.y += 0.01;
    });

    if (particles.length > 0) {
        particles.forEach(function (elem, index) {
            switch (elem.name) {
                case "part0":
                    elem.position.x += 1;
                    break;
                case "part1":
                    elem.position.x -= 1;
                    break;
                case "part2":
                    elem.position.y += 1;
                    break;
                case "part3":
                    elem.position.y -= 1;
                    break;
                default:
                    break;
            }

            if (elem.birthDay - clock.getElapsedTime() < -1 ) {
                scene.remove(elem);
                particles.splice(index, 1);
            }
        });
    }

    renderer.render(scene, camera);
}

// Function to handle mouse clicks on the document
function onDocumentMouseDown(event) {
    event.preventDefault();

    if (complete) {
        complete = false;
        score = 0;
        restartScene();
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (score < totalTargets) {
        holder.children.forEach(function (elem) {
            intersects = raycaster.intersectObjects(elem.children);
            if (intersects.length > 0 && intersects[0].object.visible) {
                intersects[0].object.visible = false;
                addExplosion(intersects[0].point);
                score += 1;

                if (score < totalTargets) {
                    myScore.innerHTML = "<span class='hit'>HIT!</span> Score: " + score + "/" + totalTargets;
                } else {
                    complete = true;
                    if (level < totalLevels) {
                        myScore.innerHTML = "<strong>You got 'em all!</strong> Click the screen for level "  + (level + 1) + ".";
                    } else {
                        myScore.innerHTML = "<strong>You win!</strong> Click the screen to play again.";
                    }
                }
            }
        });
    }
}

// Function to restart the scene
function restartScene() {
    myScore.innerHTML = "";

    if (level < totalLevels) {
        speed += 0.005;
        totalTargets += 1;
        level += 1;
    } else {
        speed = 0.01;
        totalTargets = 3;
        level = 1;
    }

    myLevel.innerText = comments[level - 1] +  ": Level " + level + " of " + totalLevels;
    scene.remove(holder);
    addHolder();
}

// Event listener for mouse clicks
document.getElementById("webgl-container").addEventListener('mousedown', onDocumentMouseDown, false);

// Function to handle window resize
function onWindowResize() {
    // Update the camera aspect ratio to match the new window dimensions
    camera.aspect = window.innerWidth / window.innerHeight;
    // Update the camera's projection matrix
    camera.updateProjectionMatrix();
    // Update the renderer's size to match the new window dimensions
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Re-render the scene with the updated dimensions
    render();
}

// Function to execute when the window loads
window.onload = function() {
    // Update the displayed level information
    myLevel.innerText = comments[level - 1] +  ": Level " + level;
    // Set up the initial scene
    myScene();
    // Add the holder containing targets to the scene
    addHolder();
    // Start the animation loop
    animate();

    // Add an event listener to handle window resizing
    window.addEventListener('resize', onWindowResize, false);
};

