/* 
This project was inspired by the 'w0rthy' youtube channel
which features many cool sorting algorithm visualizations.
Specifically it is inspired by the 'Disparity Circle' visualizer
video which can be found here:
https://www.youtube.com/watch?v=R2eNWPYgeos 
*/

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

  // Maletain aspect ratio based off height
  if (calcW > canvW){
    // Width is limiting factor
    canvH = canvW/(aspectRatioTop/aspectRatioBottom);
  } else {
    // Height is limiting factor
    canvW = canvH*(aspectRatioTop/aspectRatioBottom);
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
      } else if (btn.innerText == "Max Heap Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n\\log n)\\)";
      } else if (btn.innerText == "Quicksort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n^2)\\)";
      } else if (btn.innerText == "Odd-Even Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n^2)\\)";
      } else if (btn.innerText == "Comb Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n^2)\\)";
      }  else if (btn.innerText == "Cocktail Shaker Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(n^2)\\)";
      } else if (btn.innerText == "LSD Base 2 Radix Sort") {
        efficiencyBox.innerHTML = "Time Complexity:<br>\\(O(wn)\\)";
      } else if (btn.innerText == "MSD Base 10 Radix Sort") {
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

  initNumList();

  drawTriangles(-1);
}

// Initialize number list
function initNumList() {
  numList = [];
  for (let i = 0; i < numOfPieces; i++) {
    numList.push(i);
  }
}

// The update function (redraws the circle/triangle slices)
function drawTriangles(current, circleArray) {
  let speedMS = stepTime;
  if (current == -2) {
    // Run at max speed (for shuffle)
    speedMS = 0;
  }

  return new Promise((resolve) => {
    asyncTimeouts.push(setTimeout(function() {
      if (circleArray == undefined) {
        circleArray = numList;
      }
      
      if (current >= 0) {
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
      strokeWeight(width/80);
      point(center.x, center.y);

      resolve();
    }, speedMS));
  });
}

// Recursive asynchronous Fisher-Yates shuffle
// https://bost.ocks.org/mike/shuffle/
async function shuffleCircle() {
  clearAllIntervals();
  initNumList();
  let m = numList.length;
  loadTxt.innerHTML = "<i>Shuffling...</i>";

  let showPerFrames = 5;

  // While there remain elements to shuffle...
  while (m) {
    // Pick a remaining element…
    let i = Math.floor(Math.random()*m--);

    // And swap it with the current element.
    let t = numList[m];
    numList[m] = numList[i];
    numList[i] = t;

    if (m % showPerFrames == 0) {
      await drawTriangles(-2); 
    } 
  }   

  sorting();
}

// Run the sorting algorithm that is selected in the dropdown
async function sorting() {
  let sortType = chosenAlg.innerText;
  loadTxt.innerHTML = "<i>Sorting...</i>";

  if (sortType == "Insertion Sort") {
    await insertionSort(numList);
  } else if (sortType == "Selection Sort") {
    await selectionSort(numList);
  } else if (sortType == "Bubble Sort") {
    await bubbleSort(numList);
  } else if (sortType == "Merge Sort") {
    await mergeSort(numList);
  } else if (sortType == "Max Heap Sort") {
    await heapSort(numList);
  } else if (sortType == "Quicksort") {
    await quickSort(numList, 0, numList.length-1)
  } else if (sortType == "Odd-Even Sort") {
    await oddEvenSort(numList);
  } else if (sortType == "Comb Sort") {
    await combSort(numList);
  } else if (sortType == "Cocktail Shaker Sort") {
    await cocktailShakerSort(numList);
  } else if (sortType == "LSD Base 2 Radix Sort") {
    await lsdSort(numList, 2);
  } else if (sortType == "MSD Base 10 Radix Sort") {
    await msdSort(numList);
  }

  drawTriangles(-1);
  loadTxt.innerHTML = "Sorted";
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
async function insertionSort(nums) {
  for (let i = 1; i < nums.length; i++) {
    let j = i - 1;
    let tmp = nums[i];
    while (j >= 0 && nums[j] > tmp) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j+1] = tmp;

    await drawTriangles(j);
  }
}

// https://medium.com/javascript-algorithms/javascript-algorithms-selection-sort-54da919d0513
async function selectionSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    let min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[min] > arr[j]) {
          min = j;
      }
    }
    if (min !== i) {
      let tmp = arr[i];
      arr[i] = arr[min];
      arr[min] = tmp;
    }
    await drawTriangles(min);
  }
}

