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

  // Maintain aspect ratio based off height
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
  // Align speaker with bottom left of the canvas
  speaker.style.top = cnv.position().y+height-40+"px";
  speaker.style.left = cnv.position().x+15+"px";

  // Reset center
  center = createVector((width/2), (height/2));
  if (numList != null) {
    drawTriangles(-1);
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

// UI
let topMenu;
let algOptions;
let chosenAlg;
let learnMore;
let arrow;
let dropdownBox;
let efficiencyBox;
let speedSlider;
let speedText;
let playBtn;
let loadTxt;
let speaker;

// The Circle
let numOfPieces = 165; // 150
let numList;
let center;

let asyncIntervals = [];
let asyncTimeouts = [];
let stepTime;

let soundEffect;
let muted = false;

function preload() {
  // Load in sounds
  soundEffect = loadSound("Sketches/SortVisualizer/soundEffect.wav");
}

function speedSliderRun() {
  if (speedSlider.value == 1) {
    speedText.innerHTML = "Sort Speed: Slow";
    stepTime = 90;
  } else  if (speedSlider.value == 2) {
    speedText.innerHTML = "Sort Speed: Medium";
    stepTime = 50;
  } else  if (speedSlider.value == 3) {
    speedText.innerHTML = "Sort Speed: Fast";
    stepTime = 20;
  } else  if (speedSlider.value == 4) {
    speedText.innerHTML = "Sort Speed: Max";
    stepTime = 0;
  }
}

function setup() {
  // UI
  topMenu = document.getElementById("topControlsBar");
  algOptions = document.getElementById("algOptions");
  algOptions.style.display = "none";
  learnMore = document.getElementById("learnMore");
  dropdownBox = document.getElementById("dropdownBox");
  chosenAlg = document.getElementById("chosenAlg");
  efficiencyBox = document.getElementById("efficiencyBox");
  speedSlider = document.getElementById("speedSlider");
  speedText =  document.getElementById("speedTxt");
  speedSliderRun();
  speedSlider.addEventListener("input", speedSliderRun);
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
  playBtn.addEventListener("click", shuffleCircle);
  loadTxt = document.getElementById("loadText");
  speaker = document.getElementsByClassName("speaker")[0];
  speaker.addEventListener("click", function(){
    if (speaker.classList.contains("mute")) {
      muted = false;
      speaker.classList.remove("mute");
    } else {
      muted = true;
      speaker.classList.add("mute");
    }
  });

  // Add button functionality
  for (let i = 0; i < algOptions.rows.length; i++) {
    let btn = algOptions.rows[i].cells[0];
    btn.addEventListener("click", function() {
      chosenAlg.innerText = btn.innerText;
      arrow.innerHTML = "⮛";
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
      // Make equations look nice
      MathJax.typeset();
    });
  }

  defaultSetup();
  noLoop();

  // Add the canvas styling
  cnv.style("box-shadow", "0px 2px 4px 0px rgba(0, 0, 0, 0.3)");

  // Initialize the number list
  numList = [];
  for (let i = 0; i < numOfPieces; i++) {
    numList.push(i);
  }

  drawTriangles(-1);
}

// The update function (redraws the circle/triangle slices)
function drawTriangles(current, circleArray) {
  if (circleArray == undefined) {
    circleArray = numList;
  }
  
  if (current != -1) {
    playSound(current);
  }
  clear();

  // Draw the triangles
  colorMode(HSB, numOfPieces);
  for (let i = 0; i < numOfPieces; i++) {
    push();
    strokeWeight(0.5);
    stroke(circleArray[i], numOfPieces-10, numOfPieces);
    fill(circleArray[i], numOfPieces-10, numOfPieces);
    if (i == current) {
      fill(0, 0, 0);
    }
    let h = map(abs(circleArray[i]-i), 0, numOfPieces, height/2.3, 1);
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

// Recursive asynchronous Fisher-Yates shuffle
// https://bost.ocks.org/mike/shuffle/
function shuffleCircle() {
  clearAllIntervals();
  let m = numList.length;
  asyncIntervals.push(setInterval(function() {
    let intervalNum = asyncIntervals.length;
    if (m == 0) {
      drawTriangles(-1);
      runSort();
      clearInterval(asyncIntervals[intervalNum-1]);
    } else {
      loadTxt.innerHTML = "<i>Shuffling...</i>";

      // Pick a remaining element…
      let i = Math.floor(Math.random()*m--);
  
      // And swap it with the current element.
      let t = numList[m];
      numList[m] = numList[i];
      numList[i] = t;
  
      drawTriangles(-1);    
    }
  }, 0));
}

// Run the sorting algorithm that is selected in the dropdown
function runSort() {
  let sortType = chosenAlg.innerText;

  if (sortType == "Insertion Sort") {
    insertionSort(numList);
  } else if (sortType == "Selection Sort") {
    selectionSort(numList);
  } else if (sortType == "Bubble Sort") {
    bubbleSort(numList);
  } else if (sortType == "Merge Sort") {
    mergeSort(numList);
  } else if (sortType == "Heap Sort") {
    
  } else if (sortType == "Quicksort") {
    
  } else if (sortType == "LSD Base 10 Radix Sort") {
    
  } else if (sortType == "MSD Base 10 Radix Sort") {
    
  } else if (sortType == "LSD Base 2 Radix Sort") {
    
  } else if (sortType == "MSD Base 2 Radix Sort") {
    
  }
}

function clearAllIntervals() {
  while (asyncIntervals.length > 0) {
    clearInterval(asyncIntervals.pop());
  }

  while (asyncTimeouts.length > 0) {
    clearTimeout(asyncTimeouts.pop());
  }
}

function playSound(i) {
  if (!muted) {
    soundEffect.rate(map(i, 0, numList.length, 0.5, 2));
    soundEffect.play();
  }
}

//~~~~ THE SORTING ALGORITHMS ~~~~//

// https://medium.com/dailyjs/insertion-sort-in-javascript-9c077844717a
function insertionSort(nums) {
  let i = 0;
  asyncIntervals.push(setInterval(function() {
    let intervalNum = asyncIntervals.length;
    if (i >= nums.length) {
      drawTriangles(-1);
      loadTxt.innerHTML = "Sorted";
      clearInterval(asyncIntervals[intervalNum-1]);
    } else {
      loadTxt.innerHTML = "<i>Sorting...</i>";

      let j = i - 1;
      let tmp = nums[i];
      while (j >= 0 && nums[j] > tmp) {
        nums[j + 1] = nums[j];
        j--;
      }
      nums[j+1] = tmp;
    
      i++;

      drawTriangles(j);
    }
  }, stepTime));
}

// https://medium.com/javascript-algorithms/javascript-algorithms-selection-sort-54da919d0513
function selectionSort(arr) {
  let i = 0;
  asyncIntervals.push(setInterval(function() {
    let intervalNum = asyncIntervals.length;
    if (i >= arr.length) {
      drawTriangles(-1);
      loadTxt.innerHTML = "Sorted";
      clearInterval(asyncIntervals[intervalNum-1]);
    } else {
      loadTxt.innerHTML = "<i>Sorting...</i>";
    
      let min = i;
      for (let j = i + 1; j < arr.length; j++) {
          if (arr[min] > arr[j]) {
              min = j;
          }
      }
      if (min !== i) {
          let tmp = arr[i];
          arr[i] = arr[min];
          arr[min] = tmp;
      }

      i++;

      drawTriangles(min);
    }
  }, stepTime));
}

// https://medium.com/javascript-algorithms/javascript-algorithms-bubble-sort-3d27f285c3b2
function bubbleSort(inputArr) {
  let i = 0;
  let len = inputArr.length;
  asyncIntervals.push(setInterval(function() {
    let intervalNum = asyncIntervals.length;
    if (i >= inputArr.length) {
      drawTriangles(-1);
      loadTxt.innerHTML = "Sorted";
      clearInterval(asyncIntervals[intervalNum-1]);
    } else {
      loadTxt.innerHTML = "<i>Sorting...</i>";
    
      for (let j = 0; j < len; j++) {
        if (inputArr[j] > inputArr[j + 1]) {
            let tmp = inputArr[j];
            inputArr[j] = inputArr[j + 1];
            inputArr[j + 1] = tmp;
        }
      }

      i++;
      drawTriangles(i);
    }
  }, stepTime));
}

// https://www.geeksforgeeks.org/iterative-merge-sort/
// Iterative (non-recursive) Merge Sort
function mergeSort(arr) {
  // The size of the merge sections
  // Varies from 1 - n/2
  //let currentSize;
  let n = arr.length-1;

  let currentSize = 1;
  asyncIntervals.push(setInterval(function() {
    let intervalNum = asyncIntervals.length;
    if (currentSize > n) {
      // Algorithm complete
      drawTriangles(-1);
      loadTxt.innerHTML = "Sorted";
      clearInterval(asyncIntervals[intervalNum-1]);
    } else {
      loadTxt.innerHTML = "<i>Sorting...</i>";
    
      // Algorithm

      // Pick starting point of different 
      // subarrays of current size 
      for (let left = 0; left < n; left += 2*currentSize) { 
        // Find ending point of left  
        // subarray. mid+1 is starting  
        // point of right 
        let mid = Math.min(left + currentSize - 1, n); 

        let right = Math.min(left + 2*currentSize - 1, n); 

        // Merge Subarrays arr[left...mid] & arr[mid+1...right] 
        merge(arr, left, mid, right); 
      }
      drawTriangles(-1);
      currentSize = 2*currentSize;
    }
  }, stepTime));

  // Merge subarrays in bottom up  
  // manner. First merge subarrays  
  // of size 1 to create sorted  
  // subarrays of size 2, then merge 
  // subarrays of size 2 to create  
  // sorted subarrays of size 4, and so on. 
  /*for (currentSize = 1; currentSize <= n; currentSize = 2*currentSize) { 
    // Pick starting point of different 
    // subarrays of current size 
    for (let left = 0; left < n; left += 2*currentSize) { 
        // Find ending point of left  
        // subarray. mid+1 is starting  
        // point of right 
        let mid = Math.min(left + currentSize - 1, n); 

        let right = Math.min(left + 2*currentSize - 1, n); 

        // Merge Subarrays arr[left...mid] & arr[mid+1...right] 
        merge(arr, left, mid, right); 
    }
  } */
}

// Function to merge the two haves arr[l..m] and 
// arr[m+1..r] of array arr[]
function merge(arr, l, m, r) { 
  let i, j, k;
  let n1 = m - l + 1; 
  let n2 = r - m; 

  // Create temp arrays
  let L = new Array(n1); 
  let R = new Array(n2); 

  // Copy data to temp arrays L and R
  for (i = 0; i < n1; i++)  {
    L[i] = arr[l + i]; 
  }   
  for (j = 0; j < n2; j++) {
    R[j] = arr[m + 1+ j]; 
  }
      
  // Merge the temp arrays back into arr[l..r]
  i = 0; 
  j = 0; 
  k = l; 
  while (i < n1 && j < n2) { 
    if (L[i] <= R[j]) { 
      arr[k] = L[i]; 
      i++; 
    } else { 
      arr[k] = R[j]; 
      j++; 
    } 
    k++;
  } 

  // Copy the remaining elements of L, if there are any
  while (i < n1) { 
    arr[k] = L[i]; 
    i++; 
    k++; 
  } 

  // Copy the remaining elements of R, if there are any
  while (j < n2) { 
    arr[k] = R[j]; 
    j++; 
    k++; 
  } 
} 

/* THE FRAME CODE FOR THE ASYNC ALGORITHMS
let i = 0;
asyncIntervals.push(setInterval(function() {
  let intervalNum = asyncIntervals.length;
  if (i >= inputArr.length) {
    // Algorithm complete
    drawTriangles(-1);
    loadTxt.innerHTML = "Sorted";
    clearInterval(asyncIntervals[intervalNum-1]);
  } else {
    loadTxt.innerHTML = "<i>Sorting...</i>";
  
    // Algorithm

    i++;
    drawTriangles(i);
  }
}, stepTime));
*/

