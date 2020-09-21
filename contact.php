<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'Includes/headInfo.php';?>
    <div id="p5_loading" class="loadingclass"></div>
    <link rel="stylesheet" href="CSS/contact.css">
    <title>Christopher Venczel | Contact Me</title>
    <meta name="description" 
    content="Contact me at my email: christopher.venczel@outlook.com, 
    through LinkedIn, or via GitHub.">
    <script>
        let oldFunction = setSize;

        setSize = function() {
            oldFunction();
            setLinks();
        };

        function setLinks() {
            let links = document.getElementsByClassName("basicLink");
            let center = document.getElementById("centerDiv");
            if (isMobile) {
                links[0].innerText = "Email";
                links[1].innerText = "LinkedIn";
                links[2].innerText = "Github";
                center.style.width = "350px";
            } else {
                links[0].innerText = "christopher.venczel@outlook.com";
                links[1].innerText = "www.linkedin.com/in/christopher-venczel";
                links[2].innerText = "www.github.com/chrisvenczel";
                center.style.width = "600px";
            }
        }
    </script>
</head>

<body>
    <?php include 'Includes/header.php';?>
    <?php include 'Includes/footer.php';?>

    <table id="centerDiv">
        <tr>
            <td class="imgCol" id="emailImg"></td>
            <td class="txtCol"><a href="mailto:christopher.venczel@outlook.com" class="basicLink">
                christopher.venczel@outlook.com
                </a>
            </td>
        </tr>
        <tr>
            <td class="imgCol" id="linkedInImg"></td>
            <td class="txtCol"><a target="_blank" href="http://www.linkedin.com/in/christopher-venczel" class="basicLink">
                    www.linkedin.com/in/christopher-venczel
                </a>
            </td>
        </tr>
        <tr>
            <td class="imgCol" id="githubImg"></td>
            <td class="txtCol"><a target="_blank" href="https://github.com/chrisvenczel/" class="basicLink">
                    www.github.com/chrisvenczel
                </a>
            </td>
        </tr>
    </table>

</body>

</html> 