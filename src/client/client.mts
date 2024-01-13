import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

// camera.lookAt(0.5, 0.5, 0.5) // dont use this when using OrbitControls! the controls also control the camera!
// controls.target.set(.5, .5, .5)
// controls.update() // not needed if called inside animate()

// controls.addEventListener('change', () => console.log("Controls Change"))
// controls.addEventListener('start', () => console.log("Controls Start Event"))
// controls.addEventListener('end', () => console.log("Controls End Event"))
// controls.autoRotate = true  // only works if controls.update() is called inside animate()
// controls.autoRotateSpeed = 10 // only works with controls.autoRotate above
// controls.enableDamping = true // only works if controls.update() is called inside animate(); rotation continues for a bit after release of the mouse button!
// controls.dampingFactor = .01 // only works with controls.enableDamping above
// controls.listenToKeyEvents(window)
// controls.keys = { // only works with controls.listenToKeyEvents(window)
//     LEFT: "ArrowLeft", // OR KeyD, or any other we choose - use https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code to see the code for the desired key
//     UP: "ArrowUp", // OR KeyS
//     RIGHT: "ArrowRight", // OR KeyA
//     BOTTOM: "ArrowDown" // OR KeyW
// }
// controls.mouseButtons = { // usually defaults are used
//     LEFT: THREE.MOUSE.ROTATE,
//     MIDDLE: THREE.MOUSE.DOLLY,
//     RIGHT: THREE.MOUSE.PAN
// }
// controls.touches = { // usually defaults are used; used on mobile phones/tablets
//     ONE: THREE.TOUCH.ROTATE, // one finger
//     TWO: THREE.TOUCH.DOLLY_PAN // two fingers
// }
// controls.screenSpacePanning = true
// controls.minAzimuthAngle = 0 // https://en.wikipedia.org/wiki/Azimuth
// controls.maxAzimuthAngle = Math.PI / 2 // Math.PI === 180 degrees
// controls.minPolarAngle = 0 // orbit vertically, lower limit
// controls.maxPolarAngle = Math.PI // orbit vertically, upper limit
// controls.maxDistance = 4 // zoom out
// controls.minDistance = 2 // zoom in

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()