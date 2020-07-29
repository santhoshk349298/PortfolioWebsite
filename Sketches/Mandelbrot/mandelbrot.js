let header;
let footer;
let cnv;
let tooSmall;
let aspectRatioTop;
let aspectRatioBottom

// Colors
let black;
let white;
let lightGrey;
let redCol;
let darkAccent;
let lightAccent;
let brightAccent;

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
  let canvH = windowHeight - headerH - footerH - 30 - topMenu.clientHeight;
  let canvW = windowWidth;
  let calcW = canvH*(aspectRatioTop/aspectRatioBottom);

  // Maintain 16:9 ratio based off height
  if (calcW > canvW){
    // Width is limiting factor
    canvH = canvW/(aspectRatioTop/aspectRatioBottom);
  } else {
    // Height is limiting factor
    canvW = canvH*(aspectRatioTop/aspectRatioBottom);
  }

  // Set the "too small" flag
  if (canvW < 100){
    tooSmall = true;
  } else {
    tooSmall = false;
  }

  resizeCanvas(canvW, canvH);

  let x = (windowWidth - canvW)/2;
  cnv.position(x, headerH+topMenu.clientHeight);

  topMenu.style.width = width+"px";

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

let img; // The picture being rendered

let centerI; // The i coordinate of the center of the screen
let centerR; // The r coordinate of the center of the screen
let graphHeight; // The height of the graph currently
let graphWidth; // The width of the graph currently

let clickPoint; // The point where screen is clicked for dragging
let dragged = false; // Is the screen being dragged?

let iterations = 20; // The default number of iterations per pixel

let sizeFactor = 0.4; // Default quality of the image

let rBtnW = 80;
let rBtnH = 50;
let cBtnH = 60;

let movingQuality = 0.1; // The render quality while moving

// Is the control cooldown activated
// While it is activate only render at movingQuality to reduce lag
let controlCooldown = false; 
let cooldownTime = 1000; // The cooldown time in ms
let cooldownTimer; // The timer object

// The randomized color weights
let rWeight;
let gWeight;
let bWeight;

// UI
let projectsMenu;
let topMenu;
let saveBtn;
let resetBtn;
let colBtn;
let zoomTxt;
let loadTxt;
let loadBarElem;
let loadPercent = 0;
let qualitySlider;
let qualityTxt;
let currentQuality = 30;
let sliderBoxW = 500;
let sliderBoxH = 50;

// Check if a button was pressed
let buttonPressed = false;

let isFullQuality;

// The async intervals (for full renders)
let intervals = [];

function setup() {
  // The UI
  projectsMenu = document.getElementById("projectsMenu");

  topMenu = document.getElementById("topControlsBar");

  resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", function() {
    resetMandelbrot();
    draw();
  });

  colBtn = document.getElementById("colBtn");
  colBtn.addEventListener("click", function() {
    randomizeColor();
    draw();
  });

  saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", saveImage);

  zoomTxt = document.getElementById("zoom");

  loadTxt = document.getElementById("loadText");

  loadBarElem = document.getElementById("myBar");

  qualityTxt = document.getElementById("qualityTxt");

  qualitySlider = document.getElementById("qualitySlider");
  qualitySlider.addEventListener("input", function() {
    if (qualitySlider.value == 1) {
      // Low
      currentQuality = 10;
      qualityTxt.innerText = "Quality: Low";
    } else if (qualitySlider.value == 2) {
      // Medium
      currentQuality = 40;
      qualityTxt.innerText = "Quality: Medium";
    } else if (qualitySlider.value == 3) {
      // High
      currentQuality = 75;
      qualityTxt.innerText = "Quality: High";
    } else if (qualitySlider.value == 4) {
      // Max
      currentQuality = 100;
      qualityTxt.innerText = "Quality: Max";
    }
  });
  qualitySlider.addEventListener("change", function() {
    setQuality();
  });

  defaultSetup();
  noLoop();

  centerR = -0.5;
  centerI = 0;
  graphHeight = aspectRatioBottom;
  graphWidth = aspectRatioTop;

  // Initialize the random color weights
  randomizeColor();
  buttonPressed = false;
}

function setQuality() {
  sizeFactor = currentQuality/100;
  redraw();
}

function saveImage() {
  buttonPressed = true;
  img.save("mandelbrot", "png");
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
  loadBarElem.style.display = "none";
  loadTxt.innerText = "Moving...";
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
      renderCooldown();
      redraw();
    }
  }
}

