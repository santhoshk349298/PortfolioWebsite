<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'Includes/headInfo.php';?>

    <link rel="stylesheet" href="CSS/chaosGame.css">
    <script src="Sketches/ChaosGame/chaosGame.js"></script>
    <title>Christopher Venczel | Chaos Game</title>
    <meta name="description" 
    content="Expirement with generating a variety of geometric fractals using the chaos game algorithm.">
</head>

<body>
    <?php include 'Includes/header.php';?>
    <button id="optionsBtn" onclick="toggleOptions()">&#9776; Collapse Options</button>
    <div id="controlPanel">
    <div id="innerPanel">
        <table id="controlTable">
            <tr><td>
                <p id="polygonTitle">Polygon: Regular</p>
                <label>
                    <input autocomplete="off" type="radio" class="polygonRadioBtn" name="PolygonType" value="regular" checked>
                    <img src="CSS/Images/ChaosGame/regularPolygon.jpg" height="50px">
                </label>

                <label>
                    <input autocomplete="off" type="radio" class="polygonRadioBtn" name="PolygonType" value="irregular">
                    <img src="CSS/Images/ChaosGame/irregularPolygon.jpg" height="50px">
                </label>
            </td></tr>

            <tr><td id="vertNumSlot">
                <p id="vertNumTitle">Number of Vertices: 3</p>
                <input autocomplete="off" type="range" min="3" max="10" 
                value="3" id="vertNumRange">
            </td></tr>

            <tr><td>
                Rule:
                <p id="ruleTitle">Default <i>(Don't Skip Vertices)</i></p>
                <input autocomplete="off" type="range" min="0" max="3" 
                value="3" id="ruleRange">
            </td></tr>

            <tr><td>
                <p id="jumpTitle">Jump Length: 0.50</i></p>
                <input autocomplete="off" type="range" min="25" max="75" 
                value="50" id="jumpRange">
            </td></tr>
        </table>
    </div>
    </div>
    <?php include 'Includes/footer.php';?>
</body>

<script>
    let optionsPanel;
    let optionsBtn;
    let optionsOpen = true;
    let innerPanel;
    let optionsWidth = 250;

    window.onload = function() {
        innerPanel = document.getElementById("innerPanel");
        optionsBtn = document.getElementById("optionsBtn");
        optionsPanel = document.getElementById("controlPanel");

        setSizes();
    };

    window.onresize = setSizes;

    function setSizes() {
        let panelWidth = window.innerWidth/3;
        optionsPanel.style.width = panelWidth+"px";
        optionsBtn.style.marginLeft = panelWidth-optionsWidth+25+"px"
        innerPanel.style.width = optionsWidth+"px";
    }

    function toggleOptions() {
        if (optionsOpen) {
            optionsOpen = false;
            optionsBtn.innerText = "\u2630 Expand Options";
            optionsPanel.style.display = "none";
        } else {
            optionsOpen = true;
            optionsBtn.innerText = "\u2630 Collapse Options";
            optionsPanel.style.display = "block";
        }
    }
</script>

</html> 