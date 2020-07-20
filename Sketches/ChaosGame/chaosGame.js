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

  // Maintain 1:1 ratio based off height
  if (calcW > canvW){
    // Width is limiting factor
    canvH = canvW/(aspectRatioTop/aspectRatioBottom);
  } else {
    // Height is limiting factor
    canvW = canvH*(aspectRatioTop/aspectRatioBottom);
  }

  // Set the "too small" flag
  if (canvW < 200){
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

let vertNum = 3;
let jumpLength = 1/2;
let radius;
let attractors = [];
let dot;
let iterations = 5000;
// Modes: 1, 2, 3, ..., n
let mode;

// UI
let vertNumRange;
let vertNumTitle;
let jumpLengthRange;
let jumpLengthTitle;
let ruleRange;
let ruleTitle;
let polygonRadioBtn;
let polygonTitle;
let vertNumSlot;


function Attractor(num) {
  let angle = (-HALF_PI)+num*(TWO_PI/vertNum);
  this.x = (width/2)+(radius*cos(angle));
  this.y = (height/2)+(radius*sin(angle));

  this.show = function() {
    strokeWeight(6);
    stroke(redCol);
    point(this.x, this.y);
  }
}

function Dot() {
  this.prevNum = -1;
  this.x = width/2;
  this.y = height/2;

  this.newSpot = function() {
    let num = floor(random(vertNum));
    while (abs(this.prevNum-num) == mode) {
      num = floor(random(vertNum));
    }

    this.prevNum = num;
    this.x = this.x + (attractors[num].x-this.x)*jumpLength;
    this.y = this.y + (attractors[num].y-this.y)*jumpLength;
  }

  this.show = function() {
    strokeWeight(1);
    stroke("#0d89c5");
    point(this.x, this.y);
  }
}

function setup() {
  defaultSetup();

  mode = vertNum;
  reset();

  vertNumRange = document.getElementById("vertNumRange");
  vertNumTitle = document.getElementById("vertNumTitle");
  vertNumRange.addEventListener('change', function () {
    vertNum = vertNumRange.value;
    ruleRange.max = vertNum;
    ruleRange.value = vertNum;
    mode = vertNum;
    ruleTitle.innerHTML = "Default <i>(Don't Skip Vertices)</i>";
    reset();
  }, false);
  vertNumRange.addEventListener('input', function () {
    vertNumTitle.innerText = "Number of Vertices: "+vertNumRange.value ;
  }, false);

  ruleRange = document.getElementById("ruleRange");
  ruleTitle = document.getElementById("ruleTitle");
  ruleRange.addEventListener('change', function () {
    mode = ruleRange.value;
    reset();
  }, false);
  ruleRange.addEventListener('input', function () {
    if (ruleRange.value == 0) {
      ruleTitle.innerText = "Skip vertex if it is the same as the previous vertex.";
    } else if (ruleRange.value == vertNum) {
      ruleTitle.innerHTML = "Default <i>(Don't Skip Vertices)</i>";
    } else {
      ruleTitle.innerText = "Skip vertex if it is "+ruleRange.value+" positions away from the previous vertex.";
    }
  }, false);
  ruleRange.value = vertNum;

  jumpRange = document.getElementById("jumpRange");
  jumpTitle = document.getElementById("jumpTitle");
  jumpRange.addEventListener('change', function () {
    jumpLength = (jumpRange.value/100).toFixed(2);
    reset();
  }, false);
  jumpRange.addEventListener('input', function () {
    jumpTitle.innerText = "Jump Length: "+(jumpRange.value/100).toFixed(2);
  }, false);

  vertNumSlot = document.getElementById("vertNumSlot");
  polygonRadioBtn = document.getElementsByClassName('polygonRadioBtn');
  polygonRadioBtn[0].addEventListener('input', function() {
    polygonTitle.innerText = "Polygon: Regular";
    vertNumSlot.style.display = "table-cell";
  });
  polygonRadioBtn[1].addEventListener('input', function() {
    polygonTitle.innerText = "Polygon: Hand Drawn";
    vertNumSlot.style.display = "none";
  });
  polygonTitle = document.getElementById("polygonTitle");
}

function reset() {
  background(255);
  radius = (width/1.1)/2;
  dot = new Dot();
  attractors = [];
  for (let i = 0; i < vertNum; i++) {
    attractors.push(new Attractor(i));
  }
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    //background(255);
    strokeWeight(3);
    stroke(black);
    noFill();
    //ellipse(width/2, height/2, radius*2, radius*2);

    // Draw the dots
    for (let i = 0; i < iterations; i++) {
      dot.newSpot();
      dot.show();
    } 

    // Draw the attractors
    for (attractor of attractors) {
     attractor.show();
    }

  }
}

