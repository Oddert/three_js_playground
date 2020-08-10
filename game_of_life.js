

var matrix = {
  x: 10,
  y: 10,
  z: 10
}

var cameraX = 700
var cameraY = 500
var cameraZ = 1300
let objects = []

let stop = false

let initialBoard = []
let board = []

const gridPixelSize = 1000

// ========== Doc Setup ==========
var scene = new THREE.Scene()
scene.background = new THREE.Color(0xf0f0f0)

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.set(cameraX, cameraY, cameraZ)
camera.lookAt(0, 0, 0)

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.decivePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)


// ========== Lights ==========
var lightAmbient = new THREE.AmbientLight(0x606060)
scene.add(lightAmbient)

var lightDirectional = new THREE.DirectionalLight(0xffffff)
lightDirectional.position.set(1, .75, .5).normalize()
lightDirectional.castShadow = true
scene.add(lightDirectional)


// ========== Objects ==========
var gridHelper = new THREE.GridHelper(gridPixelSize, matrix.x)
scene.add(gridHelper)

var planeGeometry = new THREE.PlaneBufferGeometry(gridPixelSize, gridPixelSize)
planeGeometry.rotateX(-Math.PI / 2)
var planeMesh = new THREE.MeshBasicMaterial({ visible: false })
var plane = new THREE.Mesh(planeGeometry, planeMesh)
scene.add(plane)
objects.push(plane)

var cubeSize = gridPixelSize / matrix.x
var pointerGeometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize)
pointerMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  opacity: .5,
  transparent: true
})
var pointerMesh = new THREE.Mesh(pointerGeometry, pointerMaterial)
scene.add(pointerMesh)

var cubeMap = new THREE.TextureLoader().load('square-outline-textured.png')
var cubeGeometry = new THREE.BoxBufferGeometry(cubeSize*.75, cubeSize*.75, cubeSize*.75)
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x9a59b5, map: cubeMap })
// 0xfeb74c

// ========== Cell Numerical Functions ==========
const isAlive = num => num >= 5 && num <= 9
const rnd = (min, max) => Math.floor((Math.random() * (max+1-min)) + min)
const convertCoord = number => {
  let newNumber = (number * (gridPixelSize/matrix.x)) - (gridPixelSize / 2)
  let adj = newNumber < 0 ? newNumber+1 : newNumber-1
  return Math.floor(adj / cubeSize) * cubeSize + (cubeSize/2)
}

// ========== Cell Functions ==========
// Checks how many neighbors a given cell has
function toggleOneCell (thisY=0, thisZ=0, thisX=0) {
  // let stateImage = JSON.parse(JSON.stringify([...board]))
  let newState = JSON.parse(JSON.stringify([...board]))
  let thisCell = newState[thisY] && newState[thisY][thisZ] && newState[thisY][thisZ][thisX]
  let neighbours = 0
  if (thisCell) {
    for (let y=thisY-1; y<thisY+2; y++) {
      for (let z=thisZ-1; z<thisZ+2; z++) {
        for (let x=thisX-1; x<thisX+2; x++) {
          let target = newState[y] && newState[y][z] && newState[y][z][x]
          if (target && target.active) neighbours ++
        }
      }
    }
  }
  // console.log({ neighbours })
  let newLife = isAlive(neighbours)
  return newLife
}

// Loops through board to check each cell and re-write them
function calculateNewBoard(board) {
  let newState = JSON.parse(JSON.stringify([...board]))
  for (height of newState) {
    for (width of height) {
      for (cell of width) {
        newState[cell.y][cell.z][cell.x].active = toggleOneCell(cell.y, cell.z, cell.x)
      }
    }
  }
  return newState
}

// Moves lives forward one step
// Creates ne board using above, makes list of old cells by 'name', loops over list to remove from scene and objects, calls function to add new state, render
function itirateLife() {
  if (stop) return
  board = calculateNewBoard(board)
  let removed = objects.filter(each => each.name == "voxel")
  removed.forEach(each => {
    scene.remove(each)
    objects = objects.filter(e => e.uuid !== each.uuid)
  })
  addGridPoints()
  render()
}

// Adds single cube to scene
function addCube (x, y, z) {
  var voxel = new THREE.Mesh(cubeGeometry, cubeMaterial)
  voxel.castShadow = true
  voxel.receiveShadow = true
  voxel.name = "voxel"
  voxel.position.set(x, y, z)
  voxel.position.divideScalar(cubeSize).floor().multiplyScalar(cubeSize).addScalar(cubeSize / 2)
  scene.add(voxel)
  objects.push(voxel)
}

// Loops over board object to add cells as necessary
function addGridPoints () {
  for (let y=0; y<10; y++) {
    for (let z=0; z<10; z++) {
      for (let x=0; x<10; x++) {
        let thisCell = board[y] && board[y][z] && board[y][z][x]
        if (thisCell && thisCell.active) {
          addCube(convertCoord(thisCell.x), convertCoord(thisCell.y), convertCoord(thisCell.z))
        }
      }
    }
  }
}

