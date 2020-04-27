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

  if(typeof chars != 'undefined'){
    //drawLettersRandom(chars);
  }
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

var chars;
var charObjs;
var testObj;

class CharObj {
  constructor(char, x, y, velX, velY, pntX, pntY){
    this.char = char;
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.pntX = pntX;
    this.pntY = pntY;
  }

  move() {
    // Calculates the x and y distance to the attractor point
    let xDist = this.x - this.pntX;
    let yDist = this.y - this.pntY;
    let dist = createVector(xDist, yDist);

    dist = dist.mult((1-dist.mag())*0.15);

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
    this.velX = this.velX*0.9;
    this.velY = this.velY*0.9;
  }

  display() {
    text(this.char, this.x*width, this.y*height);
  }
}

function setup() {
  defaultSetup();

  // Add setup here
  var msg = "Hi, I'm Chris, & this is a portfolio of some of the interactive P5JS work I have done.";
  chars = split(msg, "");
  textFont('Roboto');
  textStyle(BOLD);
  //drawLettersRandom(chars);

  stroke(0);
  strokeWeight(0);
  textSize(20);
  textAlign(CENTER);

  // Create all the char objects
  charObjs = [];
  chars.forEach(function(char, i){
    charObjs.push(
      new CharObj(char, 
      random(),
      random(), 
      random(0,0.1), 
      random(0,0.1), 
      (((i+1)*0.8)/chars.length)+0.1, 
      abs(sin(i))
      ));
  });
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    background(white); 

    fill(darkAccent);
    charObjs.forEach(function(char, i){
      char.move();
      char.display();
    });

  }
}

function drawLettersRandom(chars){
  clear();

  stroke(0);
  strokeWeight(0);
  textSize(40);
  textAlign(CENTER);
  chars.forEach(function(char, i){
    var x = floor(random(1,4));
    if (x == 1){
      fill(brightAccent);
    }else if (x == 2){
      fill(redCol);
    }else if (x == 3){
      fill(darkAccent);
    }

    text(char, random(0,width), random(0,height));
  });
}

