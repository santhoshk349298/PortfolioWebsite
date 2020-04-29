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
    <button id="projMenuExit"onclick="hideProjMenu()"></button>
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
