

var objects = []
var cameraX = 600
var cameraY = 500
var cameraZ = 1300

var angle = Math.atan(cameraX / cameraZ) * (180 / Math.PI)
var hyp = Math.sqrt(Math.pow(cameraX, 2) + Math.pow(cameraZ, 2))
console.log({ angle, hyp })
// function init () {

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
//                  x,   y (h),   z
camera.position.set(cameraX, cameraY, cameraZ)
camera.lookAt(0,0,0)

var scene = new THREE.Scene()
scene.background = new THREE.Color(0xf0f0f0)

var rollOverGeometry = new THREE.BoxBufferGeometry(50, 50, 50)
rollOverMaterial = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	opacity: .5,
	transparent: true
})
var rollOverMesh = new THREE.Mesh(rollOverGeometry, rollOverMaterial)
scene.add(rollOverMesh)

var cubeMap = new THREE.TextureLoader().load('square-outline-textured.png')
var cubeGeometry = new THREE.BoxBufferGeometry(50, 50, 50)
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xfeb74c, map: cubeMap })

var gridHelper = new THREE.GridHelper(1000, 20)
scene.add(gridHelper)

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

var planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000)
planeGeometry.rotateX(-Math.PI / 2)
var planeMesh = new THREE.MeshBasicMaterial({ visible: false })
var plane = new THREE.Mesh(planeGeometry, planeMesh)
scene.add(plane)
objects.push(plane)

var lightAmbient = new THREE.AmbientLight(0x606060)
scene.add(lightAmbient)

var lightDirectional = new THREE.DirectionalLight(0xffffff)
lightDirectional.position.set(1, .75, .5).normalize()
scene.add(lightDirectional)

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

document.addEventListener('mousemove', handleMouseMove, false)
document.addEventListener('keydown', handleKeyDown, false)
document.addEventListener('mousedown', handleClick, false)

window.addEventListener('resize', handleResize, false)
// } //function init()




function handleMouseMove (event) {
	event.preventDefault()
	mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
	raycaster.setFromCamera(mouse, camera)
	var intersects = raycaster.intersectObjects(objects)
	if (intersects.length > 0) {
		var intersectObject = intersects[0]
		rollOverMesh.position.copy(intersectObject.point).add(intersectObject.face.normal)
		rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
	}
	render()
}

function handleClick (event) {
	event.preventDefault()
	mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1)
	raycaster.setFromCamera(mouse, camera)
	var intersects = raycaster.intersectObjects(objects)
	if (intersects.length > 0) {
		var intersectObject = intersects[0]

		var voxel = new THREE.Mesh(cubeGeometry, cubeMaterial)
		// console.log(intersectObject.point)
		voxel.position.copy(intersectObject.point)
		// console.log('Copied pos: ', voxel.position)
		voxel.position.add(intersectObject.face.normal)
		// console.log('Add Face Normal: ', voxel.position)
		voxel.position.divideScalar(50)
		// console.log('Divide Scalar 50: ', voxel.position)
		voxel.position.floor()
		// console.log('Floor: ', voxel.position)
		voxel.position.multiplyScalar(50)
		// console.log('Multiply Scalar 50: ', voxel.position)
		voxel.position.addScalar(25)
		// console.log('Add Scalar 25: ', voxel.position)
		scene.add(voxel)
		objects.push(voxel)

	}
	render()
}

function handleMouseDown (event) {
	event.preventDefault()
	mouse.set((event.clientX / window.innerWidth) * 2 -1, -(event.clientY / window.innerHeight) * 2 + 1)
	raycaster.setFromCamera(mouse, camera)
}

function handleResize () {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}

function incramentRotate () {
	let newAngle = angle + 1
	newAngle = newAngle > 359 ? 0 : newAngle
	newAngle = newAngle < 1 ? 360 : newAngle
	// console.log({ angle, newAngle })
	angle = newAngle
	cameraX = Math.sin(angle * Math.PI / 180) * hyp
	cameraZ = Math.cos(angle * Math.PI / 180) * hyp
	camera.position.x = cameraX
	camera.position.z = cameraZ
	// console.log({ cameraX, cameraZ })
	camera.updateProjectionMatrix()
	render()
}

function decramentRotate () {
	console.log('dec')
	let newAngle = angle - 1
	newAngle = newAngle > 359 ? 0 : newAngle
	newAngle = newAngle < 1 ? 360 : newAngle
	// console.log({ angle, newAngle })
	angle = newAngle
	cameraX = Math.cos(angle * Math.PI / 180) * hyp
	cameraZ = Math.sin(angle * Math.PI / 180) * hyp
	camera.position.x = cameraX
	camera.position.z = cameraZ
	// console.log({ cameraX, cameraZ })
	camera.updateProjectionMatrix()
	render()
}

function handleKeyDown (event) {
	// console.log(event.keyCode)
	switch(event.keyCode) {
		case 65:
		case 37:
			incramentRotate()
			break;
		case 68:
		case 39:
			decramentRotate()
			break;
		case 38:
		case 87:
			camera.position.y += 10
			render()
			break;
		case 40:
		case 83:
			camera.position.y -= 10
			render()
			break;
	}
}

function render () {
	camera.lookAt(0,0,0)
	renderer.render(scene, camera)
}

// init()
render()