function drawUI() {
  strokeWeight(3);
  stroke(white);
  // The length of the crosshairs
  let cLength = width/100;
  blendMode(EXCLUSION);
  // Vertical line
  line(width/2, (height/2)-cLength, width/2, (height/2)+cLength);
  // Horizontal line
  line((width/2)-cLength, height/2, (width/2)+cLength, height/2);

  // Text
  strokeWeight(0);
  fill(white);
  textAlign(LEFT);
  textSize(height/35);

  // Center Coord
  push();
  translate(width/2, height/2);
  textAlign(LEFT);
  text(centerR.toFixed(2) + " + " + centerI.toFixed(2) + "i", width/120, -height/100);
  pop();
  blendMode(BLEND);

  // Zoom Level
  zoomNum = expo(graphWidth/aspectRatioTop, 3)+"";
  zoomNum = zoomNum.split("e");
  zoomTxt.innerHTML = "Zoom:<br>"+zoomNum[0]+" x 10<sup>"+zoomNum[1]+"</sup>";
}

function expo(x, f) {
  return Number.parseFloat(x).toExponential(f);
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

function calculateDrawing(r, i, rMax, iMax) {
  let rPos = map(r, 0, rMax, 
    centerR-(graphWidth/2), centerR+(graphWidth/2));
  let iPos = map(i, 0, iMax, 
    centerI+(graphHeight/2), centerI-(graphHeight/2));
  
  let col;
  let colVal = drawMandelbrot(rPos, iPos);

  let rCol = Math.floor(Math.sin(Math.PI * rWeight * colVal) * 255);
  let gCol = Math.floor(Math.sin(Math.PI * gWeight * colVal) * 255);
  let bCol = Math.floor(Math.sin(Math.PI * bWeight * colVal) * 255);

  if (colVal == 1) {
    col = color(0, 0, 0);
  } else {
    col = color(rCol, gCol, bCol);
  }

  img.set(r, i, col);
}

function showDrawing() {
  document.body.style.cursor = 'default';

  if (isFullQuality) {
    loadTxt.innerText = "Render Complete";
    loadBarElem.style.display = "none";

    // Stop any current full renders
    for (let i = 0; i < intervals.length; i++) {
      clearInterval(intervals[i]);
    }
    intervals = [];
  }

  imageMode(CORNERS);
  img.updatePixels();
  image(img, -15, 0, width, height);

  drawUI();
}

function draw() {
  if (tooSmall) {
    tooSmallError();
  } else {
    // Low quality if moving, else chosen quality
    if (controlCooldown) {
      isFullQuality = false;
      sizeFactor = movingQuality;
    } else {
      // Starts a full quality render
      // Stop any current full renders
      for (let i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
      }
      intervals = [];

      loadBarElem.style.display = "block";
      loadBarElem.style.width = 0+"%";
      loadTxt.innerText = "Loading: "+0+"%";
      isFullQuality = true;
      sizeFactor = currentQuality/100;
    }

    let rMax = floor(width*sizeFactor);
    let iMax = floor(height*sizeFactor);
    img = createImage(rMax, iMax);
    img.loadPixels();
    colorMode(RGB, 255);

    document.body.style.cursor = 'wait';
    for (let r = 0; r < rMax; r++) {
      if (isFullQuality) {
        // Render asynchronously
        let i = 0;
        intervals.push(setInterval(function() {
          let intervalNum = intervals.length;
          if (i < iMax) {
            calculateDrawing(r, i, rMax, iMax);
            // Update the loading bar
            if (loadPercent >= 100) {
              loadPercent = 0;
            } else {
              pxVal = i*rMax + r;
              loadPercent = (100*pxVal/(rMax*iMax)).toFixed(0);
              if (loadPercent%10 == 0) {
                loadBarElem.style.width = loadPercent + "%";
                loadTxt.innerText = "Loading: "+loadPercent+"%";
              }
            }
          } else {
            // Render the drawing if all pixels have been calculated
            if (r == rMax-1) {
              showDrawing();
            }
  
            // Stop loop
            clearInterval(intervals[intervalNum]);
          }
          i++;
        }, 0));
      } else {
        // Render synchronously
        for (i = 0; i < iMax; i++) {
          calculateDrawing(r, i, rMax, iMax);
        }
      }
    }
    if (!isFullQuality) {
      showDrawing();
    }
  }
}