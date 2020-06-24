<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'Includes/headInfo.php';?>

    <link rel="stylesheet" href="CSS/mandelbrot.css">
    <script src="Sketches/Mandelbrot/mandelbrot.js"></script>
    <title>Christopher Venczel | Mandelbrot Explorer</title>
    <meta name="description" 
    content="Explore and save images of the famous Mandelbrot set fractal. 
    Click and drag to move and scroll to zoom in and take a closer look.">
</head>

<body>
    <?php include 'Includes/header.php';?>
    <?php include 'Includes/footer.php';?>

    <table id="sliderBox">
        <tr>
            <th id="lblBox">Quality:</th>
            <th id="sliderArea"></th>
        </tr>
    </table>
</body>

</html> 