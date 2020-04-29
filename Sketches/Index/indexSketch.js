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

  // Window setup
  ctrlWindow = document.getElementById("controlWindow");
  windowBounds = ctrlWindow.getBoundingClientRect();
  grabber = document.getElementById("grabber");
  grabberBounds = grabber.getBoundingClientRect();

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

  // Update window bounds
  windowBounds = ctrlWindow.getBoundingClientRect();
  grabberBounds = grabber.getBoundingClientRect();
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

  // Make window invisible
  ctrlWindow.style.display = "none";
}

/*---------------START----------------*/

var chars;
var charObjs;
var goBtn;
var frictionSlider;
var gravitySlider;

var frictionVal;
var gVal;

var ranOnce = false;

// Moving window
var ctrlWindow; // The window div element
var windowBounds; // The bounds of the window frame
var grabber // The window grabber (at the top)
var grabberBounds // The bounds of the grabber
var dragging = false; // Is the window being dragged?
var offsetX, offsetY; // Mouseclick offset
var ctrlWindowWidth = 370; // The width (in px) of the window
var ctrlWindowHeight = 170; // The height (in px) of the window

class CharObj {
  constructor(char, x, y, velX, velY, pntX, pntY, col){
    this.char = char;
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.pntX = pntX;
    this.pntY = pntY;
    this.col = col;
  }

  move() {
    // Calculates the x and y distance to the attractor point
    let xDist = this.x - this.pntX;
    let yDist = this.y - this.pntY;
    let dist = createVector(xDist, yDist);

    dist = dist.mult((1-dist.mag())*gVal);

    // Subtracts that distance from velocity
    this.velX -= dist.x;
    this.velY -= dist.y;

    // Flip velocity if at boundary
    if ((this.x > 1 && this.velX > 0) || (this.x < 0 && this.velX < 0)){
      this.velX = -this.velX;
    }
    if ((this.y > 1 && this.velY > 0) || (this.y < 0 && this.velY < 0)){
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;

    // Slow velocity each frame (Friction)
    this.velX = this.velX*frictionVal;
    this.velY = this.velY*frictionVal;
  }

  display() {
    text(this.char, this.x*width, this.y*height);
  }

  getCol() {
    return this.col;
  }
}

function mousePressed() {
  // Did I click on the rectangle?
  if (
      mouseX > grabberBounds.left-cnv.position().x 
   && mouseX < grabberBounds.right-cnv.position().x
   && mouseY > grabberBounds.top-cnv.position().y
   && mouseY < grabberBounds.bottom-cnv.position().y) {
    dragging = true;
    // If so, keep track of relative location of click to corner of rectangle
    offsetX = windowBounds.left-mouseX;
    offsetY = windowBounds.top-mouseY;
  }
}

function mouseReleased() {
  // Quit dragging
  dragging = false;
}

function setup() {
  defaultSetup();

  // Add setup here
  var msg = "Hi, I'm Chris, & this is a portfolio of some of the interactive P5JS work I have done.";
  chars = split(msg, "");
  textFont('Roboto');
  textStyle(BOLD);

  frictionVal = 0.9;
  gVal = 0.4;

  // Setup controls
  if (!ranOnce) {
    frictionSlider = createSlider(0, 100, 15);
    frictionSlider.parent("box1");

    gravitySlider = createSlider(0, 100, 40);
    gravitySlider.parent("box2");

    goBtn = createButton("");
    goBtn.id("playButton");
    goBtn.parent("buttonBox");
    goBtn.mousePressed(setup);
  }

  stroke(0);
  strokeWeight(0);
  textAlign(CENTER);

  // Create all the char objects
  var vertWidth = 0;
  let startPnt = 0.1;
  charObjs = [];
  chars.forEach(function(char, i){
    // Set vertical height depending on char number
    let vertHeight = 0;
    if (i <= 3){
      vertHeight = 0.15;
    } else if (i > 3 && i <= 14){
      vertHeight = 0.30;
    } else if (i > 14 && i <= 39){
      vertHeight = 0.45;
    } else if (i > 39 && i <= 63){
      vertHeight = 0.60;
    }else {
      vertHeight = 0.75;
    }

    // Make each line start at same point
    if (i == 0){
      vertWidth = startPnt;
    } else if (i == 4){
      vertWidth = startPnt;
    } else if (i == 15) {
      vertWidth = startPnt;
    } else if (i == 40) {
      vertWidth = startPnt;
    } else if (i == 64) {
      vertWidth = startPnt;
    } else {
      // Spacing between letters
      vertWidth += 0.036;
    }

      // Random color
      let col;
      var x = floor(random(1,4));
      if (x == 1){
        col = brightAccent;
      }else if (x == 2){
        col = redCol;
      }else if (x == 3){
        col = darkAccent;
      }

    charObjs.push(
      new CharObj(char, 
      random(),
      random(), 
      random(0,0.1), 
      random(0,0.1), 
      vertWidth, 
      vertHeight,
      col
      ));
  });

  ranOnce = true;
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    background(255, 255, 255); 
    textSize(height*0.1);

    // Update window bounds
    windowBounds = ctrlWindow.getBoundingClientRect();
    grabberBounds = grabber.getBoundingClientRect();

    // Make sure window is visible
    ctrlWindow.style.display = "block";

    // Is mouse over object
    if (
      mouseX > windowBounds.left-cnv.position().x 
      && mouseX < windowBounds.right-cnv.position().x
      && mouseY > windowBounds.top-cnv.position().y
      && mouseY < windowBounds.bottom-cnv.position().y) {
      ctrlWindow.style.opacity = "1";
      ctrlWindow.style.filter = "drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.7)";
    } else {
      ctrlWindow.style.opacity = "0.5";
      ctrlWindow.style.filter = "blur(1px) ";
    }

    // Adjust location if being dragged
    if (dragging) {
      // Set bounds to screen width and height
      if ((mouseX + offsetX) < 0){
        ctrlWindow.style.left = "0px";
      } else if (mouseX + offsetX + ctrlWindowWidth > windowWidth) {
        ctrlWindow.style.left = (windowWidth - ctrlWindowWidth) + "px";
      } else {
        ctrlWindow.style.left = mouseX + offsetX + "px";
      }

      if (mouseY + offsetY < headerH){
        ctrlWindow.style.top = headerH + "px";
      } else if (mouseY + offsetY + ctrlWindowHeight > windowHeight - footerH){
        ctrlWindow.style.top = (windowHeight - ctrlWindowHeight - footerH) + "px";
      } else {
        ctrlWindow.style.top = mouseY + offsetY + "px";
      }
    }

    // Reset window if out of bounds
    if(parseInt(ctrlWindow.style.left, 10) > windowWidth - ctrlWindowWidth){
      ctrlWindow.style.left = windowWidth - ctrlWindowWidth + "px";
    }
    if(parseInt(ctrlWindow.style.top, 10) > windowHeight - ctrlWindowHeight - footerH){
      ctrlWindow.style.top = windowHeight - ctrlWindowHeight - footerH + "px";
    }

    gVal = gravitySlider.value()/100;
    frictionVal = 1-(frictionSlider.value()/100);

    charObjs.forEach(function(char, i){
      fill(char.getCol());
      char.move();
      char.display();
    });

  }
}

