<div id="header">
    <!-- The logo and menu items -->
    <div id="menuCenter">
        <a href="index.php"><img src="CSS/Images/Logo.png" alt="Logo" id="logo"></a>

        <ul>
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
                MANDELBROT GENERATOR
            </div></a></td></tr>

            <tr><td>IMAGE EDITOR</td></tr>
            <tr><td>MUSIC MAKER</td></tr>
            <tr><td>GRAVITY SIMULATION</td></tr>
            <tr><td>MACHINE LEARNING</td></tr>
            <tr><td>PACMAN GAME</td></tr>
            <tr><td>MATH VISUALIZATION</td></tr>
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
        projMenu.style.display = "none";
    }

    function setDesc(page) {
        let titleVal;
        let descVal;
        let imgName;
        let srcVal;

        if (page == "mandelbrot"){
            titleVal = "Fractals!";
            descVal = 
            "The <b>Mandelbrot Set</b> is a set of complex numbers " +
            "first discovered by the mathematician Benoit B. " +
            "Mandelbrot in 1980. The boundary of the Mandelbrot set " +
            "is a <i>fractal curve</i>, meaning it has the property of self-similarity " +
            "which leads to the emergence of beautiful infinitely detailed patterns." +
            "<br><br><b>Instructions:</b><br>" +
            "Scroll to zoom and grab + drag to explore the Mandelbrot Set. " +
            "Change the render quality with the slider." +
            "<br><br>⚠️<i>Note:</i> Higher quality rendering will slow down your browser!";
            imgName = "mandelbrot.png";
            srcVal = "Source: https://github.com/rosslh/Mandelbrot-set-explorer/blob/master/README.md";
        } else {
            titleVal = "";
            descVal = "";
            imgName = "Logo.png";
            srcVal = "";
        }

        // Draw the contents to screen
        title.innerHTML = titleVal;
        desc.innerHTML = descVal;
        backImg.style.backgroundImage = 'url("CSS/Images/' + imgName + '")';
        src.innerHTML = srcVal;
    }

    function resetDesc() {
        title.innerHTML = "Pick a project to the left.";
        desc.innerHTML = "Hovering will show more details.";
        backImg.style.backgroundImage = "none";
        src.innerHTML = "";
    }

    hideProjMenu();
</script>