// https://medium.com/javascript-algorithms/javascript-algorithms-bubble-sort-3d27f285c3b2
async function bubbleSort(inputArr) {
  let tmp;
  let len = inputArr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (inputArr[j] > inputArr[j + 1]) {
        tmp = inputArr[j];
        inputArr[j] = inputArr[j + 1];
        inputArr[j + 1] = tmp;
      }
    }
    await drawTriangles(i);
  }
}

// https://www.geeksforgeeks.org/iterative-merge-sort/
// Iterative (non-recursive) Merge Sort
async function mergeSort(arr) {
  // The size of the merge sections
  // Varies from 1 - n/2
  //let currentSize;
  let n = arr.length-1;
  let currentSize = 1;

  // Merge subarrays in bottom up  
  // manner. First merge subarrays  
  // of size 1 to create sorted  
  // subarrays of size 2, then merge 
  // subarrays of size 2 to create  
  // sorted subarrays of size 4, and so on. 
  for (currentSize = 1; currentSize <= n; currentSize = 2*currentSize) { 
    // Pick starting polet of different 
    // subarrays of current size 
    for (let left = 0; left < n; left += 2*currentSize) { 
      // Find ending polet of left  
      // subarray. mid+1 is starting  
      // polet of right 
      let mid = Math.min(left + currentSize - 1, n); 

      let right = Math.min(left + 2*currentSize - 1, n); 

      // Merge Subarrays arr[left...mid] & arr[mid+1...right] 
      await merge(arr, left, mid, right); 
    }
  }
}

// Function to merge the two haves arr[l..m] and 
// arr[m+1..r] of array arr[]
async function merge(arr, l, m, r) {
  let updatePer = 5; // number of frames per update

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
      
  // Merge the temp arrays back leto arr[l..r]
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
    if (k % updatePer ==  0) {
      await drawTriangles(k);
    }
  } 

  // Copy the remaining elements of L, if there are any
  while (i < n1) { 
    arr[k] = L[i]; 
    i++; 
    k++;
    if (k % updatePer ==  0) {
      await drawTriangles(k);
    }
  } 

  // Copy the remaining elements of R, if there are any
  while (j < n2) { 
    arr[k] = R[j]; 
    j++; 
    k++;
    if (k % updatePer ==  0) {
      await drawTriangles(k);
    }
  } 
}


// https://www.w3resource.com/javascript-exercises/searching-and-sorting-algorithm/searching-and-sorting-algorithm-exercise-3.php
// Max Heap Sort
let heap_array_length;
async function heapSort(input) {
  heap_array_length = input.length;

  for (var i = Math.floor(heap_array_length / 2); i >= 0; i -= 1) {
    heap_root(input, i);
    await drawTriangles(i);
  }

  for (i = input.length - 1; i > 0; i--) {
    hSwap(input, 0, i);
    heap_array_length--;

    heap_root(input, 0);
    await drawTriangles(i);
  }
}

/* to create MAX  array */  
function heap_root(input, i) {
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  var max = i;

  if (left < heap_array_length && input[left] > input[max]) {
    max = left;
  }

  if (right < heap_array_length && input[right] > input[max]) {
    max = right;
  }

  if (max != i) {
    hSwap(input, i, max);
    heap_root(input, max);
  }
}

async function hSwap(input, index_A, index_B) {
  var temp = input[index_A];

  input[index_A] = input[index_B];
  input[index_B] = temp;
}

// https://medium.com/javascript-algorithms/javascript-algorithms-quicksort-beb3169c4d4
// Quick Sort
async function quickSort(arr, low, high) {
  if (low < high) {
    let pivot = await partition(arr, low, high);
    await quickSort(arr, low, pivot - 1);
    await quickSort(arr, pivot + 1, high);
  }
}

