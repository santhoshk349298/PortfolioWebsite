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

  // 16:9 aspect ratio
  aspectRatioTop = 16;
  aspectRatioBottom = 9;
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

let num; // The number being visualized
let digCols = []; // Colors of digits 1-9 (Make in binary and other later!)
let sliderDen;

function setup() {
  defaultSetup();

  for (let i = 0; i < 10; i++) {
    digCols[i] = [random(255), random(255), random(255)];
  }

  //sliderDen = createSlider(1, 20, 7);
}

function renderColor() {
  let colWidth = width/num.length;
  for (let i = 0; i < num.length; i++) {
    // Get the color of the rectangle
    let r = digCols[num[i]][0];
    let g = digCols[num[i]][1];
    let b = digCols[num[i]][2];
    fill(r, g, b);
    strokeWeight(0);
    rect(i*colWidth, 0, colWidth+1, height);
    fill(0);
    textSize(25);
    stroke(255);
    strokeWeight(2);
    text(num[i], (i*colWidth)+(colWidth/2), height/2);
  }
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    Decimal.precision = 120;
    num = Decimal.div(Math.PI, 1);
    num = num.toString().slice(2);
    renderColor();
    
    debugOutline();
  }
}