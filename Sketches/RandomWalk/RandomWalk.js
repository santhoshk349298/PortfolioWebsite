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

  resetDrawing();
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

var qualitySlider;

var stepLengthW;
var stepLengthH;
var middleH;
var middleW;

var stepsPerFrame = 25;
var maxLineLength = 500;
var delayOn = false;
var delayTimeMS = 1;
var gridOn = true;
var lineOpacity = 1;

function linePiece(dir, startX, startY, endX, endY) {
  this.direction = dir; // # from 1-4 representing North, East, South, West
  this.startX = startX;
  this.startY = startY;
  this.endX = endX;
  this.endY = endY;
}

var lineList = [];

// A sleep function called with "await sleep(x)" in async functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// This simulates Brownian motion in the limit
function setup() {
  // Setup UI
  let ctrlBox = document.getElementById("controlBox");

  qualitySlider = createSlider(100, 300, 300);
  qualitySlider.parent(ctrlBox);
  qualitySlider.input(resetDrawing);

  frameRate(30);

  defaultSetup();
}

function resetDrawing() {
  lineList = [];
  clear();
}

async function randomWalk() {
  let currentLine = new linePiece();
  if (lineList.length == 0) {
    // Start the line in the middle
    currentLine.startX = middleW;
    currentLine.startY = middleH;
  } else {
    currentLine.startX = lineList[lineList.length-1].endX;
    currentLine.startY = lineList[lineList.length-1].endY;
  }
  currentLine.direction = floor(random(1,5));

  // Determine end based off start and direction
  // Make it wrap to other end of screen if out of bounds
  if (currentLine.direction == 1) {
    // North
    if (currentLine.startY <= 0) {
      currentLine.startY = height;
    }
    currentLine.endX = currentLine.startX;
    currentLine.endY = currentLine.startY-stepLengthH;
  } else if (currentLine.direction == 2) {
    // East
    if (currentLine.startX >= width) {
      currentLine.startX = 0;
    }
    currentLine.endX = currentLine.startX+stepLengthW;
    currentLine.endY = currentLine.startY;
  } else if (currentLine.direction == 3) {
    // South
    if (currentLine.startY >= height) {
      currentLine.startY = 0;
    }
    currentLine.endX = currentLine.startX;
    currentLine.endY = currentLine.startY+stepLengthH;
  } else {
    // West
    if (currentLine.startX <= 0) {
      currentLine.startX = width;
    }
    currentLine.endX = currentLine.startX-stepLengthW;
    currentLine.endY = currentLine.startY;
  }

  // Add new piece to the line
  lineList.push(currentLine);
  if (lineList.length > maxLineLength) {
    lineList.shift();
  }
}

function drawGrid() {
  stroke(100);
  strokeWeight(1);
  let stepsW = qualitySlider.value();
  maxLineLength = stepsW*5;
  stepsPerFrame = stepsW/10;
  // Make sure stepsW is even to be centered
  if (stepsW % 2 != 0) {
    stepsW++;
  }
  stepLengthW = width/stepsW;
  middleW = floor(stepsW/2)*stepLengthW;
  if (gridOn) {
    for (let i = 1; i < stepsW; i++) {
      // Draw vertical lines
      line(stepLengthW*i, 0, stepLengthW*i, height);
    }
  }

  let stepsH = stepsW/(aspectRatioTop/aspectRatioBottom);
  // Get rid of extra part-steps by stretching vertically
  if (stepsH - floor(stepsH) != 0) {
    let extraLength = (stepsH-floor(stepsH))*stepLengthW/floor(stepsH);
    stepLengthH = stepLengthW + extraLength;
  } else {
    stepLengthH = stepLengthW;
  }
  middleH = floor(stepsH/2)*stepLengthH;
  if (gridOn) {
    for (let i = 1; i < floor(stepsH); i++) {
      // Draw horizontal lines
      line(0, stepLengthH*i, width, stepLengthH*i);
    }
  }

  fill(255, 0, 0);
  //ellipse(middleW, middleH, (stepLengthW/2), (stepLengthW/2));
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    colorMode(RGB);
    background(255);
    drawGrid();

    for(let i = 0; i < stepsPerFrame; i++) {
      randomWalk();
    }

    colorMode(HSB);
    strokeWeight(3);
    lineList.forEach(function(item, index, array) {
      let hue = map(item.startX, 0, width, 0, 360);
      stroke(hue, 100, 50);
      line(item.startX, item.startY, item.endX, item.endY);
    }) 
  }
}