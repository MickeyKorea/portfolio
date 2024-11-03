THREE.ColorManagement.enabled = true;
const fontLoader = new FontLoader();
const turn_gui = false;

const canvas = document.querySelector("canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x171616);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const FOV_SETTINGS = {
    mobile: 90,
    desktop: 70,
    transitionDuration: 0.2, // seconds
};

let targetFov = 70; // Initial FOV
let isTransitioning = false;
let transitionStartTime = 0;
let startFov = 70;

const camera = new THREE.PerspectiveCamera(
    70,
    sizes.width / sizes.height,
    0.1,
    1000,
);

camera.position.set(0, 4, -5.5);
scene.add(camera);

// RectLight
const darkmode = 0xf7fbff;
const lightmode = 0xfeffb5;

const intensity = 2;
const width = 6;
const height = 2;
const rectAreaLight = new THREE.RectAreaLight(
    darkmode,
    0, // intensity starts from 0
    width,
    height,
);

// Default position
rectAreaLight.position.y = 2;
rectAreaLight.position.z = 2;
rectAreaLight.rotation.x = -0.8;

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLight, rectAreaLightHelper);

// const ambientLight = new THREE.AmbientLight(0x404040, 0);
// scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
// Block user control
// controls.enabled = false;

controls.enableDamping = true; // for smoother controls
controls.dampingFactor = 0.02;
controls.enablePan = false; // disable panning

const material = new THREE.MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0,
});

// Floor
const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
plane.color = new THREE.Color(0x171616);

scene.add(plane);

// Random objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -2;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material,
);
torus.position.x = 2;

// const shapes = [sphere, cube, torus];

// shapes.forEach((shape) => {
//     scene.add(shape);
// });

// My Name
fontLoader.load(
    './fonts/helvetiker-bold.json',
    (font) => {
        const nameGeometry = new TextGeometry('Mickey Oh', {
            font: font,
            size: 0.6,
            depth: 0.001,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.001,
            bevelSize: 0.001,
            bevelOffset: 0,
            bevelSegments: 1,
            letterSpacing: -1
        });

        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.5,
            metalness: 0,
        });

        const nameMesh = new THREE.Mesh(nameGeometry, textMaterial);

        // Center the text
        nameGeometry.computeBoundingBox();
        const nameWidth = nameGeometry.boundingBox.max.x - nameGeometry.boundingBox.min.x;
        const nameHeight = nameGeometry.boundingBox.max.y - nameGeometry.boundingBox.min.y;

        nameMesh.rotation.y = Math.PI;
        nameMesh.rotation.x = Math.PI / 2.5;

        nameMesh.position.x = -nameWidth / 2 + nameWidth;
        nameMesh.position.y = -nameHeight / 2;
        // nameMesh.position.y = -0.65;

        scene.add(nameMesh);

        // Subtitle
        fontLoader.load(
            './fonts/helvetiker-regular.json',
            (subtitleFont) => {
                const subtitleGeometry = new TextGeometry('Creative Technologist', {
                    font: subtitleFont,
                    size: 0.25,
                    depth: 0.001,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.001,
                    bevelSize: 0.001,
                    bevelOffset: 0,
                    bevelSegments: 1,
                    letterSpacing: -0.02
                });

                const subtitleMesh = new THREE.Mesh(subtitleGeometry, textMaterial);

                // Center the subtitle
                subtitleGeometry.computeBoundingBox();
                const subtitleWidth = subtitleGeometry.boundingBox.max.x - subtitleGeometry.boundingBox.min.x;

                subtitleMesh.rotation.y = Math.PI;
                subtitleMesh.rotation.x = Math.PI / 2.5;

                subtitleMesh.position.x = -subtitleWidth / 2 + subtitleWidth;
                subtitleMesh.position.y = -nameHeight / 2;
                subtitleMesh.position.z = 1.3;

                scene.add(subtitleMesh);
            }
        );
    }
);

// text on the RectAreaLight
// fontLoader.load(
//     './fonts/trends.json',
//     (font) => {
//         const textGeometry = new TextGeometry('mickey oh', {
//             font: font,
//             size: 0.5,
//             depth: 0.1,
//             curveSegments: 12,
//             bevelEnabled: false
//         });

//         const textMaterial = new THREE.MeshStandardMaterial({
//             color: 0xffffff,
//             // metalness: 0.1,
//             // roughness: 1,
//         });

