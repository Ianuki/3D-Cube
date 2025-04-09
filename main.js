class vector3 {
  constructor(i, j, k) { this.i = i; this.j = j; this.k = k; }
}

class vector2 {
  constructor(i, j) { this.i = i; this.j = j; }
}

class line {
  constructor(a, b) { this.a = a; this.b = b; }
}

function project(point, camera_position, camera_rotation) {
  return new vector2(
    point.i * FOCAL_LENGTH / (point.k - camera_position.k),
    point.j * FOCAL_LENGTH / (point.k - camera_position.k)  
  )
}

function rotate_x(point, rotation) {
  return new vector3(
    point.i,
    point.j * Math.cos(rotation) - point.k * Math.sin(rotation),
    point.j * Math.sin(rotation) + point.k * Math.cos(rotation),
  )
}

function rotate_y(point, rotation) {
  return new vector3(
    point.i * Math.cos(rotation) + point.k * Math.sin(rotation),
    point.j,
    point.i * -Math.sin(rotation) + point.k * Math.cos(rotation),
  )
}

function rotate_z(point, rotation) {
  return new vector3(
    point.i * Math.cos(rotation) - point.j * Math.sin(rotation),
    point.i * Math.sin(rotation) + point.j * Math.cos(rotation),
    point.k,
  )
}

const CANVAS = document.getElementById("screen");
const FOCAL_LENGTH = 300;

const VERTICES = [
  new vector3(1, 1, 1),
  new vector3(-1, 1, 1),
  new vector3(1, -1, 1),
  new vector3(-1, -1, 1),
  new vector3(1, 1, -1),
  new vector3(-1, 1, -1),
  new vector3(1, -1, -1),
  new vector3(-1, -1, -1),
];

const LINES = [
  new line(0, 1),
  new line(0, 2),
  new line(1, 3),
  new line(3, 2),
  new line(4, 5),
  new line(4, 6),
  new line(5, 7),
  new line(7, 6),
  new line(0, 4),
  new line(1, 5),
  new line(2, 6),
  new line(3, 7),
]

let camera_position = new vector3(0, 0, -5);
let camera_rotation = new vector3(0, 0, 0);

let context = CANVAS.getContext("2d");

const x_rotation_slider = document.getElementById("rotation_x");
const y_rotation_slider = document.getElementById("rotation_y");
const z_rotation_slider = document.getElementById("rotation_z");

const render = async () => { 
  context.clearRect(0, 0, CANVAS.width, CANVAS.height);
  let x_rotation = x_rotation_slider.value * (Math.PI / 180);
  let y_rotation = y_rotation_slider.value * (Math.PI / 180);
  let z_rotation = z_rotation_slider.value * (Math.PI / 180);
  
  for (let i = 0; i < LINES.length; i++) {
    let point_a = VERTICES[LINES[i].a]; point_a = rotate_x(point_a, x_rotation); point_a = rotate_y(point_a, y_rotation); point_a = rotate_z(point_a, z_rotation);
    let point_b = VERTICES[LINES[i].b]; point_b = rotate_x(point_b, x_rotation); point_b = rotate_y(point_b, y_rotation); point_b = rotate_z(point_b, z_rotation);
    let projected_point_a = project(point_a, camera_position, camera_rotation);
    let projected_point_b = project(point_b, camera_position, camera_rotation);
 
    context.beginPath()
    context.moveTo(projected_point_a.i + 200, projected_point_a.j + 150);
    context.lineTo(projected_point_b.i + 200, projected_point_b.j + 150);
    context.stroke();
  }
  
  requestAnimationFrame(render)
}

requestAnimationFrame(render)