// Initialises grid with random values
function populateGrid () {
  for (let y=0; y<matrix.y; y++) {
    let yRow = []
    for (let z=0; z<matrix.z; z++) {
      let zRow = []
      for (let x=0; x<matrix.x; x++) {
        let addThisOne = Math.floor(Math.random()*1.1)
        zRow.push({ y, z, x, active: addThisOne === 1 })
      }
      yRow.push(zRow)
    }
    board.push(yRow)
  }
  initialBoard = JSON.parse(JSON.stringify([...board]))
  addGridPoints()
  render()
}


// Event Listeners
document.addEventListener('mousemove', handleMouseMove, false)


// Event Functions
function handleMouseMove (event) {
  event.preventDefault()
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1)
  raycaster.setFromCamera(mouse, camera)
  var allIntersects = raycaster.intersectObjects(objects)
  if (allIntersects.length > 0) {
    var intersect = allIntersects[0]
    pointerMesh.position.copy(intersect.point).add(intersect.face.normal)
    pointerMesh.position.divideScalar(cubeSize).floor().multiplyScalar(cubeSize).addScalar(cubeSize/2)
  }
  render()
}

function render () {
  renderer.render(scene, camera)
}

render()
setTimeout(populateGrid, 1000)
setTimeout(itirateLife, 5000)

let now = Date.now()
let elapsed = 0
let then = Date.now()
let fpsInterval = 1000
let startTime = Date.now()

function initAnimation(fps) {
  fpsInterval = 1000 / fps
  then = Date.now()
  startTime = then
  animate()
}

function animate() {
  if (stop) return
  requestAnimationFrame(animate)
  now = Date.now()
  elapsed = now - then
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval)
    // console.log('new life')
    itirateLife()
  }
}

let playback
function play (fps=.25) {
  console.log(`Playing animation with ${fps}fps`)
  stop = false
  initAnimation(fps)
  // playback = setInterval(itirateLife, 1000)
}
function pause () {
  stop = true
  // clearInterval(playback)
}

const playBtn = document.querySelector('.play')
playBtn.onclick = play









// JUNK

function populateRandomDemo () {
  var voxel = new THREE.Mesh(cubeGeometry, cubeMaterial)
  voxel.position.set((-gridPixelSize / 2) + 1, cubeSize / 2, (gridPixelSize / 2) - 1)
  voxel.position.divideScalar(cubeSize).floor().multiplyScalar(cubeSize).addScalar(cubeSize / 2)
  voxel.name = "voxel"
  scene.add(voxel)
  objects.push(voxel)

  var voxel1 = new THREE.Mesh(cubeGeometry, cubeMaterial)
  voxel1.position.set((gridPixelSize / 2) - 1, cubeSize / 2, (-gridPixelSize / 2) + 1)
  voxel1.position.divideScalar(cubeSize).floor().multiplyScalar(cubeSize).addScalar(cubeSize / 2)
  voxel1.name = "voxel"
  scene.add(voxel1)
  objects.push(voxel1)

  var voxel2 = new THREE.Mesh(cubeGeometry, cubeMaterial)
  voxel2.position.set((-gridPixelSize / 2) + 1, cubeSize / 2, (-gridPixelSize / 2) + 1)
  voxel2.position.divideScalar(cubeSize).floor().multiplyScalar(cubeSize).addScalar(cubeSize / 2)
  voxel2.name = "voxel"
  scene.add(voxel2)
  objects.push(voxel2)

  var voxel3 = new THREE.Mesh(cubeGeometry, cubeMaterial)
  voxel3.position.set((gridPixelSize / 2) - 1, cubeSize / 2, (gridPixelSize / 2) - 1)
  voxel3.position.divideScalar(cubeSize).floor().multiplyScalar(cubeSize).addScalar(cubeSize / 2)
  voxel3.name = "voxel"
  scene.add(voxel3)
  objects.push(voxel3)

  const rnd = (min, max) => Math.floor((Math.random() * (max+1-min)) + min)
  var randX = rnd((gridPixelSize / 2) - 1, (-gridPixelSize / 2) + 1)
  var randZ = rnd((gridPixelSize / 2) - 1, (-gridPixelSize / 2) + 1)

  var voxel4 = new THREE.Mesh(cubeGeometry, cubeMaterial)
  voxel4.position.set(randX, cubeSize / 2, randZ)
  voxel4.position.divideScalar(cubeSize).floor().multiplyScalar(cubeSize).addScalar(cubeSize / 2)
  voxel4.name = "voxel"
  scene.add(voxel4)
  objects.push(voxel4)

  render()
  // for (let i=0; i<10; i++) {
  //   for (let j=0; j<10; j++) {
  //     let addThisOne = Math.floor(Math.random()*2)
  //     if (addThiOne) {
  //
  //     }
  //   }
  // }
}
