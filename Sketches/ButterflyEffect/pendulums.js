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

  // Maintain 16:9 ratio based off height
  if (calcW > canvW){
    // Width is limiting factor
    canvH = canvW/(aspectRatioTop/aspectRatioBottom);
  } else {
    // Height is limiting factor
    canvW = canvH*(aspectRatioTop/aspectRatioBottom);
  }

  // Set the "too small" flag
  if (canvW < 400){
    tooSmall = true;
  } else {
    tooSmall = false;
  }

  resizeCanvas(canvW, canvH);
  path.resizeCanvas(canvW, canvH);

  var x = (windowWidth - canvW)/2;
  cnv.position(x, headerH+10);

  background(0);
  setSizeDependentVars();
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

var path;
var ballR;
var pivR;

var p1;

var showPendulum = false;
var showPBtn;
var runBtn;
var flipGBtn;

var penNumCtrl;

var centerPnt;


function setSizeDependentVars() {
  ballR = height/200;
  pivR = height/40;
  g = -height/1000;
}

class Pendulum {
  constructor(b1, b2) {
    this.b1 = b1;
    this.b2 = b2;
  }

  show() {
    this.b1.show();
    this.b2.show();
  }

  getB1(){return this.b1;}
  getB2(){return this.b2;}
}

class Ball {
  constructor(px, py, L, a, r, m, first, id) {
    this.px = px;                         // X of line start
    this.py = py;                         // Y of line start
    this.m = m;
    this.r = floor(r);                           // Radius
    this.L = map(L, 0, 100, 0, height);   // Length of the pendulum
    this.angle = a;                       // The angle of line
    this.angle_v = 0;                     // Angle velocity
    this.angle_a = 0;
    this.getXY();
    this.prevX = null;
    this.prevY = null;
    // This is true if it is the first link
    this.first = first;  
    this.id = id; // Corresponds with pendulum number

    this.hue = 100;    
  }

  getXY() {
    this.x = this.px + this.L*sin(this.angle);
    this.y = this.py - this.L*cos(this.angle);
  }

  show() {
    if (!this.first) {
      // Calculate new px, py based on previous link position
      this.px = pendulums[this.id].getB1().getX();
      this.py = pendulums[this.id].getB1().getY();
    }
    this.getXY();
  
    if (showPendulum) {
      stroke(255);
      strokeWeight(3);
      line(this.px, this.py, this.x, this.y);
  
      fill(0, 100, 100);
      strokeWeight(2);
      ellipse(this.x, this.y, this.r, this.r);
    }

    if (!this.first){
      path.strokeWeight(this.r*2);
      this.hue += 0.5;
      path.colorMode(HSL, 100);
      path.stroke((this.hue%100), 100, 60);
      if (this.prevX != null) {
        path.line(this.prevX, this.prevY, this.x, this.y);
      }
    }

    this.prevX = this.x;
    this.prevY = this.y;
  }

  getX() {return this.x;}
  getY() {return this.y;}
  getM() {return this.m;}
  getA() {return this.angle;}
  getA_V() {return this.angle_v;}
  getA_A() {return this.angle_a;}
  getL() {return this.L;}
  setA(a) {this.angle = a;}
  setA_V(a) {this.angle_v = a;}
  setA_A(a) {this.angle_a = a;}
}

var pendulums;
var googleFont;
var ctrlBox;
var m1Ctrl;
var m2Ctrl;
var gCtrl
var m1Txt;
var m2Txt;
var gTxt;

var needsToRun = true;

function setup() {
  path = createGraphics(width, height);
  ctrlBox = document.getElementById("ctrlBox");
  
  defaultSetup();

  m1Ctrl = document.getElementById("m1");
  m1.value = 2;
  m2Ctrl = document.getElementById("m2");
  m2.value = 2;
  gCtrl = document.getElementById("gStrength");
  gCtrl.value = 75;
  m1Txt = document.getElementById("m1Txt");
  m2Txt = document.getElementById("m2Txt");
  gTxt = document.getElementById("gTxt");
  showPBtn = createCheckbox("Show Pendulums", false);
  runBtn = createButton("Run!");
  penNumCtrl = createSlider(1, 100, 10);
  drawUI();

  remakePendulums();
}

function drawUI() {
  showPBtn.changed(togglePendulum);
  showPBtn.position(cnv.position().x, cnv.position().y);
  showPBtn.class("checkbox");

  runBtn.mousePressed(remakePendulums);
  runBtn.position(cnv.position().x, cnv.position().y+40);
  runBtn.class("button");
  
  if (needsToRun) {
    textSize(15);
    fill(200);
    text("⬅️ Run to see changes", 70, 65);
  }

  penNumCtrl.position(cnv.position().x+width-200, cnv.position().y+40);
  penNumCtrl.style("width", "200px");
  penNumCtrl.class("slider");
  penNumCtrl.input(setRunLabel);

  textSize(19);
  fill(255);
  text("# of Pendulums: "+penNumCtrl.value(), width-200, 30);

  ctrlBox.style.width = width+"px";

  m1Txt.innerHTML = "Mass 1:&ensp;&ensp;"+m1Ctrl.value;
  m2Txt.innerHTML = "Mass 2:&ensp;&ensp;"+m2Ctrl.value;
  gTxt.innerHTML = "Strength of Gravity: "+gCtrl.value;
}