function qsSwap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

async function partition(arr, low, high) {
  let q = low, i;
  for (i = low; i < high; i++) {
    if (arr[i] < arr[high]) {
      qsSwap(arr, i, q);
      q++;
      if (i % 2 == 0) {
        await drawTriangles(i, arr);
      }
    }
  }
  qsSwap(arr, i, q);
  return q;
}

// Odd Even Sort
// https://www.growingwiththeweb.com/2016/10/odd-even-sort.html
async function oddEvenSort(array) {
  var sorted = false;
  while (!sorted) {
    sorted = await innerSort(array, 1);
    sorted = await innerSort(array, 0) && sorted;
  }
  numList = array.reverse();
}

/**
 * Compares every second element of an array with its following element and
 * swaps it if not in order using a compare function. */
async function innerSort(array, i) {
  var sorted = true;
  for (; i < array.length - 1; i += 2) {
    if (array[i] < array[i+1]) {
      qsSwap(array, i, i + 1);
      sorted = false;
      if (i % 35 == 0) {
        await drawTriangles(i, array.slice().reverse());
      }
    }
  }
  return sorted;
}

// Comb Sort
// https://www.growingwiththeweb.com/2016/09/comb-sort.html
async function combSort(array) {
  let gap = array.length;
  let shrinkFactor = 1.3;
  let swapped;

  while (gap > 1 || swapped) {
    if (gap > 1) {
      gap = Math.floor(gap / shrinkFactor);
    }

    swapped = false;

    for (let i = 0; gap + i < array.length; ++i) {
      if (array[i] > array[i+gap]) {
        qsSwap(array, i, i + gap);
        swapped = true;
        await drawTriangles(i);
      }
    }
  }
  return array;
}

// Cocktail Shaker Sort
// https://stackabuse.com/bubble-sort-and-cocktail-shaker-sort-in-javascript/
async function cocktailShakerSort(a) {
  let swapped = true; 
  let start = 0; 
  let end = a.length; 
  let framesPer = 25;

  while (swapped == true) { 
    swapped = false; 

    // loop from bottom to top same as 
    // the bubble sort 
    for (let i = start; i < end - 1; ++i) { 
      if (a[i] > a[i + 1]) { 
        let temp = a[i]; 
        a[i] = a[i + 1]; 
        a[i + 1] = temp; 
        swapped = true;
        if (i % framesPer == 0) {
          await drawTriangles(i);
        }  
      } 
    } 

    // if nothing moved, then array is sorted. 
    if (swapped == false) {
      break;
    }

    // otherwise, reset the swapped flag so that it 
    // can be used in the next stage 
    swapped = false; 

    // move the end point back by one, because 
    // item at the end is in its rightful spot 
    end = end - 1; 

    // from top to bottom, doing the 
    // same comparison as in the previous stage 
    for (let i = end - 1; i >= start; i--) { 
      if (a[i] > a[i + 1]) { 
        let temp = a[i]; 
        a[i] = a[i + 1]; 
        a[i + 1] = temp; 
        swapped = true; 
        if (i % framesPer == 0) {
          await drawTriangles(i);
        }
      } 
    } 
    start++; 
  } 
}

// https://www.digitalocean.com/community/tutorials/js-radix-sort
// Radix Sort MSD (Base 10)
async function radixSort(arr) {
  let maxLength = String(Math.max(arr)).length;

  for (let i = 0; i < maxLength; i++) {
    let buckets = Array.from({ length: 10 }, () => []);

    for (let j = 0; j < arr.length; j++) {
      let num = getNumRadix(arr[j], i);

      if (num !== undefined) {
        buckets[num].push(arr[j]);
      }
      let drawArray = buckets.flat().concat(arr.slice(j, arr.length));
      await drawTriangles(j, drawArray);
    }
    arr = buckets.flat();
  }

  numList = arr;
}

// Get the digit at the current index in the num
function getNumRadix(num, index) {
  const strNum = String(num);
  let end = strNum.length - 1;
  //const foundNum = strNum[end - index];
  const foundNum = strNum[index];

  if (foundNum === undefined) {
    return 0;
  } else {
    return foundNum;
  } 
}

