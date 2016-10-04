/*************************************/
/*** Basic StickController Example ***/
/*************************************/

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 300);
renderer.backgroundColor = 0x8888ff;

// add the renderer view element to the DOM
document.querySelector('#gameDiv').appendChild(renderer.view);

// create a stage
var stage = new PIXI.Container();

// create a square to move around with the left stick
var leftSquare = new PIXI.Graphics();
leftSquare.x = 30;
leftSquare.y = 30;
leftSquare.xVel = 0;
leftSquare.yVel = 0;

leftSquare.beginFill(0x55ff55, 1);
leftSquare.drawRect(0, 0, 20, 20);
leftSquare.endFill();

// create a square to move around with the right stick
var rightSquare = new PIXI.Graphics();
rightSquare.x = 30;
rightSquare.y = 30;
rightSquare.xVel = 0;
rightSquare.yVel = 0;

rightSquare.beginFill(0xff5555, 1);
rightSquare.drawRect(0, 0, 20, 20);
rightSquare.endFill();


// Define a couple of sticks for the user to control;
var leftStick = new PixiStick.StickController(75, 225, {
    axes: 'xy'
});

var rightStick = new PixiStick.StickController(325, 225, {
    axes: 'xy'
});

// Add everything to the stage
stage.addChild(leftSquare);
stage.addChild(rightSquare);
stage.addChild(leftStick);
stage.addChild(rightStick);

var playerSpeed = 10; // Define a maximum speed for the squares

// Handle leftStick input
leftStick.onAxisChange = function(axes) {
    leftSquare.xVel = axes.x * playerSpeed;
    leftSquare.yVel = axes.y * playerSpeed;
}

// Handle rightStick input
rightStick.onAxisChange = function(axes) {
    rightSquare.xVel = axes.x * playerSpeed;
    rightSquare.yVel = axes.y * playerSpeed;
}


// Render the scene
requestAnimationFrame(animate);

function animate() {
    requestAnimationFrame(animate);

    // Compute new leftSquare position
    leftSquare.x += leftSquare.xVel;
    leftSquare.y += leftSquare.yVel;

    // Lock the leftSquare into the viewable area
    if (leftSquare.x > 380) leftSquare.x = 380;
    if (leftSquare.x < 0) leftSquare.x = 0;
    if (leftSquare.y > 280) leftSquare.y = 280;
    if (leftSquare.y < 0) leftSquare.y = 0;

    // Compute new rightSquare position
    rightSquare.x += rightSquare.xVel;
    rightSquare.y += rightSquare.yVel;

    // Lock the rightSquare into the viewable area
    if (rightSquare.x > 380) rightSquare.x = 380;
    if (rightSquare.x < 0) rightSquare.x = 0;
    if (rightSquare.y > 280) rightSquare.y = 280;
    if (rightSquare.y < 0) rightSquare.y = 0;


    // render the stage   
    renderer.render(stage);
}