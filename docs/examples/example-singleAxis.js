/******************************************/
/*** SingleAxis StickController Example ***/
/******************************************/

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 300);
renderer.backgroundColor = 0x8888ff;

// add the renderer view element to the DOM
document.querySelector('#gameDiv').appendChild(renderer.view);

// create a stage
var stage = new PIXI.Container();

// create a square to move around
var square = new PIXI.Graphics();
square.x = 30;
square.y = 30;
square.xVel = 0;
square.yVel = 0;

square.beginFill(0x55ff55, 1);
square.drawRect(0, 0, 20, 20);
square.endFill();

// Define a couple of sticks for the user to control;
var leftStick = new PixiStick.StickController(75, 225, {
    axes: 'x'
});

var rightStick = new PixiStick.StickController(325, 225, {
    axes: 'y'
});

// Add everything to the stage
stage.addChild(square);
stage.addChild(leftStick);
stage.addChild(rightStick);


var playerSpeed = 10; // Define a maximum speed for the square

// Handle leftStick input
leftStick.onAxisChange = function(axes) {
    square.xVel = axes.x * playerSpeed;
}

// Handle rightStick input
rightStick.onAxisChange = function(axes) {
    square.yVel = axes.y * playerSpeed;
}


// Render the scene
requestAnimationFrame(animate);

function animate() {
    requestAnimationFrame(animate);

    // Compute new square position
    square.x += square.xVel;
    square.y += square.yVel;

    // Lock the square into the viewable area
    if (square.x > 380) square.x = 380;
    if (square.x < 0) square.x = 0;
    if (square.y > 280) square.y = 280;
    if (square.y < 0) square.y = 0;

    // render the stage   
    renderer.render(stage);
}