// LSD Radix Sort
//https://www.growingwiththeweb.com/sorting/radix-sort-lsd/

/**
 * Sorts an array using radix sort.
 * @param {Array} array The array to sort.
 * @param {number} [radix=10] The base/radix to use.
 * @returns The sorted array.
 */
async function lsdSort(array, radix) {
  if (array.length === 0) {
    return array;
  }

  radix = radix || 10;

  // Determine minimum and maximum values
  var minValue = array[0];
  var maxValue = array[0];
  for (var i = 1; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i];
    } else if (array[i] > maxValue) {
      maxValue = array[i];
    }
  }

  // Perform counting sort on each exponent/digit, starting at the least
  // significant digit
  var exponent = 1;
  while ((maxValue - minValue) / exponent >= 1) {
    array = await countingSortByDigit(array, radix, exponent, minValue);

    exponent *= radix;
  }

  return array;
}

/**
 * Stable sorts an array by a particular digit using counting sort.
 * @param {Array} array The array to sort.
 * @param {number} radix The base/radix to use to sort.
 * @param {number} exponent The exponent of the significant digit to sort.
 * @param {number} minValue The minimum value within the array.
 * @returns The sorted array.
 */
async function countingSortByDigit(array, radix, exponent, minValue) {
  var i;
  var bucketIndex;
  var buckets = new Array(radix);
  var output = new Array(array.length);

  // Initialize bucket
  for (i = 0; i < radix; i++) {
    buckets[i] = 0;
  }

  // Count frequencies
  for (i = 0; i < array.length; i++) {
    bucketIndex = Math.floor(((array[i] - minValue) / exponent) % radix);
    buckets[bucketIndex]++;
  }

  // Compute cumulates
  for (i = 1; i < radix; i++) {
    buckets[i] += buckets[i - 1];
  }

  // Move records
  for (i = array.length - 1; i >= 0; i--) {
    bucketIndex = Math.floor(((array[i] - minValue) / exponent) % radix);
    output[--buckets[bucketIndex]] = array[i];
  }

  // Copy back
  for (i = 0; i < array.length; i++) {
    array[i] = output[i];
    if (i % 5 == 0) {
      await drawTriangles(i, array);
    }
  }

  return array;
}

// MSD Sort
// https://jeremyckahn.github.io/javascript-algorithms/sorting_msd.js.html
async function msdSort(arr) {
  let d = 0;
  // Convert to a string array with leading zeroes
  let inArray = arr.map(String);
  let digL = numOfPieces.toString().length;
  for (let i = 0; i < inArray.length; i++) {
    let addedZeroes = digL - inArray[i].length;
    inArray[i] = "0".repeat(addedZeroes) + inArray[i];
  }
  await msdSortRun(inArray, 0, arr.length - 1, d);
  numList = inArray.map(Number);
}

function charCodeAt(str, i) {
  return (i < str.length) ? str.charCodeAt(i) : -1;
}

async function msdSortRun(arr, lo, hi, d) {
  var temp = [];
  var count = [];
  var j;
  var idx;

  // Use Insertion sort when the
  // array is smaller than given threshold
  for (j = lo; j <= hi; j++) {
    idx = charCodeAt(arr[j], d) + 2;
    count[idx] = count[idx] || 0;
    count[idx]++;
  }

  for (j = 0; j < count.length - 1; j++) {
    count[j] = count[j] || 0;
    count[j + 1] = count[j + 1] || 0;
    count[j + 1] += count[j];
  }

  for (j = lo; j <= hi; j++) {
    idx = charCodeAt(arr[j], d) + 1;
    temp[count[idx]] = arr[j];
    count[idx]++;
  }

  for (j = lo; j <= hi; j += 1) {
    arr[j] = temp[j - lo];
    if (j % 2 == 0) {
      await drawTriangles(j, arr.map(Number));
    }
  }

  for (j = 0; j < count.length - 2; j += 1) {
    await msdSortRun(arr, lo + count[j], lo + count[j + 1] - 1, d + 1);
  }
}
