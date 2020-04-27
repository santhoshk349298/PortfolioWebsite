function setup() {
  createCanvas(windowWidth, windowHeight);
   
}

function draw() {
  background(25);
  rectangle();
}

function rectangle() {
  stroke(0);
  strokeWeight(10);
  fill(255,255,255);
  rect(0, 0, windowWidth, 500);
}