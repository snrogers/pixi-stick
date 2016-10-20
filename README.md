# PixiStick 
Thumbstick-style touchscreen controls for Pixi.js

## Install
```
npm install --save pixi-stick
```

## Basic usage example
```js
import PIXI from 'pixi.js';
import PixiStick from 'pixi-stick';

let renderer = PIXI.autoDetectRenderer(400, 300);

let stage = new PIXI.Container();

let stick = new PixiStick.StickController(75, 225, {
    axes: 'xy'
});

stage.addChild(stick);

stick.onAxisChange = function(axes) {
    // Do something with axes.x
    // Do something with axes.y
    // Values range from -1 to 1
}


// PixiStick attaches eventListeners to the window object, outside of the PIXI event system.
// To prevent memory leaks when removing PixiStick controls, call dispose() on the control
stage.removeChild(stick);
stick.dispose();
```

## Events
```js
/** Fires when the stick is initially touched */
stick.onTouchStart = function (axes){
    console.log(axes.x + ', ' + axes.y); 
};

/** Fires when the touch moves */
stick.onTouchMove = function (axes){
    console.log(axes.x + ', ' + axes.y); 
};

/** Fires when the stick is released */
stick.onTouchEnd = function (axes){
    console.log(axes.x + ', ' + axes.y); 
};

/** Fires any time the axes change, i.e. whenever any of the above events fire, onAxisChange also fires */
stick.onAxisChange = function (axes){
    console.log(axes.x + ', ' + axes.y); 
};
```

## API   
### PixiStick.StickController
> constructor(x, y, options)
> * x: number
> * y: number
> * options : object

```js
default options 
 {
    touch: true,      // Responds to touch events?
    mouse: true,      // Responds to mouse events?
    axes: 'xy',       // Which axes are supported? 'xy', 'x', or 'y'
    deadZone: 0,      // *UNIMPLEMENTED* Minimum axial output *UNIMPLEMENTED*
    nub: null,        // PIXI.Sprite object to use as the nub
    nubSize: 0.3,     // Size of the nub (0.3 mean the nub is 30% the diameter of the well)
    well: null,       // PIXI.Sprite object to use as the well
    wellRadius: 50,   // Radius of the well in pixels
};
```

### PixiStick.StickAreaController
> constructor(x, y, width, height, options)
> * x: number
> * y: number
> * width: number
> * height: number
> * options : object

```js
default options 
 {
    debug: false,     // Make the StickArea visible?
    touch: true,      // Responds to touch events?
    mouse: true,      // Responds to mouse events?
    axes: 'xy',       // Which axes are supported? 'xy', 'x', or 'y'
    deadZone: 0,      // *UNIMPLEMENTED* Minimum axial output *UNIMPLEMENTED*
    nub: null,        // PIXI.Sprite object to use as the nub
    nubSize: 0.3,     // Size of the nub (0.3 mean the nub is 30% the diameter of the well)
    well: null,       // PIXI.Sprite object to use as the well
    wellRadius: 50,   // Radius of the well in pixels
};
```


## Examples
[Stick Example](http://snrogers.github.com/pixi-stick/examples/example-stick.html)

[Single-Axis Example](http://snrogers.github.com/pixi-stick/examples/example-singleAxis.html)

[Sprite Example](http://snrogers.github.com/pixi-stick/examples/example-sprite.html)

[StickArea Example](http://snrogers.github.com/pixi-stick/examples/example-stickArea.html)


## TODO
* Implement onTap events
* Implement deadzone