//         const textMesh = new THREE.Mesh(textGeometry, textMaterial);

//         // Center the text
//         textGeometry.computeBoundingBox();
//         const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
//         textMesh.position.copy(rectAreaLight.position);
//         textMesh.position.x += textWidth / 2;
//         textMesh.rotation.copy(rectAreaLight.rotation);

//         textMesh.rotation.y = Math.PI;
//         scene.add(textMesh);
//     }
// );

const clock = new THREE.Clock();

// Light animation
let isLightAnimationComplete = false;
const lightAnimationDuration = 2;

const update = () => {
    const elapsedTime = clock.getElapsedTime();

    //Camera position animation
    if (elapsedTime <= 1.3) {
        const progress = Math.min(elapsedTime / 1.3, 1);
        camera.position.z = -7 + (1.5 * progress);
    }

    // Animate light intensity
    if (!isLightAnimationComplete) {
        const progress = Math.min(elapsedTime / lightAnimationDuration, 1);
        rectAreaLight.intensity = intensity * progress;
        //console.log(rectAreaLight.intensity);

        if (progress === 1) {
            isLightAnimationComplete = true;
        }
    }

    // Handle FOV transition
    if (isTransitioning) {
        const progress = Math.min((elapsedTime - transitionStartTime) / FOV_SETTINGS.transitionDuration, 1);
        camera.fov = startFov + (targetFov - startFov) * progress;
        camera.updateProjectionMatrix();

        if (progress === 1) {
            isTransitioning = false;
        }
    }

    // Update controls
    controls.update();

    // for (const shape of shapes) {
    //     shape.rotation.x = elapsedTime * 0.1;
    //     shape.rotation.y = elapsedTime * 0.1;
    //     shape.rotation.z = elapsedTime * 0.1;
    // }

    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(update);
};

update();

function responsiveCamera() {
    const isMobile = window.innerWidth <= 768;

    // // Adjust camera for mobile screens
    // if (isMobile) {
    //     camera.fov = 100;
    // } else {
    //     camera.fov = 70;
    // }

    // Set target FOV based on device
    const newTargetFov = isMobile ? FOV_SETTINGS.mobile : FOV_SETTINGS.desktop;

    // Only start transition if target FOV is different
    if (targetFov !== newTargetFov) {
        targetFov = newTargetFov;
        startFov = camera.fov;
        isTransitioning = true;
        transitionStartTime = clock.getElapsedTime();
    }

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    responsiveCamera();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

responsiveCamera()

if (turn_gui) {
    const gui = new GUI();
    // gui.close()

    // Camera GUI
    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.add(camera.position, 'x').min(-10).max(10).step(0.1);
    cameraFolder.add(camera.position, 'y').min(-10).max(10).step(0.1);
    cameraFolder.add(camera.position, 'z').min(-10).max(10).step(0.1);

    // Material GUI
    const materialFolder = gui.addFolder("Material");
    materialFolder.add(material, "roughness", 0, 1, 0.001);
    materialFolder.add(material, "metalness", 0, 1, 0.001);

    // Light GUI
    const rectAreaLightFolder = gui.addFolder("Light");
    rectAreaLightFolder.add(rectAreaLight, "visible");
    rectAreaLightFolder.add(rectAreaLight, "intensity", 0, 5, 0.001);
    rectAreaLightFolder.addColor(rectAreaLight, "color").onChange((value) => {
        rectAreaLight.color.set(value);
    });
    rectAreaLightFolder.add(rectAreaLight, "width", 0, 20, 0.001);
    rectAreaLightFolder.add(rectAreaLight, "height", 0, 20, 0.001);
    rectAreaLightFolder.add(rectAreaLight.position, "x", -10, 10, 0.001);
    rectAreaLightFolder.add(rectAreaLight.position, "y", -10, 10, 0.001);
    rectAreaLightFolder.add(rectAreaLight.position, "z", -10, 10, 0.001);
    rectAreaLightFolder.add(rectAreaLight.rotation, "x", -Math.PI, Math.PI, 0.01).name('rotation x');

    // const ambientFolder = gui.addFolder("Ambient Light");
    // ambientFolder.add(ambientLight, "visible");
    // ambientFolder.add(ambientLight, "intensity", 0, 1, 0.001);
    // ambientFolder.addColor(ambientLight, "color").onChange((value) => {
    //     ambientLight.color.set(value);
    // });
}