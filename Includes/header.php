<div id="header">
    <!-- The logo and menu items -->
    <div id="menuCenter">
        <a href="index.php"><img src="CSS/Images/Logo.png" alt="Logo" id="logo"></a>

        <ul>
            <li><a class="menu" onclick="showProjMenu()" href="#">PROJECTS</a></li>
            <li><a class="menu" href="about.php">ABOUT</a></li>
            <li><a class="menu" href="contact.asp">CONTACT</a></li>
        </ul> 

    </div>
</div>

<div id="projectsMenu">
    <div id="projCenterBox">
        <button id="projMenuExit"onclick="hideProjMenu()">&#10799;</button>
        <table id="projMenuTable">
            <tr><td>MANDELBROT GENERATOR</td></tr>
            <tr><td>IMAGE EDITOR</td></tr>
            <tr><td>MUSIC MAKER</td></tr>
            <tr><td>GRAVITY SIMULATION</td></tr>
            <tr><td>MACHINE LEARNING</td></tr>
            <tr><td>PACMAN GAME</td></tr>
            <tr><td>MATH VISUALIZATION</td></tr>
        </table>
        <div id="projMenuContent"></div>
        <div id="honeycombProjMenu"></div>
    </div>
</div>

<script>
    var projMenu = document.getElementById("projectsMenu");

    function showProjMenu() {
        projMenu.style.display = "block";
    }

    function hideProjMenu() {
        projMenu.style.display = "none";
    }
</script>
