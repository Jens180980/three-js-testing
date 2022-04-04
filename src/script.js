import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Debug
const controls = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.animation1')

// Scene
const scene = new THREE.Scene()


// Loaders
const textureloader = new THREE.TextureLoader()
const planetTexture = textureloader.load('/animations/planet/NormalMap.png')

const loader = new GLTFLoader();
let bananaDuck

loader.load( '/animations/banana_duck/scene.gltf', async function ( gltf ) {
	scene.add( gltf.scene );
    bananaDuck = gltf.scene.children[0]
    Animate()
}, undefined, function ( error ) {
	console.error( error );
} );


// Objects
const PlanetGeo = new THREE.SphereGeometry(15, 32, 16)

// Materials
const PlanetMaterial = new THREE.MeshStandardMaterial( { color: 0x0000ff } )
PlanetMaterial.normalMap = planetTexture

// Mesh
const PlanetMesh = new THREE.MeshBasicMaterial( PlanetGeo, PlanetMaterial )
scene.add(PlanetMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 5
pointLight.position.y = 8
pointLight.position.z = 4
scene.add(pointLight)

const ambientlight = new THREE.AmbientLight(0xffffff, 0.5)
ambientlight.position.x = 2
ambientlight.position.y = 2
ambientlight.position.z = 2
scene.add(ambientlight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 2.5
camera.position.z = 4
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const Animate = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
   
    bananaDuck.rotation.z = 0.5 * elapsedTime
    

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(Animate)
}

