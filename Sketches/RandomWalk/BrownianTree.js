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

let qualitySlider;
let uiGraphics;

let walkerNum = 100; // Number of moving walkers
let walkerR;
let walkers;
let ring;
let innerBound;
let outerBound;
let expandObject;
let maxObjectSize = 500;
let showWalkers = true;
let showBounds = false;
let colT;

let fromPoint = true;

function setup() {
  defaultSetup();

  // The UI
  uiGraphics = createGraphics(width, 40);
  let ctrlBox = document.getElementById("controlBox");
  qualitySlider = createSlider(100, 300, 150);
  qualitySlider.parent(ctrlBox);
  qualitySlider.class("slider");
  qualitySlider.input(reset);

  walkerR = width/qualitySlider.value();
  walkerNum = qualitySlider.value()*1.1;
  maxObjectSize = qualitySlider.value()*7.5;

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

function Walker(x, y) {
  this.x = x;
  this.y = y;
  // Disconnected by default
  this.connected = false;

  this.show = function() {
    noStroke();
    rectMode(RADIUS);
    if (this.connected) {
      rect(this.x, this.y, walkerR, walkerR);
    } else if (showWalkers){
      fill(100,80,100);
      ellipse(this.x, this.y, walkerR, walkerR);
    }
    colorMode(RGB);
  }

  this.move = function() {
    if (!this.connected) {
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
}

function reset() {
  colT = 0;
  expandObject = true;
  ring = width/10; // Start point of ring width
  walkers = [];
  innerBound = new Bound(0,0,0,0);
  outerBound = new Bound(0,0,0,0);

  if (fromPoint) {
    // Generate from a point
    walkers[0] = new Walker(width/2, height/2);
    walkers[0].connected = true;
  } else {
    // Generate from line
    let numOfStartPoints = floor(width/walkerR);
    for (let i = 0; i < numOfStartPoints; i++) {
      walkers[i] = new Walker((i+0.5)*(width/numOfStartPoints), height/2);
      walkers[i].connected = true;
    }
  }
  
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    walkerR = width/qualitySlider.value();
    walkerNum = qualitySlider.value();
    maxObjectSize = qualitySlider.value()*7.5;

    blendMode(DARKEST);
    background(0, 100);
    blendMode(BLEND);

    uiGraphics.fill(100);
    uiGraphics.noStroke();
    uiGraphics.textSize(20);
    uiGraphics.background(0);
    uiGraphics.text('Quality: '+qualitySlider.value(), width-125, 30)

    colT+=1;

    // Stop adding new walkers once max size is reached
    if (walkers.length-walkerNum >= maxObjectSize || !expandObject) {
      expandObject = false;
      showBounds = false;
      uiGraphics.text('Done Generating', 20, 30);
    } else {
      let genProg = (max(((walkers.length-walkerNum)/maxObjectSize)*100, 0)).toFixed(1);
      uiGraphics.text('Generating: '+genProg+'%', 20, 30);
    }

    // Draw all the walkers
    let disconnectedNum = 0;
    let left = width;
    let right = 0;
    let top = height;
    let bottom = 0;
    for (let i = 0; i < walkers.length; i++) {
      walkers[i].move();
      colorMode(HSB);
      let distFromCenter;
      if (fromPoint) {
        // Color based on distance from center
        let calcPntX = width/2;
        let calcPntY = height/2; 
        let xPos = abs(walkers[i].x-(calcPntX)); 
        let yPos = abs(walkers[i].y-(calcPntY)); 
        distFromCenter = sqrt(xPos*xPos + yPos*yPos); 
      } else {
        distFromCenter = abs(walkers[i].y-height/2);
      }

      fill((distFromCenter*0.8+colT)%360,100,100);
      walkers[i].show();
      if (!walkers[i].connected) {
        disconnectedNum++;

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

        // Check if attached
        for (let n = 0; n < walkers.length; n++) {
          if (i != n && walkers[n].connected &&
            abs(walkers[i].x-walkers[n].x)<=2*walkerR &&
            abs(walkers[i].y-walkers[n].y)<=2*walkerR) {
              walkers[i].connected = true;
          }
        }   
      } else {
        // Calculate bounds of connected object
        if (walkers[i].x < left) {
          left = walkers[i].x;
        } 
        if (walkers[i].x > right) {
          right = walkers[i].x;
        }
        if (walkers[i].y < top) {
          top = walkers[i].y;
        } 
        if (walkers[i].y > bottom) {
          bottom = walkers[i].y;
        }
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

    // Add a new walker (not in bounds of object)
    if (disconnectedNum < walkerNum && expandObject) {
      for (let i = 0; i < walkerNum-disconnectedNum; i++) {
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
    
    image(uiGraphics, 0, 0);
    //debugOutline();
  }
}