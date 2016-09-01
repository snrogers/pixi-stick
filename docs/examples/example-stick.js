var playerSpeed = 10;

// STATIC STICK example
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
leftSquare.beginFill(0x55ff55, 1);
leftSquare.drawRect(0, 0, 20, 20);
leftSquare.endFill();

// create a square to move around with the right stick
var rightSquare = new PIXI.Graphics();
rightSquare.x = 30;
rightSquare.y = 30;
rightSquare.beginFill(0xff5555, 1);
rightSquare.drawRect(0, 0, 20, 20);
rightSquare.endFill();


// Define a couple of sticks for the user to control;
var leftStick = new PixiStick.Stick(75, 225, {
    type: 'xy'
});

var rightStick = new PixiStick.Stick(325, 225, {
    type: 'xy'
});

stage.addChild(leftSquare);
stage.addChild(rightSquare);
stage.addChild(leftStick);
stage.addChild(rightStick);

// Render the scene
requestAnimationFrame(animate);

var prevTime = Date.now();
var fps = 0;

var tickTock = 0;

function animate() {
    requestAnimationFrame(animate);

    // tickTock++;
    // if (tickTock % 3 == 0) {
    //     return;
    // }

    // Wire up the leftStick and leftSquare
    leftSquare.x += leftStick.poll().x * playerSpeed;
    leftSquare.y += leftStick.poll().y * playerSpeed;

    // Lock the leftSquare into the viewable area
    if (leftSquare.x > 380) leftSquare.x = 380;
    if (leftSquare.x < 0) leftSquare.x = 0;
    if (leftSquare.y > 280) leftSquare.y = 280;
    if (leftSquare.y < 0) leftSquare.y = 0;

    // Wire up the rightSquare and rightStick
    rightSquare.x += rightStick.poll().x * playerSpeed;
    rightSquare.y += rightStick.poll().y * playerSpeed;

    // Lock the rightSquare into the viewable area
    if (rightSquare.x > 380) rightSquare.x = 380;
    if (rightSquare.x < 0) rightSquare.x = 0;
    if (rightSquare.y > 280) rightSquare.y = 280;
    if (rightSquare.y < 0) rightSquare.y = 0;





    // render the stage   
    renderer.render(stage);


    // fps timer;
    fps++;

    if (Date.now() - prevTime > 1000) {
        console.log('fps: ' + fps);
        fps = 0;
        prevTime = Date.now();
    }


}