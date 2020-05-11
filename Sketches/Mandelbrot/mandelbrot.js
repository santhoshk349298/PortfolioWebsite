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

  // 3:2 aspect ratio (for simplicity)
  aspectRatioTop = 3;
  aspectRatioBottom = 2;
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

  redraw();
}

function debugOutline() {
  stroke(darkAccent);
  strokeWeight(8);
  noFill();
  rect(0, 0, width, height);
}

function tooSmallError(){
  push();
  background(255);
  textSize(32);
  strokeWeight(0);
  translate(width/2, height/2);
  textAlign(CENTER);
  fill(brightAccent);
  text("Window too small!", 0, -20);
  fill(black);
  text("Please increase window size.", 0, 20);
  pop();
}

/*---------------START----------------*/

var img; // The picture being rendered

var centerI; // The i coordinate of the center of the screen
var centerR; // The r coordinate of the center of the screen
var graphHeight; // The height of the graph currently
var graphWidth; // The width of the graph currently

var clickPoint; // The point where screen is clicked for dragging
var dragged = false; // Is the screen being dragged?

var iterations = 20; // The default number of iterations per pixel

var sizeFactor = 0.4; // Default quality of the image

var resetBtn; // Reset the position and zoom of the Mandelbrot
var rBtnW = 80;
var rBtnH = 50;
var cBtnH = 60;

var saveBtn; // The button to save an image

var qualitySlider;
var sliderBoxW = 500;
var sliderBoxH = 50;
var starterQuality = 0.1; // The starter quality (for each set of renders)

// Is the control cooldown activated
// While it is activate only render at starterQuality to reduce lag
var controlCooldown = false; 
var cooldownTime = 1000; // The cooldown time in ms
var cooldownTimer; // The timer object

// The randomized color weights
var rWeight;
var gWeight;
var bWeight;

var projectsMenu;

// Check if a button was pressed
var buttonPressed = false;

function setup() {
  defaultSetup();
  noLoop();

  projectsMenu = document.getElementById("projectsMenu");

  centerR = -0.5;
  centerI = 0;
  graphHeight = aspectRatioBottom;
  graphWidth = aspectRatioTop;

  resetBtn = createButton("reset");
  resetBtn.class("button");
  resetBtn.size(rBtnW, rBtnH);
  resetBtn.mousePressed(resetMandelbrot);

  colBtn = createButton("random color");
  colBtn.class("button");
  colBtn.size(rBtnW, cBtnH);
  colBtn.mousePressed(randomizeColor);

  saveBtn = createButton("save image");
  saveBtn.class("button");
  saveBtn.size(rBtnW, cBtnH);
  saveBtn.mousePressed(saveImage);

  qualitySlider = createSlider(1, 100, sizeFactor*100);
  qualitySlider.parent("sliderArea");
  qualitySlider.mouseReleased(setQuality);

  // Initialize the random color weights
  randomizeColor();
  buttonPressed = false;
}

function setQuality() {
  sizeFactor = qualitySlider.value()/100;
  redraw();
}

function saveImage() {
  img.save("mandelbrot", "png");
  buttonPressed = true;
}

function randomizeColor() {
  rWeight = round(random(1, 5));
  let isSame = true;
  while (isSame) {
    gWeight = round(random(1, 5));
    if (gWeight != rWeight) {
      isSame = false;
    }
  }
  isSame = true;
  while(isSame) {
    bWeight = round(random(1, 5));
    if (bWeight != gWeight && bWeight != rWeight) {
      isSame = false;
    }
  }

  buttonPressed = true;
}

function renderCooldown() {
  if (!buttonPressed) {
    clearTimeout(cooldownTimer);
    controlCooldown = true;
    cooldownTimer = setTimeout(deactivateCooldown, cooldownTime);
  } else {
    buttonPressed = false;
    redraw();
  }
}

function deactivateCooldown() {
  controlCooldown = false;
  redraw();
}

function resetMandelbrot() {
  graphHeight = aspectRatioBottom;
  graphWidth = aspectRatioTop;

  centerR = -0.5;
  centerI = 0;

  buttonPressed = true;
}

function mousePressed() {
  if (
    ((mouseX > 0) &&
    (mouseX < width) &&
    (mouseY > 0) &&
    (mouseY < height)) &&
    !((mouseX > width/2 - sliderBoxW/2) &&
    (mouseX < width/2 + sliderBoxW/2) &&
    (mouseY > 0) &&
    (mouseY < sliderBoxH)) &&
    projectsMenu.style.display == "none") 
  {
    dragged = true;
    clickPoint = createVector(mouseX, mouseY);
  } else {
    dragged = false;
  }
}

function mouseReleased() {
  if (dragged) {
    line(clickPoint.x, clickPoint.y, mouseX, mouseY);

    // Get the drag in the x and y directions
    let xDrag = (mouseX - clickPoint.x)/width;
    let yDrag = (mouseY - clickPoint.y)/height;
    // Bound the drag to the screen
    if (xDrag > 1) {
      xDrag = 1;
    } else if (xDrag < -1) {
      xDrag = -1;
    }
    if (yDrag > 1) {
      yDrag = 1;
    } else if (yDrag < -1) {
      yDrag = -1;
    }
    // Adjust drag size to graph zoom
    xDrag = -xDrag*graphWidth;
    yDrag = yDrag*graphHeight;
  
    // Update the center coordinate
    centerR += xDrag;
    centerI += yDrag;

    // Redraw the screen
    sizeFactor = starterQuality; // Reset quality
    renderCooldown();
    redraw();
  }
  dragged = false;
}

