// https://sbcode.net/threejs/raycast-to-skinnedmesh/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

class Pickable extends THREE.Mesh {
    hovered = false

    constructor(geometry: THREE.BufferGeometry, material: THREE.Material) {
        super()
        this.geometry = geometry
        this.material = material
    }

    update(): void {
        this.visible = this.hovered
    }
}

class SkeletonCollider {
    distance = 0
    v1 = new THREE.Vector3()
    v2 = new THREE.Vector3()
    bones: THREE.Bone[] = []
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
        depthTest: false,
    })
    constructor(object: THREE.Group) {
        object.traverse((child) => {
            if ((child as THREE.Bone).isBone) {
                if (child.parent && child.parent.type === 'Bone') {
                    this.bones.push(child as THREE.Bone)
                    child.getWorldPosition(this.v1)
                    ;(child.parent as THREE.Object3D).getWorldPosition(this.v2)
                    this.distance = this.v2.distanceTo(this.v1)
                    let g
                    switch (child.name) {
                        case 'mixamorigHeadTop_End':
                            g = new THREE.SphereGeometry(0.125)
                            break
                        case 'mixamorigNeck':
                        case 'mixamorigSpine2':
                        case 'mixamorigSpine':
                            g = new THREE.BoxGeometry(0.2, this.distance, 0.2)
                            break
                        default:
                            g = new THREE.BoxGeometry(0.1, this.distance, 0.1)
                            break
                    }
                    g.translate(0, this.distance / 2, 0)
                    const m = new Pickable(g, this.material)
                    m.visible = false
                    scene.add(m)

                    child.userData.m = m
                    pickables.push(m)
                }
            }
        })
    }

    update() {
        this.bones.forEach((b) => {
            if (b.parent) {
                b.parent.getWorldPosition(b.userData.m.position)
                b.parent.getWorldQuaternion(b.userData.m.quaternion)
            }
        })
    }
}

const scene = new THREE.Scene()
THREE.Cache.enabled = true // Simpler than cloning a glb. Same model URL is used as a cache key.

new RGBELoader().load(
    './img/kloppenheim_06_puresky_1k.hdr',
    function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
    }
)

const light = new THREE.DirectionalLight(0xffffff, Math.PI)
light.position.set(2, 2, 2)
light.castShadow = true
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    100
)
camera.position.set(0, 1, 2)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true
orbitControls.target.set(0, 1, 0)

let mixerLeft: THREE.AnimationMixer
let modelLeftPickable: Pickable

let mixerRight: THREE.AnimationMixer
let skeletonCollider: SkeletonCollider

const loader = new GLTFLoader()

const raycaster = new THREE.Raycaster()
const pickables: Pickable[] = []
let intersects: THREE.Intersection[]
const mouse = new THREE.Vector2()

function onDocumentMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    pickables.forEach((p) => (p.hovered = false))
    intersects = raycaster.intersectObjects(pickables, false)
    if (intersects.length) {
        ;(intersects[0].object as Pickable).hovered = true
    }
}
document.addEventListener('mousemove', onDocumentMouseMove, false)

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const texture = new THREE.TextureLoader().load('img/grid.png')
const plane: THREE.Mesh = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshStandardMaterial({ map: texture })
)
plane.rotateX(-Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)

async function setupLeftModel() {
    await loader.loadAsync('models/xbot@dancing.glb').then((gltf) => {
        mixerLeft = new THREE.AnimationMixer(gltf.scene)
        mixerLeft.clipAction((gltf as any).animations[0]).play()

        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true
            }
        })

        gltf.scene.position.x = -0.5
        scene.add(gltf.scene)

        modelLeftPickable = new Pickable(
            new THREE.BoxGeometry(1, 1.8, 1),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true,
                depthTest: false,
            })
        )
        modelLeftPickable.geometry.translate(-0.25, 0.91, 0)
        modelLeftPickable.position.copy(gltf.scene.position)
        scene.add(modelLeftPickable)
        modelLeftPickable.userData.name = 'leftModel'
        pickables.push(modelLeftPickable)
    })
}

async function setupRightModel() {
    await loader.loadAsync('models/xbot@dancing.glb').then((gltf) => {
        mixerRight = new THREE.AnimationMixer(gltf.scene)
        mixerRight.clipAction((gltf as any).animations[0]).play()

        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true
            }
        })

        gltf.scene
        gltf.scene.position.x = 1
        scene.add(gltf.scene)

        skeletonCollider = new SkeletonCollider(gltf.scene)
    })
}

await setupLeftModel()
await setupRightModel()

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
window.addEventListener('resize', onWindowResize, false)

const stats = new Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()
let delta = 0

function animate() {
    requestAnimationFrame(animate)

    orbitControls.update()

    delta = clock.getDelta()

    mixerLeft.update(delta)

    mixerRight.update(delta)
    skeletonCollider.update()

    pickables.forEach((p) => {
        p.update()
    })

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()