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

  // 1:1 aspect ratio
  aspectRatioTop = 1;
  aspectRatioBottom = 1;
  cnv = createCanvas(10, 10, WEBGL);
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

let angle = 0;
let sphere_;
let total = 20;
let t = 0;
let textOverlay;

function setup() {
  defaultSetup();
  textOverlay = createGraphics(width, height);

  // Create the sphere
  sphere_ = makeSphere();
  textFont(fontFamily);
}

let fontFamily;
function preload() {
  fontFamily = loadFont('Sketches/WelcomeScreen/BERNHC.TTF');
}

function makeSphere() {
  let globe = new Array(total);
  
  for (let i = 0; i < total; i++) {
    let longitude = map(i, 0, total, -PI, PI);
    globe[i] = new Array(total);
    for (let j = 0; j < total; j++) {
      let latitude = map(j, 0, total-1, -HALF_PI, HALF_PI);
      let pntX = sin(longitude)*cos(latitude);
      let pntY = sin(longitude)*sin(latitude);
      let pntZ = cos(longitude);
      globe[i][j] = createVector(pntX, pntY, pntZ);
    }
  }
  return globe;
}

let Rwidth;
let Rheight;
let Rdepth;
// Sets sizes based on screen size
function setSizes() {
  Rwidth = width/2;
  Rheight = width/10;
  Rdepth = width/5;
}

function draw() {
  setSizes();
  background(255);

  t += 0.05;

  push();
  // Display the sphere
  rotateScreen();
  let min = width/6;
  let max = width/2.5;
  let r1 = map(sin(t), -1, 1, min, max);
  let r2 = map(sin(t), -1, 1, max, min);
  for (let i = 0; i < total; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < total; j++) {
      let hue = map(j, 0, total, 0, 360);
      strokeWeight(0);
      stroke(255);
      let v1 = sphere_[i][j];
      let v2;
      if (i != total-1) {
        v2 = sphere_[i+1][j];   
      } else {
        v2 = sphere_[0][j]; 
      }
      colorMode(HSB);
      let brightness = map(v1.mag(), min, max, 0, 100);
      if (i%2 == 0) {
        v1.setMag(r1);
        v2.setMag(r1);
      } else {
        v1.setMag(r2);
        v2.setMag(r2);
      }
      fill(hue, 100, 100);
     

      vertex(v2.x, v2.y, v2.z);
      vertex(v1.x, v1.y, v1.z);
    }
    endShape();  
  }
  pop();

  push()
  translate(0,0,width/2);
  strokeWeight(3);
  //print(textSize());
  textSize(width/8);

  textAlign(CENTER, CENTER);
  fill(255);
  text("welcome", height/200, -height/25+height/200);

  fill(0);
  text("welcome", 0, -height/25);
  pop();
 

  angle += 0.02;
}

function rotateScreen() {
  rotateX(angle);
  rotateY(angle*0.5);
  rotateZ(angle*0.01)
}