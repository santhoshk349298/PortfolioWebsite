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
  var canvW = windowWidth-10;

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

let fontFamily;
let roboto;
function preload() {
  fontFamily = loadFont('Sketches/WelcomeScreen/BERNHC.TTF');
  roboto = 'Roboto';
}

let jsonFile;
let langKeys;
function setup() {
  defaultSetup();
  noLoop();
  //frameRate(1);

  langKeys = Object.keys(helloDict);
}

function randomKey(items) { 
  return items[Math.floor(Math.random()*items.length)];    
}

function drawText() {
  textFont(roboto);
  textSize(height/15);
  strokeWeight(0);
  colorMode(RGB); 
  textAlign(LEFT);
  stroke(0);
  fill(150); 

  let colOffset = 0;
  let lineHeight = textAscent()*1.25;
  let txtY = 0;
  while (txtY < height - lineHeight) {
    let line = "";
    while (true) {
      let newHello = helloDict[randomKey(langKeys)]+" • ";
      if (textWidth(line) + textWidth(newHello) >= width) {
        // remove the last symbol
        line = line.substring(0, line.length - 3);
        break;
      } else {
        line += newHello;
      }
    }
    let txtX = (width-textWidth(line))/2;
    txtY += lineHeight;
    colorMode(HSB, 100); 
    fill(colOffset%100, 60, 75);
    text(line, txtX, txtY);
    colOffset += 1;
  }
  
  colorMode(RGB); 
  textFont(fontFamily);
  textSize(width/6);
  if (width/6 > height/5) {
    textSize(height/5);
  } 
  stroke(255);
  strokeWeight(30);
  fill(0); 
  textAlign(CENTER);
  text("Hello", width/2, height/2);
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    clear();
    drawText();
    
    //debugOutline();
  }
}