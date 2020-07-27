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
let shapeType = "regular";

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
  radius = (width/1.1)/2;
  attractors = [];
  for (let i = 0; i < vertNum; i++) {
    attractors.push(new Attractor(i));
  }

  vertNumRange = document.getElementById("vertNumRange");
  vertNumTitle = document.getElementById("vertNumTitle");
  vertNumRange.addEventListener('change', function () {
    vertNum = vertNumRange.value;
    setRules();
    attractors = [];
    for (let i = 0; i < vertNum; i++) {
      attractors.push(new Attractor(i));
    }
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
    shapeType = "regular";
    attractors = [];
    for (let i = 0; i < vertNum; i++) {
      attractors.push(new Attractor(i));
    }
    reset();
    vertNumSlot.style.display = "table-cell";
  });
  polygonRadioBtn[1].addEventListener('input', function() {
    polygonTitle.innerText = "Polygon: Custom";
    shapeType = "irregular";
    attractors = [];
    vertNumSlot.style.display = "none";
  });
  polygonTitle = document.getElementById("polygonTitle");

  reset();
}

function reset() {
  background(255);
  dot = new Dot();
}

function setRules() {
  ruleRange.max = vertNum;
  ruleRange.value = vertNum;
  mode = vertNum;
  ruleTitle.innerHTML = "Default <i>(Don't Skip Vertices)</i>";
}

function mouseClicked() {
  // Check if it was on the canvas
  if (mouseX < width &&
      mouseX > 0 &&
      mouseY < height &&
      mouseY > 0 &&
      shapeType == "irregular") {
        if (attractors.length < 10) {
          let vertex = new Attractor(0);
          vertex.x = mouseX;
          vertex.y = mouseY;
          attractors.push(vertex);
        } else {
          print("ERROR!");
        }
  }
}

function keyPressed() {
  if (keyCode === 32) {
    shapeType = "regular";
    vertNum = attractors.length;
    background(255);
    setRules();
  }
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    if (shapeType == "regular") {
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
    } else {
      background(255);
      strokeWeight(15);
      stroke(lightAccent);
      point(mouseX, mouseY);

      // Draw the shape
      strokeWeight(1);
      stroke(100);
      fill(200);
      beginShape();
      for (attractor of attractors) {
        vertex(attractor.x, attractor.y);
      }
      if (attractors.length < 10) {
        vertex(mouseX, mouseY);
      }
      endShape(CLOSE);

      // Draw the attractors
      for (let i = 0; i < attractors.length; i++) {
        attractors[i].show();
        noStroke();
        textSize(15);
        fill(0);
        text(i+1, attractors[i].x, attractors[i].y-15);
      }

      // Vertex Counter
      strokeWeight(2);
      stroke(darkAccent);
      fill(255, 100);
      rect(width-150, 0, 150, 60);
      textSize(20);
      textAlign(CENTER, CENTER);
      noStroke();
      fill(0);
      text("Vertices: "+attractors.length, width-150, 0, 150, 60);


      debugOutline();
    }   
  }
}

/*
      noStroke();
      fill(255, 100);
      rect(0, 0, width, 100);
      fill(0);
      textSize(20);
      textAlign(CENTER, CENTER);
      let instructions = "Click anywhere within the box to add a vertex to your custom "+
      "shape. The shape must have from 3 to 10 vertices. Once the shape is complete press the 'End Shape' button.";
      let padding = 25;
      text(instructions, padding, 0, width-padding*2, 100);
*/

