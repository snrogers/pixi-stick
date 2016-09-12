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


// create a couple of squares to move around
var leftSquare = new PIXI.Graphics();
leftSquare.x = 30;
leftSquare.y = 30;
leftSquare.xVel = 0;
leftSquare.yVel = 0;

leftSquare.beginFill(0x55ff55);
leftSquare.drawShape(new PIXI.Rectangle(0, 0, 20, 20));
leftSquare.endFill();

var rightSquare = new PIXI.Graphics();
rightSquare.x = 30;
rightSquare.y = 30;
rightSquare.xVel = 0;
rightSquare.yVel = 0;

rightSquare.beginFill(0xff5555);
rightSquare.drawShape(new PIXI.Rectangle(0, 0, 20, 20));
rightSquare.endFill();


// Define a stick for the user to control;
var leftStickArea = new PixiStick.StickArea(0, 0, 200, 300, {
    debug: true
});

var rightStickArea = new PixiStick.StickArea(200, 0, 200, 300, {
    debug: true
});

stage.addChild(leftSquare);
stage.addChild(rightSquare);
stage.addChild(leftStickArea);
stage.addChild(rightStickArea);

// Handle leftStickArea input
leftStickArea.onAxisChange = function(axes) {
    leftSquare.xVel = axes.x * squareSpeed;
    leftSquare.yVel = axes.y * squareSpeed;
}

// Handle rightStickArea input
rightStickArea.onAxisChange = function(axes) {
    rightSquare.xVel = axes.x * squareSpeed;
    rightSquare.yVel = axes.y * squareSpeed;
}

// Render the scene
requestAnimationFrame(animate);

function animate() {
    requestAnimationFrame(animate);

    // Handle LeftSquare
    leftSquare.x += leftSquare.xVel;
    leftSquare.y += leftSquare.yVel;
    if (leftSquare.x > 380) leftSquare.x = 380;
    if (leftSquare.x < 0) leftSquare.x = 0;

    if (leftSquare.y > 280) leftSquare.y = 280;
    if (leftSquare.y < 0) leftSquare.y = 0;

    // Handle RightSquare
    rightSquare.x += rightSquare.xVel;
    rightSquare.y += rightSquare.yVel;
    if (rightSquare.x > 380) rightSquare.x = 380;
    if (rightSquare.x < 0) rightSquare.x = 0;

    if (rightSquare.y > 280) rightSquare.y = 280;
    if (rightSquare.y < 0) rightSquare.y = 0;


    // render the stage   
    renderer.render(stage);
}