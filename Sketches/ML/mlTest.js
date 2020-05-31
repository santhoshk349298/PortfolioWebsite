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

var mobilenet;
var img;
var imgDir = "Sketches/ML/Images/";
var madePrediction = false;
var label = "";

var imgName = "Banana.jpg";

function modelReady() {
  print("Model is ready!!");
  mobilenet.predict(img, gotResults);
}

function gotResults(error, data) {
  if (error) {
    print("Problem Predicting: " + error);
  } else {
    console.log(data);
    label = data[0].label;
    madePrediction = true;
  }
}

function preload() {
  mobilenet = ml5.imageClassifier("MobileNet", modelReady);
}

function setup() {
  defaultSetup();

  img = createImg(imgDir + imgName, "");
  img.hide(); 
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    background(255);
    fill(0);
    strokeWeight(4);
    stroke(255);
    textSize(height/10);

    push();
    // Draw the image
    translate(width/2, height/2);
    imageMode(CENTER);
    image(img, 0, 0);
    pop();

    // Show the prediction
    if (madePrediction) {
      text(label, (width/100), height - (height/25));
    } else {
      text("Loading prediction...", (width/100), height - (height/25));
    }
    debugOutline();
  }
}