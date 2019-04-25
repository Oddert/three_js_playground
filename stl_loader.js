


var cameraX = 200
var cameraY = 200
var cameraZ = 300

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.set(cameraX, cameraY, cameraZ)
camera.lookAt(0,0,0)

var scene = new THREE.Scene()
scene.background = new THREE.Color(0x0f0f0f0)

var gridHelper = new THREE.GridHelper(1000, 20)
scene.add(gridHelper)

var planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000)
planeGeometry.rotateX(-Math.PI / 2)
var planeMesh = new THREE.MeshBasicMaterial({ visible: false })
var plane = new THREE.Mesh(planeGeometry, planeMesh)
scene.add(plane)

var ambientLight = new THREE.AmbientLight(0x606060)
scene.add(ambientLight)

var directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, .75, .5).normalize()
scene.add(directionalLight)

var circleGeometry = new THREE.SphereGeometry(50, 64, 64)
var circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
var circle = new THREE.Mesh(circleGeometry, circleMaterial)
circle.position.set(0,0,0)
// scene.add(circle)

// var loader = new THREE.STLLoader()
// console.log(loader)
// // loader.onload = () => console.log('finished!')
// loader.addEventListener('load', function (event) {
//   var stlGeometry = event.content
//   var stlMaterial = new THREE.MeshLambertMaterial({
//     ambient: 0xfbb917,
//     color: 0xfdd017
//   })
//   var mesh = new THREE.Mesh(stlGeometry, stlMaterial)
//   scene.add(mesh)
// })
//
// loader.load('JetPack_Bunny.stl')


var loader = new THREE.STLLoader();
loader.load('JetPack_Bunny.stl', function ( geometry ) {
  var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
	var mesh = new THREE.Mesh( geometry, material );

	mesh.position.set( 0, - 0.25, 0.6 );
	// mesh.rotation.set( 0, - Math.PI / 2, 0 );
	mesh.rotation.set( -Math.PI/2, 0, Math.PI / 2 - .5 );
	mesh.scale.set( 0.5, 0.5, 0.5 );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

  console.log('jet pac bunny init')
	scene.add( mesh );
  // console.log('wheres my bunny i was expecting a bunny')
  render()
});
loader.load('JetPack_Bunny.stl', function ( geometry ) {
  var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
	var mesh = new THREE.Mesh( geometry, material );

	mesh.position.set( 0, - 0.25, 0.6 );
	// mesh.rotation.set( 0, - Math.PI / 2, 0 );
	mesh.rotation.set( -Math.PI/2, 0, Math.PI / 2 - .5 );
	mesh.scale.set( 0.5, 0.5, 0.5 );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

  console.log('jet pac bunny init')
	scene.add( mesh );
  // console.log('wheres my bunny i was expecting a bunny')
  render()
});

var controls = new THREE.OrbitControls(camera)
controls.minDistance = 100
controls.maxDistance = 500


var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.append(renderer.domElement)

function render () {
  camera.lookAt(0,0,0)
  renderer.render(scene, camera)
}

render()

function animate () {
  requestAnimationFrame(animate)
  controls.update()
  render()
}
animate()
