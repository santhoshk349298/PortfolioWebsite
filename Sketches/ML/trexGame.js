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

  if (player != null) {
    player.setY(height-floorHeight-pSize);
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

var floorHeight;
var gForce;
var isJumping = false;
var jumpForce;

var obstacles; // The list of obstacles (currently on screen)
var oH;
var oW;

var pSize;
var pXPos;

var sideSpeed; // This increases as the game goes on
var coin;


var img;

class Player {
  constructor() {
    this.y = height-floorHeight;
    this.v = 0; // The vertical velocity
  }

  gravity() {
    // The force of gravity
    if (this.y >= height-floorHeight-(pSize/2)) {
      // Already on the ground
      this.y = height-floorHeight-(pSize/2);
      this.v = 0;
    } else {
      // There is room to fall
      this.y += this.v;  
      this.v += gForce;
    }
  }

  setY(newY) {
    this.y = newY;
  }

  jump() {
    // Only jump if on ground
    if (this.y == height-floorHeight-(pSize/2)) {
      this.v -= jumpForce;
      this.y += this.v;
    }
  }

  draw() {
    fill(brightAccent);
    this.gravity();
    if (isJumping){
      this.jump();
    }
    image(img, pXPos, this.y, pSize, pSize);
  }
}

function keyPressed() {
  if (keyCode == "32" || keyCode === UP_ARROW) {
    isJumping = true;
  }
}

function keyReleased() {
  if (keyCode == "32" || keyCode === UP_ARROW) {
    isJumping = false;
  }
}

class Obstacle {
  constructor(r, dir) {
    this.rot = r;
    this.dir = dir;
    if (this.dir == "L") {
      this.x = width;
    } else if (this.rot == "V"){
      this.x = -oW;
    } else {
      this.x = -500;
    }
  }

  draw() {
    fill(redCol);
    if (this.dir == "L") {
      this.x -= sideSpeed;
    } else {
      this.x += sideSpeed;
    }
    this.y = height-floorHeight-oH;
    if (this.rot == "V") {
      this.w = oW;
      this.h = oH;
    } else {
      this.w = oH*3;
      this.h = oW;
    }
    rect(this.x, this.y, this.w, this.h);

  }
}

var player;
var obstacleTimer= setInterval(newObstacle, 3000);

function setup() {
  defaultSetup();

  frameRate(30);

  calculateSizes();
  player = new Player();
  obstacles = [];
  img = loadImage("Sketches/ML/Images/mario.png");
}

function newObstacle() {
  let rotation = random(["V", "H"]);
  let direction = random(["L", "R"]);
  obstacles.push(new Obstacle(rotation, direction));
}

function calculateSizes() {
  // Calculate sizes relative to screen size
  pSize = height/10;
  pXPos = width/2;
  floorHeight = height/5;
  jumpForce = height/7;
  gForce = height/40;
  oH = height/5;
  oW = height/12;
  sideSpeed = width/50;
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    calculateSizes();
    background(255);
    strokeWeight(0);
    
    imageMode(CENTER);


    fill(lightAccent);
    strokeWeight(2);
    stroke(0);
    ellipse(width/2, height/2, 40, 40);

    player.draw();

    
    // Draw the obstacles
    for(let i = 0; i < obstacles.length; i++) {
      obstacles[i].draw();
    }
    // Remove all obstacles over 10
    while(obstacles.length > 10) {
      obstacles.shift();
    }

    // Draw the floor
    fill(darkAccent);
    strokeWeight(0);
    rect(0, height-floorHeight, width, floorHeight);
    debugOutline();
  }
}