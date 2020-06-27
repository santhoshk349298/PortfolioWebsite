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
</head>

<body>
    <?php include 'Includes/header.php';?>
    <?php include 'Includes/footer.php';?>

    <table id="controlBox">
        <tr>
            <th id="qualityBox">
                <span class="lbl">Quality:</span>
            </th>
            <th>
                <span class="lbl">Generate From:</span>
                <input type="radio" class="checkbox" name="spawn" value="point" checked>
                <label for="point" class="boxLbl">Point</label>
                <input type="radio" class="checkbox" name="spawn" value="line">
                <label for="line" class="boxLbl">Line</label>
            </th>
        </tr>
    </table>
</body>

</html> 