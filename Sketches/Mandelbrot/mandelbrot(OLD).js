var header;
var footer;
var cnv;
var tooSmall;
var aspectRatioTop;
var aspectRatioBottom

// Colors
var black;
var white;
var lightGrey;
var redCol;
var darkAccent;
var lightAccent;
var brightAccent;

function defaultSetup() {
  // Initialize Variables
  header = document.getElementById("header");
  footer = document.getElementById("footer");
  headerH = header.offsetHeight;
  footerH = footer.offsetHeight;
  tooSmall = false;

  // 3:2 aspect ratio
  aspectRatioTop = 3;
  aspectRatioBottom = 2;
  cnv = createCanvas(10, 10);
  windowResized();

  // Colors
  black = color(0);
  white = color(255);
  lightGrey = color(165);
  redCol = color('#d62828');
  darkAccent = color('#003049');
  lightAccent = color('#fcbf49');
  brightAccent = color('#f77f00');
}

function windowResized(){
  var canvH = windowHeight - headerH - footerH - 30;
  var canvW = windowWidth;
  var calcW = canvH*(aspectRatioTop/aspectRatioBottom);

  // Maintain 16:9 ratio based off height
  if (calcW > canvW){
    // Width is limiting factor
    canvH = canvW/(aspectRatioTop/aspectRatioBottom);
  } else {
    // Height is limiting factor
    canvW = canvH*(aspectRatioTop/aspectRatioBottom);
  }

  // Set the "too small" flag
  if (canvW < 700){
    tooSmall = true;
  } else {
    tooSmall = false;
  }

  resizeCanvas(canvW, canvH);

  var x = (windowWidth - canvW)/2;
  cnv.position(x, headerH+10);
}

function debugOutline() {
  stroke(darkAccent);
  strokeWeight(8);
  noFill();
  rect(0, 0, width, height);
}

function tooSmallError(){
  background(255);
  textSize(32);
  strokeWeight(0);
  translate(width/2, height/2);
  textAlign(CENTER);
  fill(brightAccent);
  text("Window too small!", 0, -20);
  fill(black);
  text("Please increase window size.", 0, 20);
}

/*---------------START----------------*/

var img; // The image to be drawn to screen
var sizeFactor = 0.1; // The px size factor of the image from 0-1
var iterationNumber = 20; // How many times to iterate function per pixel
var leftX = -2; // The x value at the left of the screen
var topY = 1; // The y value at the top of the screen
var zoomLvl = 1; // The zoom level
var dragging = false; // Is the screen being dragged?
var offsetX = 0; // The x offset for dragging
var offsetY = 0; // The y offset for dragging
var centerPnt = 0; // The complex value at the center of the screem

function setup() {
  defaultSetup();
  noLoop();
  // The starting center point
  centerPnt = new complexNum((aspectRatioBottom*zoomLvl)/2, (aspectRatioBottom*zoomLvl)/2);
}

function drawFunc() {
  img = createImage(floor(width*sizeFactor), floor(height*sizeFactor));
  img.loadPixels();

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      // Map the x and y to correct values
      let xMap = map(x, 0, img.width, leftX, leftX+(aspectRatioTop*zoomLvl));
      let yMap = map(y, 0, img.height, topY, topY-(aspectRatioBottom*zoomLvl));

      // X is real value, Y is imaginary value
      let c = new complexNum(xMap, yMap);
      let colMap = map(mandelbrot(c), 0, 1, 255, 0);
      let pxCol = color(0.3*colMap, 0.5*colMap, 1.5*colMap);
      
      /*let lineRadius = 0.019;
      if (xMap < lineRadius && xMap > -lineRadius) {
        pxCol = color(redCol);
      }
      if (yMap < lineRadius && yMap > -lineRadius) {
        pxCol = color(redCol);
      }*/
      img.set(x, y, pxCol);
    }
  }
  img.updatePixels();
  img.resize(width, height);
  image(img, 0, 0);

  // Print some stats on the screen
  textSize(15);
  fill(white);
  strokeWeight(2);
  stroke(0);
  let zoomString = "Zoom = " + zoomLvl.toFixed(2);
  text(zoomString, 20, 50);

  // Draw lines
  stroke(white);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);

  // Draw center point
  fill(redCol);
  strokeWeight(0);
  ellipse(width/2, height/2, 10, 10);

  debugOutline();
}

