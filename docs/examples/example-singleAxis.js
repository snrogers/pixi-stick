
var playerSpeed = 10;


// STATIC STICK example
(function() {
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(400, 300);
    // add the renderer view element to the DOM
    document.querySelector('#gameDiv').appendChild(renderer.view);

    // create an Container
    var stage = new PIXI.Container();

    // Colored background
    var background = new PIXI.Graphics();
    background.beginFill(0x8888ff, 1);
    background.drawShape(new PIXI.Rectangle(0, 0, 400, 300));
    background.endFill();

    // create a square to move around
    var player = new PIXI.Graphics();
    player.x = 30;
    player.y = 30;
    player.beginFill(0x55ff55);
    player.drawShape(new PIXI.Rectangle(0, 0, 20, 20));
    player.endFill();

    // Define a couple of sticks for the user to control;
    var nubSprite = new PIXI.Sprite.fromImage('img/nub.png');
    var wellSprite = new PIXI.Sprite.fromImage('img/well.png');

    var stick = window.stick2 = new PixiStick.Stick(75, 225, {
        type: 'xy'
    });

    var stick2 = window.stick = new PixiStick.Stick(325, 225, {
        type: 'xy',
        nub: nubSprite,
        well: wellSprite
    });


    stage.addChild(background);
    stage.addChild(stick);
    stage.addChild(stick2);
    stage.addChild(player);

    // Render the scene
    requestAnimationFrame(animate);

    function animate() {

        player.x += stick.poll().x * playerSpeed;
        player.y += stick.poll().y * playerSpeed;

        if (player.x > 380) player.x = 380;
        if (player.x < 0) player.x = 0;

        if (player.y > 280) player.y = 280;
        if (player.y < 0) player.y = 0;


        // render the stage   
        renderer.render(stage);

        requestAnimationFrame(animate);
    }
})();


// STICK AREA EXAMPLE

(function() {
    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(400, 300);
    // add the renderer view element to the DOM
    document.querySelector('#gameDiv2').appendChild(renderer.view);

    // create an Container
    var stage = new PIXI.Container();

    // Colored background
    var background = new PIXI.Graphics();
    background.beginFill(0x8888ff, 1);
    background.drawShape(new PIXI.Rectangle(0, 0, 400, 300));
    background.endFill();

    // create a square to move around
    var player = new PIXI.Graphics();
    player.x = 30;
    player.y = 30;
    player.beginFill(0x55ff55);
    player.drawShape(new PIXI.Rectangle(0, 0, 20, 20));
    player.endFill();

    window.player = player;

    // Define a stick for the user to control;
    var stickArea = new PixiStick.StickArea(0, 0, 200, 300, {
        debug: true
    });

    var stickArea2 = new PixiStick.StickArea(200, 0, 200, 300, {
        debug: true
    });

    stage.addChild(background);
    stage.addChild(player);
    stage.addChild(stickArea);
    stage.addChild(stickArea2);

    // Render the scene
    requestAnimationFrame(animate);

    function animate() {
        requestAnimationFrame(animate);

        // player.x += stickArea.poll().x * playerSpeed;
        // player.y += stickArea.poll().y * playerSpeed;

        if (player.x > 380) player.x = 380;
        if (player.x < 0) player.x = 0;

        if (player.y > 280) player.y = 280;
        if (player.y < 0) player.y = 0;


        // render the stage   
        renderer.render(stage);
    }
})();