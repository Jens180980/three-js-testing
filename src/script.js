import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap'
import { BufferGeometryLoader, Float32BufferAttribute } from 'three';


/************************************************************************
 * 
 *             CANVAS 1
 * 
 ************************************************************************/

// Scene
const scene = new THREE.Scene()

/************
 * Controls
 ***********/
// Setup orbit controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// Debug
const gui = new dat.GUI()

/***********
 * Sizes
 **********/

 const sizes = {
    width  : canvas.offsetWidth,
    height : canvas.offsetHeight
}

// Making canvas responsive
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = canvas.offsetWidth
    sizes.height = canvas.offsetHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/************
 * Cameras
 ***********/

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 50
scene.add(camera)

/***********
 * Lights
 **********/

//Point lights
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 5
pointLight.position.y = 8
pointLight.position.z = 4
scene.add(pointLight)

// Ambient lights
const ambientlight = new THREE.AmbientLight(0xffffff, 1)
ambientlight.position.x = 2
ambientlight.position.y = 2
ambientlight.position.z = 2
scene.add(ambientlight)

/************
 * Tracking mouse
 ************/

const mouse = {
    x: undefined,
    y: undefined
}

addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = (event.clientY / innerHeight) * 2 - 1
})

/************
 * Renderer
 ************/

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*************
 * Loaders
 ************/

// Textureloader
const textureloader = new THREE.TextureLoader()
const MoonTexture = textureloader.load('/Textures/moon_uv.jpeg')

// Load 3d Model in gltf format
const loader = new GLTFLoader();
let Spaceship
loader.load( '/spaceship/scene.gltf', function ( gltf ) {
	scene.add( gltf.scene );
    Spaceship = gltf.scene.children[0]
    Spaceship.scale.x = 1
    Spaceship.scale.y = 1
    Spaceship.scale.z = 1
    Spaceship.position.x = -40
    Spaceship.position.y = -15
    Spaceship.position.z = 25

    Spaceship.rotation.z = 0.5
    Spaceship.rotation.x = 5
}, undefined, function ( error ) {
	console.error( error );
} );


/*************
 * Objects
 ************/

// Moon Geometry
const MoonGeo = new THREE.SphereGeometry(20, 50, 50)
MoonGeo.attributes.position.x = 0
MoonGeo.attributes.position.y = 0
MoonGeo.attributes.position.z = 0

// Star geometry
const NUMBER_OF_STARS = 5000
const StarsArr = []
for (let i = 0; i < NUMBER_OF_STARS; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = -Math.random() * 2000
    StarsArr.push(x, y, z) 
}

const StarGeo = new THREE.BufferGeometry()
StarGeo.setAttribute('position', new Float32BufferAttribute(StarsArr, 3))

/*************
 * Materials
 ************/

// Moon material
const MoonMat = new THREE.MeshBasicMaterial( { 
    map: MoonTexture
})

// Star Material
const StarMat = new THREE.PointsMaterial( { color: 0xffffff } )

/*********************
 * Meshes & scene adds
 *********************/

// Moon Mesh
const Moon = new THREE.Mesh(MoonGeo, MoonMat)
const MoonGroup = new THREE.Group()
MoonGroup.add(Moon)
scene.add(MoonGroup)

const Stars = new THREE.Points(StarGeo, StarMat)
scene.add(Stars)

/************
 * Animation
 ***********/

const clock = new THREE.Clock()

const Animate = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    Moon.rotation.y += 0.001
    gsap.to(MoonGroup.rotation, {
        x: mouse.y * 0.5 ,
        y: mouse.x * 0.5
    })
    if(Spaceship) {
        Spaceship.position.x = mouse.x * 40
        Spaceship.position.y = -mouse.y * 15
    }
    
    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(Animate)
}
Animate()


/************************************************************************
 * 
 *             CANVAS 2
 * 
 ************************************************************************/

// Zoom on moon and scroll 100vh down
launch.addEventListener('click', () => {
    gsap.to(camera.position, { z: 10, duration: 1.5 })
    setTimeout(() => {
        canvas2.scrollIntoView({ behavior: "smooth", block: "end" })
        document.body.style.cursor = 'pointer'
    }, 800 )
})
