<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'Includes/headInfo.php';?>
    <div id="p5_loading" class="loadingclass"></div>
    <link rel="stylesheet" href="CSS/mandelbrot.css">
    <script src="Sketches/Mandelbrot/mandelbrot.js"></script>
    <title>Christopher Venczel | Mandelbrot Explorer</title>
    <meta name="description" 
    content="Explore and save images of the famous Mandelbrot set fractal. 
    Click and drag to move and scroll to zoom in and take a closer look.">
</head>

<body>
    <?php include 'Includes/header.php';?>
    <?php include 'Includes/footer.php';?>

    <div id="topControlsBar">
        <table id="controlTable">
            <tr>
            <!-- ZOOM -->
            <td id="zoom">
                Zoom:<br>3.2 x 10<sup>21</sup>
            </td>

            <!-- QUALITY -->
            <td id="quality">
                <div id="qualityTxt">
                    Quality: Medium
                </div>
                <input autocomplete="off" type="range" id="qualitySlider" name="quality" min="1" max="4" value="2">
            </td>

            <!-- LOADING MSG -->
            <td id="loadingMsg">
                <div id="loadText">
                    Loading: 15%
                </div>
                <div id="myProgress">
                <div id="myBar"></div>
                </div>
            </td>

            <!-- BUTTONS -->
            <td id="buttonBox">
                <table id="ctrlBtnTable">
                    <tr>
                    <td>
                    <button id="infoBtn" class="ctrlBtn" type="button">&nbsp;ℹ️&nbsp;&nbsp;info</button> 
                    </td>
                    <td>
                    <button id="resetBtn" class="ctrlBtn" type="button">🔄 reset position</button>
                    </td>
                    </tr>

                    <tr>
                    <td>
                    <button id="saveBtn" class="ctrlBtn" type="button">💾 save image</button> 
                    </td>
                    <td>
                    <button id="colBtn" class="ctrlBtn" type="button">🎨 new colors</button> 
                    </td>
                    </tr>
                </table >
            </td>
            </tr>
        </table>
    </div>

    <!-- The Pop Up -->
    <div id="popUp">
        <div id="xRow">
            <button id="exitPopup">✖️</button>
        </div>
        <a id="wikiLink" class="basicLink" target="_blank"
        href="https://en.wikipedia.org/wiki/Mandelbrot_set">
        <div id="linkSpacer"></div>
        <img src="CSS/Images/wikiLogo.png" 
        alt="wikiLogo" style="width:50px">
        <span style="text-decoration: underline;">
        What is the Mandelbrot Set?
        </span>
        </a>
        <span id="instructionsTitle">Instructions:</span>
        <p>
        <b>Click and drag</b> on the canvas to <i>move</i> around the Mandelbrot Set.
        <br><br>Use the <b>scroll wheel</b> to <i>zoom</i> in and out.
        <br><br>The quality may be changed using the quality slider.
        To reduce lag the image is rendered at a low quality when you are moving
        and only renders at the chosen quality once you have stopped moving.
        <br><br>Other settings can be found near the info button at the top right
        including options to: save the render as an image, change the color style randomly, 
        and to reset to the initial position and zoom level. 
        </p>
    </div>
    <div id="popUpOverlay"></div>
</body>

</html> 