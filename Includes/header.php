<div id="header">
    <!-- The logo and menu items -->
    <div id="menuCenter">
        <a href="index.php" id="logoLink"><img src="CSS/Images/Logo.png" alt="Logo" id="logo"></a>

        <ul id="menuZone">
            <li><a class="menu" onclick="showProjMenu()" href="#">PROJECTS</a></li>
            <li><a class="menu" href="about.php">ABOUT</a></li>
            <li><a class="menu" href="contact.php">CONTACT</a></li>
        </ul> 

    </div>
</div>

<div id="projectsMenu">
    <div id="projCenterBox">
        <button id="projMenuExit" onclick="hideProjMenu()">&#10799;</button>
        <table id="projMenuTable">

            <tr onmouseover="setDesc('mandelbrot')" onmouseout="resetDesc()">
            <td><a class="noStyleLink" href="mandelbrot.php">
            <div class="projLinkBox">
                Mandelbrot<br>Explorer
            </div></a></td></tr>

            <tr onmouseover="setDesc('butterflyEffect')" onmouseout="resetDesc()">
            <td><a class="noStyleLink" href="butterflyEffect.php">
            <div class="projLinkBox">
                The<br>Butterfly<br>Effect
            </div></a></td></tr>

            <tr onmouseover="setDesc('chaosGame')" onmouseout="resetDesc()">
            <td><a class="noStyleLink" href="chaosGame.php">
            <div class="projLinkBox">
                Chaos<br>Game<br>Fractals
            </div></a></td></tr>

            <tr onmouseover="setDesc('brownianTree')" onmouseout="resetDesc()">
            <td><a class="noStyleLink" href="brownianTree.php">
            <div class="projLinkBox">
                Brownian<br>Tree<br>Generator
            </div></a></td></tr>

            <tr onmouseover="setDesc('trexGame')" onmouseout="resetDesc()">
            <td><a class="noStyleLink" href="trex.php">
            <div class="projLinkBox">
                TRex<br>Game
            </div></a></td></tr>
        </table>
        <div id="projMenuContent">
            <div id="projMenuBackImg"></div>
            <div id="projMenuDescriptionBox">
                <div id="projMenuTitle"></div>
                <p id="projMenuDescription"></p>
            </div>
            <span id="projMenuSources"></span>
        </div>
        <div id="honeycombProjMenu"></div>
    </div>
</div>

<script>
    var menuTable = document.getElementById("projMenuTable");
    var menuItems = menuTable.rows;

    var backImg = document.getElementById("projMenuBackImg");
    var title = document.getElementById("projMenuTitle");
    var desc = document.getElementById("projMenuDescription");
    var src = document.getElementById("projMenuSources");


    var projMenu = document.getElementById("projectsMenu");

    function showProjMenu() {
        resetDesc();
        projMenu.style.display = "block";
    }

    function hideProjMenu() {
        backImg.classList.toggle('fade');
        projMenu.style.display = "none";
    }

    function setDesc(page) {
        let titleVal;
        let descVal;
        let imgName;
        let srcVal;

        if (page == "mandelbrot"){
            titleVal = "The Mandelbrot!";
            descVal = 
            "The <b>Mandelbrot Set</b> is a set of complex numbers " +
            "first discovered by the mathematician Benoit B. " +
            "Mandelbrot in 1980. The boundary of the Mandelbrot set " +
            "is a <i>fractal curve</i>, meaning it has the property of self-similarity " +
            "which leads to the emergence of beautiful infinitely detailed patterns." +
            "<br><br><b>Instructions:</b><br>" +
            "<b>Scroll</b> to zoom and <b>Grab + Drag</b> to explore the Mandelbrot Set. " +
            "Change the render quality with the slider." +
            "<br><br>⚠️<i>Note:</i> Higher quality rendering will slow down your browser!";
            imgName = "mandelbrot.jpg";
            srcVal = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Mandel_zoom_04_seehorse_tail.jpg";
        } else if(page == "butterflyEffect") {
            titleVal = "The 🦋 Effect!";
            descVal = "The <b>Butterfly Effect</b> is when small changes in the initial conditions " +
            "of a system result in large and chaotic changes over time. This example visualizes " +
            "the butterfly effect using <i>double pendulums</i> (pendulums with two rods). The " +
            "pendulums begin with only a small offset from one another but quickly split apart. " +
            "<br><br><b>Instructions:</b><br>" +
            "Adjust the parameters with the sliders. To re-run the expirement with new settings click <i>Run!</i>";
            imgName = "butterflyEffect.jpg";
            srcVal = "";
        } else if(page == "chaosGame") {
            titleVal = "Geometric Fractals!";
            descVal = "The <b>Chaos Game</b> is a method of generating a fractal by using a polygon and a point "+
            "which moves inside the polygon according to certain rules. By changing the polygon and the restrictions "+
            "this method allows for the generation of a wide variety of fractals including the Sierpinski triangle and "+
            "Sierpinski carpet."+
            "<br><br><b>Instructions:</b><br>" +
            "Adjust the parameters with the sliders found in the collapsible options menu. The render will update automatically.";
            imgName = "ChaosGame.jpg";
            srcVal = "";
        } else if(page == "brownianTree") {
            titleVal = "Brownian Trees!";
            descVal = "A <b>Brownian tree</b> is an organic looking fractal created by clustering particles " +
            "that have Brownian motion. This process is called <i>diffusion-limited aggregation</i> and is " +
            "found in nature in everything from the creation of snowflakes to dendrites in our brains." +
            "<br><br><b>Instructions:</b><br>" +
            "Adjust the parameters with the sliders. To re-run the expirement with new settings click <i>Run!</i>";
            imgName = "brownianTree.jpg";
            srcVal = "";
        }else if(page == "trexGame") {
            titleVal = "TRex Game";
            descVal = "";
            imgName = "";
            srcVal = "";
        } else {
            titleVal = "";
            descVal = "";
            imgName = "";
            srcVal = "";
        }

        // Draw the contents to screen
        title.innerHTML = titleVal;
        desc.innerHTML = descVal;
        backImg.style.backgroundImage = 'url("CSS/Images/MenuBackgrounds/' + imgName + '")';
        src.innerHTML = srcVal;

        // Fade the img in
        backImg.classList.toggle('fade');
    }

    function resetDesc() {
        backImg.classList.toggle('fade');
        title.innerHTML = "Pick a project to the left.";
        desc.innerHTML = "Hovering will show more details.";
        backImg.style.backgroundImage = "none";
        src.innerHTML = "";
    }

    hideProjMenu();
    backImg.classList.toggle('fade');
</script>
