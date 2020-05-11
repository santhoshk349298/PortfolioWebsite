
// The normal mandelbrot function
function mandel(x0,y0,thresh){
    var x = 0;
    var y = 0;
    for (var i = 0; i < thresh; i++) {

        var xtemp = x;
        x = x * x - y * y + x0;
        y = 2 * xtemp * y + y0;

        if ( x * x + y * y > 4 ) {
            return i; // Outside the set
        }
    }
    return i; // In the set
}

// A smoothed out version of the mandelbrot
function smooth_mandel(x0, y0, thresh) {
    var x = 0;
    var y = 0;

    var P = 2;
    for (var i = 0; i < thresh; i++) {

        var xtemp = x;

        x = x * x - y * y + x0;
        y = 2 * xtemp * y + y0;
        abs_z2 = x * x + y * y;

        if ( abs_z2 > P * P * 10 ) {
            return (i + 1 - (Math.log(Math.log(Math.sqrt(abs_z2)) ) ) / Math.log(P)) / thresh;
        }
    }
    return 1;
}

var threshold = 0;

var old_x;
var old_y;
var delta_x;
var delta_y;
var canvas_x_offset;
var canvas_y_offset;

var mouseUp = 1;

function mousedown(e)
{
    old_x = e.clientX;
    old_y = e.clientY;

    mouseUp = 0;

    //alert(e.clientX + " " + e.clientY);
}

function mouseup(e)
{

    delta_x = e.clientX - old_x;
    delta_y = e.clientY - old_y;

    //alert(center_x + " " + center_y);

    //shift_canvas(delta_x, delta_y);

    //setTimeout(draw(1), 1);

    draw(1);

    mouseUp = 1;
    delta_x = 0;
    delta_y = 0;
}

function mousemove(e)
{
    var coordDiv = document.getElementById('coord');
    var canvas = document.getElementById('mandel');
    var x = e.pageX - canvas_x_offset;
    var y = e.pageY - canvas_y_offset;

    var fx_min = fx_origin - pixel_size * canvas.width / 2;
    var fy_min = fy_origin - pixel_size * canvas.height / 2;
    var x0 = fx_min + pixel_size * x;
    var y0 = fy_min + pixel_size * y;
    coordDiv.innerHTML = "(" + x + "," + y + ") (" + x0 + "," + y0 +
    ")-> " + smooth_mandel(x0, y0, iterations);

    if (mouseUp) {
        return;
    }
    delta_x = e.clientX - old_x;
    delta_y = e.clientY - old_y;
    old_x = e.clientX;
    old_y = e.clientY;
    draw(1);
}

function shift_canvas(canvas)
{
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
    }

    var idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(idata, delta_x, delta_y);
    //ctx.translate(delta_x, delta_y);

    // 41 Quadrants
    // 32
    if (delta_x > 0) {
        x_min = 0;
        x_max = delta_x + 1;
        // 34
    } else {
        x_min = canvas.width + delta_x - 1;
        x_max = canvas.width;
        // 12
    }

    if (delta_y > 0) {
        y_min = 0;
        y_max = delta_y + 1;
        // 14
    } else {
        y_min = canvas.width + delta_y - 1;
        y_max = canvas.width;
        // 23
    }

    sub_draw(canvas, x_min, 0, x_max, canvas.height)
    sub_draw(canvas, x_min, y_min, x_max, y_max)
    //draw (x_min to x_max) from 0 to height
    //     (y_min to y_max) from 0 to width

}

// Draw (if moved or otherwise)
function draw(moved)
{
    var canvas = document.getElementById('mandel');
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
    }

    update_window_scale();

    var x_min = 0;
    var x_max = canvas.width;
    var y_min = 0;
    var y_max = canvas.height;

    if (moved) {
        fx_origin = fx_origin - pixel_size * delta_x;
        fy_origin = fy_origin - pixel_size * delta_y;
    }

    sub_draw(canvas, x_min, y_min, x_max, y_max)
}


