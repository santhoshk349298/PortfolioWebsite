<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"> 
<link href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap" rel="stylesheet"> 
<link rel="stylesheet" href="CSS/mainStyles.css">
<link rel="icon" href="CSS/Images/favicon.png">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<script src="P5JS_libraries/p5.js"></script>
<script src="P5JS_libraries/p5.sound.js"></script>
<script src="P5JS_libraries/p5.sound.min.js"></script>

<script>
    let isMobile = false;
    let minWidth = 600;
    let logoLink;
    let logo;
    let buttons;
    let menuZone;
    let centerBox;
    
    // Makes the content mobile if the width is small enough
    window.onload = (event) => {
        logoLink = document.getElementById("logoLink");
        logo = logoLink.firstChild;
        header = document.getElementById("header");
        footer = document.getElementById("footer");
        buttons = document.getElementsByClassName("menu");
        buttons = Array.prototype.slice.call(buttons);
        menuZone = document.getElementById("menuZone");
        centerBox = document.getElementById("menuCenter");
        setSize();
    }
    window.onresize = function(event) {
        setSize();
    }

    function setSize() {
        if (window.innerWidth < minWidth && !isMobile) {
            isMobile = true;
            buttons.forEach(makeMobile);
            // No mobile projects
            buttons[0].onclick = null;
            buttons[0].href = "mobileProjects.php";
        } else if (window.innerWidth >= minWidth && isMobile){
            isMobile = false;
            buttons.forEach(makeDesktop);
            // Allow project view in desktop
            buttons[0].onclick = showProjMenu;
            buttons[0].href = "#";
        }
    }

    function makeMobile(button) {
        button.style.lineHeight = "calc(var(--headerHeight)*0.5)";
        button.style.fontSize = "105%";
        button.style.marginLeft = "-10%";
        button.style.width = "92%";
        logo.style.marginTop = "25px";
        logo.style.height = "calc(var(--headerHeight)*0.5)";
        menuZone.insertBefore(logoLink, menuZone.firstChild);
        menuZone.style.width = "100%";
        menuZone.style.height = "90%";
        menuZone.style.minWidth = "350px";
        centerBox.style.width = "100%";
    }

    function makeDesktop(button) {
        button.style.width = "80%";
        button.style.lineHeight = "normal";
        button.style.fontSize = "15px";
        button.style.margin = "auto";
        logo.style.height = "50px";
        logo.style.marginTop = "10px";
        menuZone.style.width = "50%";
        menuZone.style.height = "60px";
        menuZone.style.minWidth = "500px";
        centerBox.style.width = "80%";
        centerBox.insertBefore(logoLink, centerBox.firstChild)
    }

    function setDarkMode() {
        for (let i = 0; i < 3; i++) {
            buttons[i].style.color = "rgb(50, 50, 50)";
        }
        //logo.style.filter = "invert(0.7) drop-shadow(-1px -1px 0 black) drop-shadow(1px 1px 0 black)";
        header.style.filter = "invert(1)";
        footer.style.filter = "invert(1)";
        header.style.backgroundColor = "rgb(240, 240, 240)";
        footer.style.backgroundColor = "rgb(240, 240, 240)";
    }
</script>