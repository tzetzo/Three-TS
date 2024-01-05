import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
// necessary only during development; comment out once done
scene.add(new THREE.AxesHelper(6))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

// fastest renderer is WebGLRenderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
// adds the <canvas /> html element in the body; we can have multiple canvases with different renderers, cameras, scenes etc.
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls( camera, renderer.domElement )
// controls.addEventListener('change', render) // in this case we can comment out the animate function if it doesnt contain dynamic code updates

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00bb00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    // calling render here prevents a jump in the browsers when resizing
    render()
}

// necessary only during development; comment out once done
const stats = new Stats()
// stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

// necessary only during development; comment out once done
// setup the GUI start
const gui = new GUI()

const cubeFolder = gui.addFolder('Cube')

cubeFolder.add(cube, 'visible')

const cubeRotationFolder = cubeFolder.addFolder('Rotation') // sub-folder of Cube
cubeRotationFolder.add(cube.rotation, 'x', 0 , Math.PI * 2) // equivalent to 360 degrees
cubeRotationFolder.add(cube.rotation, 'y', 0 , Math.PI * 2)
cubeRotationFolder.add(cube.rotation, 'z', 0 , Math.PI * 2)
cubeFolder.open() // open by default
cubeRotationFolder.open()

const cubePositionFolder = cubeFolder.addFolder('Position')
cubePositionFolder.add(cube.position, 'x', -10, 10, 2) // last one is the step
cubePositionFolder.add(cube.position, 'y', -10, 10, 2)
cubePositionFolder.add(cube.position, 'z', -10, 10, 2)

const cubeScaleFolder = cubeFolder.addFolder('Scale')
cubeScaleFolder.add(cube.scale, 'x', -5, 5)
cubeScaleFolder.add(cube.scale, 'y', -5, 5)
cubeScaleFolder.add(cube.scale, 'z', -5, 5)

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', -20, 20)
cameraFolder.add(camera.position, 'y', -20, 20)
cameraFolder.add(camera.position, 'z', 0, 20)
// setup the GUI end

// animate function needed when we want to animate objects all the time
function animate() {
    requestAnimationFrame(animate) //calls itself 60 times/sec

    // instead of stats.update() below we can use
    // stats.begin()
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    // stats.end()

    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
// render()