// The function that draws the mandelbrot to the screen
function sub_draw(canvas, x_min, y_min, x_max, y_max) {

    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
    }

    // The image
    var idata = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var warn = 0;
    var min_color = 1;

    /*  0     x    xmax
     * 0+----------+
     *  |     |    |     px,py (0<px<xmax,0<py<ymax)
     * y|-----p----|     ->
     *  |     |    |     fx (fx_center - window/2 < fx < fx_center + window/2)
     *  |     |    |     fx (fx_min < fx < fx_min + window)
     * y+-----+----+     fx_min = fx_center - window/2
     *max                fx = fx_min + window * (px / xmax)
     *
     * We have canvas coordinates and mandel coordinates.
     * Canvas matters for drawing and shifting, but mandel should maintain
     * the "picture origin" as it matters for zooming to remain consistent.
     */
    var fx_min = fx_origin - pixel_size * canvas.width / 2;
    var fy_min = fy_origin - pixel_size * canvas.height / 2;

    var scaleDiv = document.getElementById('scale');
    scaleDiv.innerHTML = "(" + fx_min + " = " + fx_origin + " - " + pixel_size * canvas.width / 2 + ")\n(" + fy_min + " = " + fy_origin + " - " + pixel_size * canvas.height / 2 + ")" + pixel_size * canvas.height + " " + canvas.width + "," + canvas.height + "\n(" + pixel_size * canvas.width + "," + pixel_size * canvas.height + ")";

    // Loop through all pixels in the render
    for (y = y_min; y < y_max; y++) {
        for (x = x_min; x < x_max; x++) {
            // Get the pixel to be calculated (x0 is r and y0 is i)
            var x0 = fx_min + pixel_size * x;
            var y0 = fy_min + pixel_size * y;

            // Get the color of the px by running the mandelbrot function
            var color = smooth_mandel(x0, y0, iterations);

            // Set the minimum color
            if (color < min_color) {
                min_color = color;
            }

            // 42 43 y=463 transition
            if (0.49 < color && color < 0.5 && warn) {
                alert(x0 + " " + y0 + " " + color);
                warn = 0;
            }

            // Get the color (in RGB)
            var rcolor = Math.sin(Math.PI * 1 * color);
            var gcolor = Math.sin(Math.PI * 2 * color);
            var bcolor = Math.sin(Math.PI * 3 * color);
            var rnum = Math.floor(rcolor * 255);
            var gnum = Math.floor(gcolor * 255);
            var bnum = Math.floor(bcolor * 255);

            if (warn) {
                alert(rnum + " " + gnum + " " + bnum);
                warn = 0;
            }

            // Set the color to the image
            idata.data[((y *(idata.width * 4)) + (x * 4)) + 0] = rnum;
            idata.data[((y *(idata.width * 4)) + (x * 4)) + 1] = gnum;
            idata.data[((y *(idata.width * 4)) + (x * 4)) + 2] = bnum;
            idata.data[((y *(idata.width * 4)) + (x * 4)) + 3] = 255;
        }
    }
    // Put the image data on the canvas
    ctx.putImageData(idata, 0, 0);

    document.getElementById('nums').innerHTML = delta_x + "," + delta_y + " (" + fx_origin + "," + fy_origin + ")";

    draw_axis()
}

var iterations;

var fx_origin = 0;
var fy_origin = 0;
var window_size;
var window_size_x = 1;
var window_size_y = 1;
var vpheight;
var vpwidth;
var pixel_size;

function update_window_scale() {
        if (vpheight < vpwidth) {
            window_size_y = 1;
            window_size_x = vpwidth / vpheight;
            pixel_size = window_size / vpheight;
        } else {
            window_size_y = vpheight / vpwidth;
            window_size_x = 1;
            pixel_size = window_size / vpwidth;
        }
}

function reset_view() {
    delta_x = 0;
    delta_y = 0;
    fx_origin = 0;
    fy_origin = 0;
    window_size = 4.1;
    mouseUp = 1;
    iterations = 20;
}

// The initialization function
function init() {
    var canvas = document.getElementById('mandel');
    var container = document.getElementById('container');
    container.onmousedown = mousedown;
    container.onmouseup = mouseup;
    container.onmousemove = mousemove;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    vpheight = canvas.height;
    vpwidth = canvas.width;

    canvas_x_offset = 0;
    canvas_y_offset = 0;
    var curElem = canvas;
    // accumulate all offset; not just the canvas itself.
    do {
        canvas_x_offset += curElem.offsetLeft;
        canvas_y_offset += curElem.offsetTop;
    } while (curElem = curElem.offsetParent)
}

// Controls like axes toggle, zoom, and reset
var zoom_factor = 1.5;

function zoom_in() {
    window_size /= zoom_factor;
    iterations += 4;
    draw(0);
}

function zoom_out() {
    window_size *= zoom_factor;
    iterations -= 4;
    draw(0);
}

function reset() {
    reset_view();
    draw(0);
}

var draw_axes = 0
function draw_axis() {
    if (!draw_axes) {
        return;
    }
    var axes = document.getElementById('axes');
    axes.style.display = "inline";
    return;
}

function undraw_axes() {
    var axes = document.getElementById('axes');
    axes.style.display = "none";
    return;
}

function toggle_axes() {
    draw_axes = ! draw_axes;
    //draw(0);
    button = document.getElementById('axes_button');
    if (draw_axes) {
        draw_axis()
        button.value = "axes off";
    } else {
        undraw_axes();
        button.value = "axes on";
    }
}

// First function to run (called onLoad)
function draw_one() {
    init();
    reset_view();
    draw(0);
    draw_axis();
}
