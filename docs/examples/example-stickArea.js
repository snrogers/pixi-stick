var squareSpeed = 10;

document.addEventListener('webkitfullscreenchange', function() {
    canvasPrev = canvas;
    canvas = document.webkitCurrentFullScreenElement;

    if (canvas) {
        canvas.style.position = 'absolute';

        if (window.innerHeight > window.innerWidth) {
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
        } else {
            canvas.style.width = 'auto';
            canvas.style.height = '100%';
        }
    } else {
        canvasPrev.style.position = 'relative';
        canvasPrev.style.width = 'auto';
        canvasPrev.style.height = 'auto';
    }
});

// STICK AREA EXAMPLE

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 300);
renderer.backgroundColor = 0x8888ff;

// add the renderer view element to the DOM
document.querySelector('#gameDiv').appendChild(renderer.view);

// create an Container
var stage = new PIXI.Container();

// create a square to move around
var square = new PIXI.Graphics();
square.x = 30;
square.y = 30;
square.xVel = 0;
square.yVel = 0;

square.beginFill(0x55ff55);
square.drawShape(new PIXI.Rectangle(0, 0, 20, 20));
square.endFill();

window.square = square;

// Define a stick for the user to control;
var leftStickArea = new PixiStick.StickArea(0, 0, 200, 300, {
    debug: true
});

var rightStickArea = new PixiStick.StickArea(200, 0, 200, 300, {
    debug: true
});

stage.addChild(square);
stage.addChild(leftStickArea);
stage.addChild(rightStickArea);

// Handle leftStickArea input
leftStickArea.onAxisChange = function(axes) {
    square.xVel = axes.x * squareSpeed;
    square.yVel = axes.y * squareSpeed;
}

// Handle rightStickArea input
rightStickArea.onAxisChange = function(axes) {
    square.xVel = axes.x * squareSpeed;
    square.yVel = axes.y * squareSpeed;
}

// Render the scene
requestAnimationFrame(animate);

function animate() {
    requestAnimationFrame(animate);

    square.x += square.xVel * squareSpeed;
    square.y += square.yVel * squareSpeed;

    if (square.x > 380) square.x = 380;
    if (square.x < 0) square.x = 0;

    if (square.y > 280) square.y = 280;
    if (square.y < 0) square.y = 0;


    // render the stage   
    renderer.render(stage);
}