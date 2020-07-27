<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'Includes/headInfo.php';?>

    <link rel="stylesheet" href="CSS/brownianTree.css">
    <script src="Sketches/BrownianTree/BrownianTreeLines.js"></script>
    <title>Christopher Venczel | Brownian Tree Generator</title>
    <meta name="description" 
    content="Create different types of Brownian trees 
    and see a visualization of the diffusion limited aggregation process (DLA).">

    <script>
        window.addEventListener("load", function(){
            setDarkMode();
        });
    </script>
</head>

<body>
    <?php include 'Includes/header.php';?>
    <?php include 'Includes/footer.php';?>

    <span id="generationLabel" class="lbl">Generating: 100%</span>
    <div id="outerControlBox">
        <table id="controlTable">
            <tr>
                <th id="qualityBox">
                    <span id="qualityLbl" class="lbl">Quality: 0%</span>
                </th>
                <th>
                    <span class="lbl">Generate From:</span>
                    <input type="radio" class="checkbox" name="spawn" value="point" checked>
                    <label for="point" class="boxLbl">Point</label>
                    <input type="radio" class="checkbox" name="spawn" value="line">
                    <label for="line" class="boxLbl">Line</label>
                </th>
                <th>
                    <svg version="1.1" id="play" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="75px" width="75px"
                        viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
                    <path class="stroke-solid" fill="none" stroke="white"  d="M49.9,2.5C23.6,2.8,2.1,24.4,2.5,50.4C2.9,76.5,24.7,98,50.3,97.5c26.4-0.6,47.4-21.8,47.2-47.7
                        C97.3,23.7,75.7,2.3,49.9,2.5"/>
                    <path class="stroke-dotted" fill="none" stroke="white"  d="M49.9,2.5C23.6,2.8,2.1,24.4,2.5,50.4C2.9,76.5,24.7,98,50.3,97.5c26.4-0.6,47.4-21.8,47.2-47.7
                        C97.3,23.7,75.7,2.3,49.9,2.5"/>
                    <path class="icon" fill="white" d="M38,69c-1,0.5-1.8,0-1.8-1.1V32.1c0-1.1,0.8-1.6,1.8-1.1l34,18c1,0.5,1,1.4,0,1.9L38,69z"/>
                    </svg>
                </th>
            </tr>
        </table>
    </div>
</body>

</html> 