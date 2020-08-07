

var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(
  75 ,
  window.innerWidth / window.innerHeight ,
  0.1 ,
  1000
)
camera.position.z = 5

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setClearColor('#e5e5e5')
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

//radius: FLOAT, widthSegments: INT, heightSegments: INT, phiStart: FLOAT, thetaStart: FLOAT, thetaLength: FLOAT
// var geometry = new THREE.SphereGeometry(1, 10, 10)
var geometry = new THREE.BoxGeometry(1, 1, 1)
var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 })
// var mesh = new THREE.Mesh(geometry, material)

// mesh.position.set(2,2,-2)
// mesh.rotation.set(45, 0, 0)
// mesh.scale.set(1,2,1)

// scene.add(mesh)

// var geometry = new THREE.BoxGeometry(1, 1, 1)
// var material = new THREE.MeshLambertMaterial({ color: 0xFFCC00 })
// var mesh = new THREE.Mesh(geometry, material)
//
// mesh.position.y = 1.5
//
// scene.add(mesh)

var meshX = -10
for (var i=0; i<15; i++) {
  var mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = (Math.random() - 0.5) * 10
  mesh.position.y = (Math.random() - 0.5) * 10
  mesh.position.z = (Math.random() - 0.5) * 10
  scene.add(mesh)
  meshX += 1
}



var light = new THREE.PointLight(0xFFFFFF, 1, 1000)
light.position.set(0, 0, 0)
scene.add(light)

var light = new THREE.PointLight(0xFFFFFF, 2, 1000)
light.position.set(0, 0, 25)
scene.add(light)



var render = function () {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}



// this.tl = new TimelineMax().delay(.3)

function handleMouseMove (event) {
  event.preventDefault()
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
  raycaster.setFromCamera(mouse, camera)

  var intersects = raycaster.intersectObjects(scene.children, true)
  for (var i=0; i<intersects.length; i++) {
    // intersects[i].object.material.color.set(0xff00000)
    this.tl = new TimelineMax()
    this.tl.to(intersects[i].object.scale, 1, { x: 2, ease: Expo.easeOut })
    this.tl.to(intersects[i].object.scale, .5, { x: .5, ease: Expo.easeOut })
    this.tl.to(intersects[i].object.position, .5, { x: 2, ease: Expo.easeOut })
    this.tl.to(intersects[i].object.rotation, .5, { x: Math.PI*.5, ease: Expo.easeOut }, "=-1.5")
  }
}

window.addEventListener('mousemove', handleMouseMove)

render()









//