function setRunLabel() {
  needsToRun = true;
}

function remakePendulums() {
  needsToRun = false;
  path.background('rgb(0, 0, 0)');
  pendulums = [];
  let seedPnt;
  let left = random();
  let m1 = m1Ctrl.value;
  let m2 = m2Ctrl.value;
  if (left > 0.5) {
    seedPnt = random(3*PI/2, 2*PI);
  } else {
    seedPnt = random(0, PI/2);
  }  
  for (let i = 0; i < penNumCtrl.value(); i++) {
    let b1 = new Ball(0, 0, 20, seedPnt, ballR, (height/1000)*(m1/6), true, i);
    let b2 = new Ball(b1.getX(), b1.getY(), 20, i/300, ballR, (height/1000)*(m2/6), false, i);
    p = new Pendulum(b1, b2);
    pendulums.push(p);
  }
}

function togglePendulum() {
  if (this.checked()) {
    showPendulum = true;
  } else {
    showPendulum = false;
  }
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    push();
    background(0);
    centerPnt = createVector(width/2, height/2.2);

    g = -gCtrl.value/100;

    // Draw the path (1 frame delay)
    image(path, 0, 0);
    
    translate(centerPnt.x, centerPnt.y);
    path.push();
    path.translate(centerPnt.x, centerPnt.y);
    path.blendMode(DARKEST);
    path.background('rgba(0, 0, 0, 0.01)');
    path.blendMode(BLEND);

    let friction = 0.9;
    for (let i = 0; i < pendulums.length; i++) {
      let num1 = -g*(2*pendulums[i].getB1().getM() + pendulums[i].getB2().getM())*sin(pendulums[i].getB1().getA());
      let num2 = -pendulums[i].getB2().getM()*g*sin(pendulums[i].getB1().getA()-2*pendulums[i].getB2().getA());
      let num3 = 2*sin(pendulums[i].getB1().getA()-pendulums[i].getB2().getA())*pendulums[i].getB2().getM();
      let num4 = pendulums[i].getB2().getA_V()*pendulums[i].getB2().getA_V()*pendulums[i].getB2().getL()+pendulums[i].getB1().getA_V()*pendulums[i].getB1().getA_V()*pendulums[i].getB1().getL()*cos(pendulums[i].getB1().getA()-pendulums[i].getB2().getA());
      let num = num1 + num2 - (num3*num4);
      let den = pendulums[i].getB1().getL()*(2*pendulums[i].getB1().getM()+pendulums[i].getB2().getM()-pendulums[i].getB2().getM()*cos(2*pendulums[i].getB1().getA()-2*pendulums[i].getB2().getA()));
      pendulums[i].getB1().setA_A((num / den)*friction);

      num1 = 2*sin(pendulums[i].getB1().getA()-pendulums[i].getB2().getA());
      num2 = pendulums[i].getB1().getA_V()*pendulums[i].getB1().getA_V()*pendulums[i].getB1().getL()*(pendulums[i].getB1().getM()+pendulums[i].getB2().getM());
      num3 = g*(pendulums[i].getB1().getM()+pendulums[i].getB2().getM())*cos(pendulums[i].getB1().getA());
      num4 = pendulums[i].getB2().getA_V()*pendulums[i].getB2().getA_V()*pendulums[i].getB2().getL()*pendulums[i].getB2().getM()*cos(pendulums[i].getB1().getA()-pendulums[i].getB2().getA());
      num = num1*(num2 + num3 + num4);
      den = pendulums[i].getB2().getL()*(2*pendulums[i].getB1().getM()+pendulums[i].getB2().getM()-pendulums[i].getB2().getM()*cos(2*pendulums[i].getB1().getA()-2*pendulums[i].getB2().getA()));
      pendulums[i].getB2().setA_A((num / den)*friction);
  
      pendulums[i].getB1().setA_V(pendulums[i].getB1().getA_V() + pendulums[i].getB1().getA_A());
      pendulums[i].getB2().setA_V(pendulums[i].getB2().getA_V() + pendulums[i].getB2().getA_A());
      
      pendulums[i].getB1().setA(pendulums[i].getB1().getA() + pendulums[i].getB1().getA_V());
      pendulums[i].getB2().setA(pendulums[i].getB2().getA() + pendulums[i].getB2().getA_V());

      pendulums[i].show();
    }

    path.pop();
    
    // Draw the pivot pnt
    if (showPendulum) {
      fill(255, 0, 0);
      strokeWeight(0);
      ellipse(0, 0, pivR, pivR);
    }
    pop();

    drawUI();
  }
}