function mousePressed() {
  dragging = true;

  // Get the initial click position
  offsetX = mouseX;
  offsetY = mouseY;
}

function mouseReleased() {
  dragging = false;

  // Get the drag length (in x and in y) as percentage of screen
  offsetX = (offsetX - mouseX)/width;
  offsetY = -(offsetY -mouseY)/height;

  // Cap the offsets to max 1 min 0
  if (offsetX > 1) {
    offsetX = 1;
  } else if (offsetX < -1) {
    offsetX = -1;
  }
  if (offsetY > 1) {
    offsetY = 1;
  } else if (offsetY < -1) {
    offsetY = -1;
  }

  let zoomFactor = Math.sqrt(zoomLvl);
  leftX += offsetX*zoomFactor;
  topY += offsetY*zoomFactor;

  // Reset offsets
  offsetX = 0;
  offsetY = 0;

  print(mouseX, mouseY);

  centerPnt = new complexNum((aspectRatioBottom*zoomLvl)/2, (aspectRatioBottom*zoomLvl)/2);
  print(centerPnt);

  // Redraw the screen

  draw();
}

// Zoom on scroll
function mouseWheel(event) {
  zoomLvl += event.delta*0.01;

  if (zoomLvl > 1){
    zoomLvl = 1;
  } else if (zoomLvl < 0){
    zoomLvl = 0;
  }

  let graphWidth = Math.abs(aspectRatioTop*zoomLvl);
  let graphHeight = Math.abs(aspectRatioBottom*zoomLvl);

  let xPos;
  if (mouseX > width){
    xPos = width;
  } else if (mouseX < 0) {
    xPos = 0;
  } else {
    xPos = mouseX;
  }
  let yPos;
  if (mouseY > height) {
    yPos = height;
  } else if (mouseY < 0) {
    yPos = 0;
  } else {
    yPos = mouseY;
  }

  // Get positions as percentage of width / height
  xPos = xPos / width;
  yPos = yPos / height;

  // Map positions to middle (half negative half positive)
  xPos = map(xPos, 0, 1, -(graphWidth/2), (graphWidth/2));
  yPos = map(yPos, 0, 1, (graphHeight/2), -(graphHeight/2));

  //print(graphHeight);

  // Zoom to where mouse position is
  let amntX = zoomLvl/graphWidth;
  let amntY = zoomLvl/graphHeight;

  leftX += xPos*amntX;
  topY += yPos*amntY;

  // Redraw the screen
  draw();
}
 
// Calculating if a number is part of the set
function mandelbrot(c) {
  let z = new complexNum(0, 0);
  for (let iter = 0; iter < iterationNumber; iter++){
    z = z.square().add(c); 
    if (z.abs() > 2){
      return iter/iterationNumber; // Number is not part of the set
    }
  }
  return 1; // This value is part of the set
}

//Class for creating and using complex values
class complexNum {
  // Real and Imaginary Components
  constructor(r, i) {
    this.i = i;
    this.r = r;
  }

  // Getters and setters
  getI() {return this.i;}

  setI(newI) {this.i = newI;}

  getR() {return this.r;}

  setR(newR) {this.r = newR;}

  // Square the value
  square() {
    let newR = Math.pow(this.r, 2) - pow(this.i, 2);
    let newI = 2*this.r*this.i;
    return new complexNum(newR, newI);
  }

  // Add another complex value
  add(otherNum) {
    let newR = this.r + otherNum.getR();
    let newI = this.i + otherNum.getI();
    return new complexNum(newR, newI);
  }

  // Get absolute value
  abs(){
    return Math.sqrt(Math.pow(this.r, 2) + Math.pow(this.i, 2));
  }

  // Get coordinates
  toString (){
    return "(R: " + this.r + ", I: " + this.i + ")";
  }
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    drawFunc();
  }
}

