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
  aspectRatioTop = 10;
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

  reset();
}

function debugOutline() {
  stroke(darkAccent);
  strokeWeight(8);
  noFill();
  rectMode(CORNER);
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

let qualityLbl;
let qualitySlider;
let generateLbl;
let playBtn;

let walkerNum = 100; // Number of moving walkers
let walkerR;
let walkers;
let brownianTree;
let ring;
let innerBound;
let outerBound;
let expandObject;
let maxTreeSize = 500;
let showWalkers = true;
let showBounds = false;
let colT;
let centerVect;

let fromPoint = true;

function setup() {
  defaultSetup();

  // The UI
  let qualityBox = document.getElementById("qualityBox");
  qualitySlider = createSlider(100, 300, 150);
  qualitySlider.parent(qualityBox);
  qualitySlider.class("slider");
  qualitySlider.input(reset);
  generateLbl = document.getElementById("generationLabel");
  qualityLbl = document.getElementById("qualityLbl");
  playBtn = document.getElementById("play");
  playBtn.onclick = reset;

  walkerR = width/qualitySlider.value();
  walkerNum = qualitySlider.value()*1.1;
  maxTreeSize = qualitySlider.value()*7.5;

  reset();
}

function Bound(lx, ly, rx, ry) {
  this.lx = lx;
  this.ly = ly;
  this.rx = rx;
  this.ry = ry;

  this.show = function() {
    noFill();
    stroke(255);
    strokeWeight(1);
    rectMode(CORNERS);
    rect(this.lx, this.ly, this.rx, this.ry);
  }
}

// The branches in the brownian tree
function Branch(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;

  this.show = function() {
    // Color based on distance from center
    let calcPntX = centerVect.x;
    let calcPntY = centerVect.y; 
    let xPos = abs(this.x1-(calcPntX)); 
    let yPos = abs(this.y1-(calcPntY));
    let distFromCenter;
    if (fromPoint) {
      distFromCenter = sqrt(xPos*xPos + yPos*yPos); 
    } else {
      distFromCenter = abs(this.y1-centerVect.y);
    }
    colorMode(HSB);
    let lineHue = (distFromCenter*0.8+colT)%360;
    stroke(lineHue,100,100);
    let innerW = 7;
    let outerW = 2;
    let thicknessVal = distFromCenter/((innerBound.ry - innerBound.ly)/2);
    if (map(thicknessVal, 0, 1, innerW, outerW) > max(innerW, outerW)) {
      thicknessVal = min(innerW, outerW);
    } else {
      thicknessVal = map(thicknessVal, 0, 1, innerW, outerW);
    }
    strokeWeight(0);
    fill(lineHue,100,100);
    ellipse(this.x2, this.y2, thicknessVal*1.25);
    strokeWeight(thicknessVal);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

function Walker(x, y) {
  this.x = x;
  this.y = y;

  this.show = function() {
    noStroke();
    colorMode(HSB);
    rectMode(RADIUS);
    if (showWalkers){
      fill(100,80,100);
      ellipse(this.x, this.y, walkerR, walkerR);
    }
    colorMode(RGB);
  }

  this.move = function() {
    let direction = floor(random(4));
    let speed = 2;
    if (direction == 0) {
      // North
      this.y -= walkerR*speed;
    } else if (direction == 1) {
      // East
      this.x += walkerR*speed;
    } else if (direction == 2) {
      // South
      this.y += walkerR*speed;
    } else if (direction == 3) {
      // West
      this.x -= walkerR*speed;
    }
  }
}

function reset() {
  colT = 0;
  expandObject = true;
  ring = width/10; // Start point of ring width
  walkers = [];
  brownianTree = [];
  innerBound = new Bound(0,0,0,0);
  outerBound = new Bound(0,0,0,0);

  centerVect = createVector(width/2, height/2 - (height/18));

  if (fromPoint) {
    // Generate from a point
    brownianTree[0] = new Branch(width/2, centerVect.y, width/2+walkerR*2, centerVect.y);
  } else {
    // Generate from line // TODO
    let numOfStartPoints = floor(width/walkerR/4);
    for (let i = 0; i < numOfStartPoints; i++) {
      brownianTree[i] = new Branch((i+0.5)*(width/numOfStartPoints), centerVect.y,
       (i+0.5)*(width/numOfStartPoints)+walkerR*3, centerVect.y);
    }
  }
  
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    walkerR = width/qualitySlider.value();
    walkerNum = qualitySlider.value();
    maxTreeSize = qualitySlider.value()*7.5;

    blendMode(DARKEST);
    colorMode(RGB);
    background(0, 100);
    blendMode(BLEND);

    colT+=1;

    let qualityNum = map(qualitySlider.value(), 100, 300, 0, 100).toFixed(0);
    qualityLbl.innerText = "Quality: "+qualityNum+"%";

    // Stop adding new walkers once max size is reached
    if (brownianTree.length >= maxTreeSize || !expandObject) {
      expandObject = false;
      showBounds = false;
      generateLbl.innerText = "Done Generating";
    } else {
      let genProg = (max((brownianTree.length/maxTreeSize)*100, 0)).toFixed(1);
      generateLbl.innerText = 'Generating: '+genProg+'%';
    }

    // Draw all the walkers
    for (let i = 0; i < walkers.length; i++) {
      walkers[i].move();
      walkers[i].show();

      // Stop growing if the brownian tree has reached top or bottom of the screen
      if (walkers[i].y < 0 || walkers[i].y > height) {
        expandObject = false;
      }

      // Remove if object is done growing
      if (!expandObject) {
        walkers.splice(i, 1);
        continue;
      }

      // Remove if out of screen
      if (walkers[i].x < outerBound.lx || walkers[i].x > outerBound.rx
        || walkers[i].y < outerBound.ly || walkers[i].y > outerBound.ry) {
          walkers.splice(i, 1);
          continue;
      }

      // Check if colliding
      for (let n = 0; n < brownianTree.length; n++) {
        if (abs(walkers[i].x-brownianTree[n].x2)<=2*walkerR &&
            abs(walkers[i].y-brownianTree[n].y2)<=2*walkerR) {
            // Add to a branch to the brownian tree
            let newBranch = new Branch(brownianTree[n].x2, brownianTree[n].y2, walkers[i].x, walkers[i].y);
            brownianTree.push(newBranch);
            walkers.splice(i, 1);
            break;
        }
      }   
    }

    let left = width;
    let right = 0;
    let top = height;
    let bottom = 0;
    // Draw the brownian tree
    for (let i = 0; i < brownianTree.length; i++) {
      brownianTree[i].show();

      // Calculate the bounds of the brownian tree
      if (brownianTree[i].x2 < left) {
        left = brownianTree[i].x2;
      } 
      if (brownianTree[i].x2 > right) {
        right = brownianTree[i].x2;
      }
      if (brownianTree[i].y2 < top) {
        top = brownianTree[i].y2;
      } 
      if (brownianTree[i].y2 > bottom) {
        bottom = brownianTree[i].y2;
      }
    }

    // Show inner and outer bounds
    left -= walkerR;
    right += walkerR;
    top -= walkerR;
    bottom += walkerR;

    innerBound.lx = left;
    innerBound.ly = top;
    innerBound.rx = right;
    innerBound.ry = bottom;
    
    ring = max((width/10)-(((right-left)+(bottom-top))/10), width/50);
    outerBound.lx = left-ring;
    outerBound.ly = top-ring;
    outerBound.rx = right+ring;
    outerBound.ry = bottom+ring;

    if (showBounds) {
      innerBound.show();
      outerBound.show();
    }

    // Add a new walker (between inner and outer bounds)
    if (walkers.length < walkerNum && expandObject) {
      for (let i = 0; i < walkerNum-walkers.length; i++) {
        let inBounds = false;
        let newX;
        let newY;
        while (!inBounds) {
          newX = floor(random(width));
          newY = floor(random(height));

          if (newX < outerBound.rx && newX > outerBound.lx &&
              newY < outerBound.ry && newY > outerBound.ly &&
            !(newX < innerBound.rx && newX > innerBound.lx &&
              newY < innerBound.ry && newY > innerBound.ly)) {
             inBounds = true;
          }
        }
        walkers.push(new Walker(newX, newY));
      }
    }
  }
}