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

  // 1:1 aspect ratio
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
  var canvH = windowHeight - headerH - footerH - 30 - topMenu.clientHeight;
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
  if (canvW < 100){
    tooSmall = true;
  } else {
    tooSmall = false;
  }

  resizeCanvas(canvW, canvH);

  let x = (windowWidth - canvW)/2;
  cnv.position(x, headerH+topMenu.clientHeight);

  topMenu.style.width = width+"px";

  // Align alg options with left side of the canvas
  algOptions.style.left = cnv.position().x+"px";
  // Align learnMore with bottom right of the canvas
  learnMore.style.top = cnv.position().y+height-30+"px";
  learnMore.style.left = cnv.position().x+width-110+"px";

  redraw();
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

// UI
let topMenu;
let algOptions;
let learnMore;
let arrow;
let dropdownBox;
let efficiencyBox;
let speedSlider;
let speedText;
let playBtn;
let loadTxt;

// The Circle
let numOfPieces = 100;
let numList;
let center;

let stepTime = 10;

function setup() {
  // UI
  topMenu = document.getElementById("topControlsBar");
  algOptions = document.getElementById("algOptions");
  algOptions.style.display = "none";
  learnMore = document.getElementById("learnMore");
  dropdownBox = document.getElementById("dropdownBox");
  efficiencyBox = document.getElementById("efficiencyBox");
  speedSlider = document.getElementById("speedSlider");
  speedText =  document.getElementById("speedTxt");
  speedSlider.addEventListener("input", function() {
    if (speedSlider.value == 1) {
      speedText.innerHTML = "Sort Speed: Slow";
      stepTime = 50;
    } else  if (speedSlider.value == 2) {
      speedText.innerHTML = "Sort Speed: Medium";
      stepTime = 25;
    } else  if (speedSlider.value == 3) {
      speedText.innerHTML = "Sort Speed: Fast";
      stepTime = 10;
    } else  if (speedSlider.value == 4) {
      speedText.innerHTML = "Sort Speed: Max";
      stepTime = 1;
    }
  });
  arrow = document.getElementById("arrow");
  window.addEventListener("mouseup", function() {
    if (algOptions.style.display != "none" 
      && event.target != algOptions 
      && event.target.parentNode.parentNode.parentNode != algOptions
      && event.target != dropdownBox
      && event.target.parentNode != dropdownBox ) {
      algOptions.style.display = "none";
      arrow.innerHTML = "⮛";
    }
  });
  dropdownBox.addEventListener("click", function(){
    if (algOptions.style.display == "none") {
      algOptions.style.display = "table";
      arrow.innerHTML = "⮙";
    } else { 
      algOptions.style.display = "none";
      arrow.innerHTML = "⮛";
    }
  });
  playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", runNewSort);
  loadTxt = document.getElementById("loadText");

  // Add button functionality
  for (let i = 0; i < algOptions.rows.length; i++) {
    let btn = algOptions.rows[i].cells[0];
    btn.addEventListener("click", function() {
      dropdownBox.innerHTML = btn.innerText+"<div id='arrow'>⮛<div>";
      algOptions.style.display = "none";
      if (btn.innerText == "Insertion Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n^2)\\)";
      } else if (btn.innerText == "Selection Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n^2)\\)";
      } else if (btn.innerText == "Bubble Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n^2)\\)";
      } else if (btn.innerText == "Merge Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n\\log n)\\)";
      } else if (btn.innerText == "Heap Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n\\log n)\\)";
      } else if (btn.innerText == "Quicksort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n^2)\\)";
      } else if (btn.innerText == "LSD Base 10 Radix Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(wn)\\)";
      } else if (btn.innerText == "MSD Base 10 Radix Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(wn)\\)";
      } else if (btn.innerText == "LSD Base 2 Radix Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(wn)\\)";
      } else if (btn.innerText == "MSD Base 2 Radix Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(wn)\\)";
      }
      // Make equations look nice again
      MathJax.typeset();
    });
  }

  defaultSetup();
  noLoop();

  // Add the canvas styling
  cnv.style("box-shadow", "0px 2px 4px 0px rgba(0, 0, 0, 0.3)");

  center = createVector((width/2), (height/2));

  // Initialize the number list
  numList = [];
  for (let i = 0; i < numOfPieces; i++) {
    numList.push(i);
  }

  drawTriangles();
}

function drawTriangles() {
  clear();

  // Draw the triangles
  colorMode(HSB, numOfPieces);
  for (let i = 0; i < numOfPieces; i++) {
    push();
    strokeWeight(0.5);
    stroke(i, 100, 100);
    fill(i, 100, 100);
    let h = map(abs(numList[i]-i), 0, numOfPieces, height/2.3, 1);
    let xPos = h*tan((TWO_PI/numOfPieces)/2);
    translate(center.x, center.y);
    rotate(i*(TWO_PI/numOfPieces));
    triangle(0, 0, -xPos, -h, xPos, -h);
    pop();
  }
  colorMode(RGB);

  // Middle dot
  fill(black);
  strokeWeight(10);
  point(center.x, center.y);
}

function runNewSort() {
  shuffleCircle();
}

// Recursive Fisher-Yates shuffle
// https://bost.ocks.org/mike/shuffle/
function shuffleCircle() {
  let m = numList.length;
  let asyncShuffle = setInterval(function() {
    if (m == 0) {
      loadTxt.innerHTML = "Shuffled";
      clearInterval(asyncShuffle);
    } else {
      loadTxt.innerHTML = "<i>Shuffling...</i>";

      // Pick a remaining element…
      let i = Math.floor(Math.random()*m--);
  
      // And swap it with the current element.
      let t = numList[m];
      numList[m] = numList[i];
      numList[i] = t;
  
      drawTriangles();
    }
  }, stepTime);
}