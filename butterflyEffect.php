<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'Includes/headInfo.php';?>
    <div id="p5_loading" class="loadingclass"></div>
    <script src="Sketches/ButterflyEffect/pendulums.js"></script>
    <link rel="stylesheet" href="CSS/butterfly.css">
    <title>Christopher Venczel | The Butterfly Effect</title>
    <meta name="description" 
    content="Visualize the chaos of the butterfly effect
     with this colorful interactive double pendulum simulation.">

    <script>
        window.addEventListener("load", function(){
            setDarkMode();
        });
    </script>
</head>

<body>
    <?php include 'Includes/header.php';?>
    <?php include 'Includes/footer.php';?>

    <div id="ctrlBox">
        <table id="ctrlTable">
            <tr>
                <td id="m1Txt">Mass 1: ??</td>
                <td id="m2Txt">Mass 2: ??</td>
                <td id="gTxt">Strength of Gravity: ??</td>
            </tr>
            <tr>
                <td>
                    <input id="m1" onchange="setRunLabel()" type="range" min="1" max="6" value="3" class="slider" style="width: 80%;">
                </td>
                <td>
                    <input id="m2" onchange="setRunLabel()" type="range" min="1" max="6" value="3" class="slider" style="width: 80%;">
                </td>
                <td>
                    <input id="gStrength" type="range" min="0" max="100" value="50" class="slider" style="width: 80%;">
                </td>
            </tr>
        </table>
    </div>
</body>

</html> 