function mouseWheel(event) {
  if (
    (mouseX > 0) &&
    (mouseX < width) &&
    (mouseY > 0) &&
    (mouseY < height) &&
    projectsMenu.style.display == "none") 
    {
    // Zoom on scroll
    let zoomIn;
    if (event.delta < 0) {
      zoomIn = true;
      iterations += 2;
    } else {
      zoomIn = false;
      iterations -= 2;
    }

    let zoomVal = 1.1; // Higher means more sensitive zoom
    if (zoomIn) {
      graphWidth = graphWidth*(1/zoomVal);
      graphHeight = graphHeight*(1/zoomVal);
    } else {
      graphWidth = graphWidth*zoomVal;
      graphHeight = graphHeight*zoomVal;
    }

    if ((graphWidth/aspectRatioTop) > 1) {
      graphWidth = aspectRatioTop;
      graphHeight = aspectRatioBottom;
      iterations += 4;
    } else {
      // Redraw the screen
      sizeFactor = starterQuality; // Reset quality
      renderCooldown();
      redraw();
    }
  }
}

function drawUI() {
  // Set the button positions
  resetBtn.position(cnv.position().x + width - rBtnW - width/100,
  cnv.position().y + height/100);

  colBtn.position(cnv.position().x + width - rBtnW - width/100,
  cnv.position().y + height - cBtnH - (height/100));
  
  saveBtn.position(cnv.position().x + width/100,
  cnv.position().y + height - cBtnH - (height/100));

  strokeWeight(3);
  stroke(white);
  // The length of the crosshairs
  let cLength = width/50;
  // Vertical line
  line(width/2, (height/2)-cLength, width/2, (height/2)+cLength);
  // Horizontal line
  line((width/2)-cLength, height/2, (width/2)+cLength, height/2);

  // Text
  strokeWeight(2);
  stroke(white);
  fill(black);
  textAlign(LEFT);
  textSize(height/35);
  
  // # of decimal places visible
  let accuracy = 2;

  // Center Coord
  push();
  translate(width/2, height/2);
  textAlign(LEFT);
  text(centerR.toFixed(2) + " + " + centerI.toFixed(2) + "i", width/120, -height/100);
  pop();

  // Zoom Level
  textAlign(LEFT);
  text("Zoom: "+(graphWidth/aspectRatioTop).toFixed(10), width/50, height/20);
}

function drawMandelbrot(cr, ci) {
  let zi = 0;
  let zr = 0;

  let P = 2;
  for (let iter = 0; iter < iterations; iter++){
    let zrtemp = zr;

    zr = zr * zr - zi * zi + cr;
    zi = 2 * zrtemp * zi + ci;
    abs_z = zr * zr + zi * zi;

    if (abs_z > P * P * 10){
      // Number is not part of the set
      // Has smoothing to look better
      return (iter + 1 - (Math.log(Math.log(Math.sqrt(abs_z)) ) ) / Math.log(P)) / iterations; 
    }
  }
  // This value is part of the set
  return 1; 
}

function draw() {
  // Refresh the screen
  clear();
  if (tooSmall) {
    tooSmallError();
  } else {
    // Set the quality of the image render
    if (controlCooldown) {
      sizeFactor = starterQuality;
      noLoop();
    } else {
      if (sizeFactor < qualitySlider.value()/100) {
        loop();
      } else {
        sizeFactor = qualitySlider.value()/100;
        noLoop();
      }
    }

    img = createImage(floor(width*sizeFactor), floor(height*sizeFactor));
    img.loadPixels();
    colorMode(RGB, 255);

    for (let r = 0; r < floor(width*sizeFactor); r++) {
      for (let i = 0; i < floor(height*sizeFactor); i++) {

        let rPos = map(r, 0, floor(width*sizeFactor), 
          centerR-(graphWidth/2), centerR+(graphWidth/2));
        let iPos = map(i, 0, floor(height*sizeFactor), 
          centerI+(graphHeight/2), centerI-(graphHeight/2));
        
        let col;
        let colVal = drawMandelbrot(rPos, iPos);

        var rCol = Math.floor(Math.sin(Math.PI * rWeight * colVal) * 255);
        var gCol = Math.floor(Math.sin(Math.PI * gWeight * colVal) * 255);
        var bCol = Math.floor(Math.sin(Math.PI * bWeight * colVal) * 255);

        if (colVal == 1) {
          col = color(0, 0, 0);
        } else {
          col = color(rCol, gCol, bCol);
        }

        img.set(r, i, col);
      }
    }

    imageMode(CORNERS);
    img.updatePixels();
    image(img, -15, 0, width, height);

    // Increase quality
    sizeFactor += 0.2;

    drawUI();
    debugOutline();
  }
}