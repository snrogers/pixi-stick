(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("PixiStick", [], factory);
	else if(typeof exports === 'object')
		exports["PixiStick"] = factory();
	else
		root["PixiStick"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var util_1 = __webpack_require__(1);
	exports.magnitude = util_1.magnitude;
	exports.unitVector = util_1.unitVector;
	var debug_1 = __webpack_require__(2);
	exports.debug = debug_1.debug;
	// TODO: HUUUUUGE TODO: take node-uuid out of the bundle
	var stick_controller_1 = __webpack_require__(3);
	var Stick = (function (_super) {
	    __extends(Stick, _super);
	    function Stick(x, y, options) {
	        if (options === void 0) { options = {}; }
	        options.type = 'static';
	        _super.call(this, x, y, options);
	    }
	    return Stick;
	}(stick_controller_1.default));
	exports.Stick = Stick;
	var stick_area_1 = __webpack_require__(8);
	exports.StickArea = stick_area_1.StickArea;
	var transformManager_1 = __webpack_require__(7);
	function init(renderer) { transformManager_1.transformManager.renderer = renderer; }
	exports.init = init;


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	function magnitude(vec) {
	    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
	}
	exports.magnitude = magnitude;
	function unitVector(vec, outVec) {
	    outVec = outVec || new PIXI.Point();
	    var mag = magnitude(vec);
	    outVec.x = vec.x / mag;
	    outVec.y = vec.y / mag;
	    return outVec;
	}
	exports.unitVector = unitVector;
	function sign(value) {
	    return value ? (value < 0 ? -1 : 1) : null;
	}
	exports.sign = sign;
	function isMouseEvent(event) {
	    return event.button !== undefined;
	}
	exports.isMouseEvent = isMouseEvent;
	// export function computeTransformFromCanvas(canvas: HTMLCanvasElement, transform: PIXI.Matrix) {
	//     let canvasStyle = getComputedStyle(canvas);
	//     transform.a = Number(canvasStyle.width.slice(0, -2)) / canvas.width;
	//     transform.b = 0;
	//     transform.c = 0;
	//     transform.d = Number(canvasStyle.height.slice(0, -2)) / canvas.height;
	//     transform.tx = (!Number(canvasStyle.left.slice(0, -2))) ? 0 : Number(getComputedStyle(canvas).left.slice(0, -2));
	//     transform.ty = (!Number(canvasStyle.top.slice(0, -2))) ? 0 : Number(getComputedStyle(canvas).top.slice(0, -2));
	// } 


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var debug;
	(function (debug) {
	    debug.loggers = Object.create(null);
	    debug.isActive = true;
	    function log(value, logger) {
	        if (!debug.isActive)
	            return;
	        if (logger) {
	            window.console.debug('[' + logger.id + '] ' + value);
	        }
	        else {
	            window.console.debug('value');
	        }
	    }
	    debug.log = log;
	    ;
	    // TODO: LOGGERLOGGERLOGGERLOGGERLOGGER
	    function id(logger, loggerClass) {
	        if (!debug.isActive)
	            return;
	        if (!debug.loggers[loggerClass]) {
	            debug.loggers[loggerClass] = Object.create(null);
	            debug.loggers[loggerClass].currentIndex = 0;
	        }
	        debug.loggers[loggerClass][debug.loggers[loggerClass].currentIndex] = logger;
	        return loggerClass + ' ' + debug.loggers[loggerClass].currentIndex++;
	    }
	    debug.id = id;
	    ;
	    function compare(left, right) {
	        // First check if number of keys is identical. This is needed in case right has keys that left does not.
	        if (Object.keys(left).length !== Object.keys(right).length) {
	            console.log('Object.keys(left).length !== Object.keys(right).length');
	            console.log(Object.keys(left).length + ' !== ' + Object.keys(right).length);
	            return false;
	        }
	        for (var prop in left) {
	            // Check if left has a key that right does not
	            if (!right[prop]) {
	                console.log('!right[prop]');
	                console.log('prop === ' + prop);
	                return false;
	            }
	            // If the left[prop] is a primitive, compare it to right[prop]
	            if (typeof left[prop] === 'string' || typeof left[prop] === 'number') {
	                if (left[prop] !== right[prop]) {
	                    console.log('left[' + prop + '] !== right[' + prop + ']');
	                    console.log(left[prop] + ' !== ' + right[prop]);
	                    return false;
	                }
	                else {
	                    continue;
	                }
	            }
	            // if we've reached this point then left[prop] must be an object so lets see if right[prop] is also an object
	            if (typeof right[prop] === 'string' || typeof left[prop] === 'number') {
	                console.log('typeof right[' + prop + '] === \'string\' || typeof left[' + prop + '] === \'number\')');
	                console.log(left[prop] + ' !== ' + right[prop]);
	                return false;
	            }
	            // By now, we've established that both left[prop] and right[prop] are objects, so lets recurse on them
	            if (!compare(left[prop], right[prop]))
	                return false;
	        }
	        return true;
	    }
	    debug.compare = compare;
	})(debug = exports.debug || (exports.debug = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = debug;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var util_1 = __webpack_require__(1);
	var joystick_1 = __webpack_require__(4);
	var events_1 = __webpack_require__(5);
	var drag_listener_1 = __webpack_require__(6);
	/****************************/
	/*** The Stick Controller ***/
	/****************************/
	var StickController = (function (_super) {
	    __extends(StickController, _super);
	    /*******************/
	    /*** Constructor ***/
	    /*******************/
	    function StickController(x, y, options) {
	        _super.call(this);
	        this._options = {
	            touch: true,
	            mouse: true,
	            axes: 'xy',
	            deadZone: 0,
	            nub: null,
	            nubSize: 0.3,
	            well: null,
	            wellRadius: 50,
	        };
	        this.isTouched = false;
	        this._axes = new PIXI.Point(0, 0);
	        this._registeredEventListeners = [];
	        this.x = x;
	        this.y = y;
	        if (options) {
	            for (var prop in options) {
	                if (options.hasOwnProperty(prop)) {
	                    this._options[prop] = options[prop];
	                }
	            }
	        }
	        // // Set dimensions
	        // if (this._options.type === 'static') {
	        //     this.width = this._options.wellRadius * 2;
	        //     this.height = this._options.wellRadius * 2;
	        // }
	        this.interactive = true;
	        this._joystick = new joystick_1.default(0, 0, this._options); // ERR: x and y should be computed based on stick type, i.e. static/semi/dynamic
	        this.addChild(this._joystick);
	        if (this._options.mouse)
	            this._initEvents('mouse');
	        if (this._options.touch)
	            this._initEvents('touch');
	    }
	    Object.defineProperty(StickController.prototype, "id", {
	        get: function () { return this._id; },
	        set: function (value) { if (!this._id) {
	            this._id = value;
	        }
	        else {
	            throw new Error('id is readonly');
	        } },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
	     * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
	     * listener on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
	     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the originator so the StickController
	     * will not receive the TouchEnd event if the user's finger is not over the StickController when they release)
	     **/
	    StickController.prototype._initEvents = function (mouseOrTouch) {
	        var _this = this;
	        console.log(events_1.default[mouseOrTouch]);
	        // Touch Start
	        this.on(events_1.default[mouseOrTouch].onTouchStart, function (event) {
	            _this.identifier = event.data.identifier;
	            _this.isTouched = true;
	            if (_this.onTouchStart)
	                _this.onTouchStart(_this._axes);
	            event.stopPropagation();
	        });
	        // Touch Drag
	        // Store this eventlistener for removal later
	        if (!this._dragListener)
	            this._dragListener = drag_listener_1.dragListener[this._options.axes];
	        this._registeredEventListeners.push([
	            events_1.default[mouseOrTouch].onTouchMove, function (event) {
	                if (util_1.isMouseEvent(event)) {
	                    if (_this.isTouched)
	                        _this._dragListener(event);
	                }
	                else {
	                    for (var i = 0; i < event.changedTouches.length; i++) {
	                        if (event.changedTouches[i].identifier === _this.identifier) {
	                            _this._dragListener(event.changedTouches[i]);
	                            break;
	                        }
	                    }
	                }
	            }
	        ]);
	        // add the event listener to the window
	        window.addEventListener(events_1.default[mouseOrTouch].onTouchMove, this._registeredEventListeners[this._registeredEventListeners.length - 1][1]);
	        // Touch End
	        // Store this eventlistener for removal later
	        this._registeredEventListeners.push([
	            events_1.default[mouseOrTouch].onTouchEnd, function (event) {
	                if (util_1.isMouseEvent(event)) {
	                    _this.identifier = undefined;
	                    _this.isTouched = false;
	                    _this.resetPosition();
	                    _this.onAxisChange(_this._axes);
	                    event.stopPropagation();
	                }
	                else {
	                    for (var i = 0; i < event.changedTouches.length; i++) {
	                        if (event.changedTouches[i].identifier === _this.identifier) {
	                            _this.identifier = undefined;
	                            _this.isTouched = false;
	                            _this.resetPosition();
	                            _this.onAxisChange(_this._axes);
	                            event.stopPropagation();
	                            break;
	                        }
	                    }
	                }
	            }]);
	        // add the event listener to the window
	        window.addEventListener(events_1.default[mouseOrTouch].onTouchEnd, this._registeredEventListeners[this._registeredEventListeners.length - 1][1]);
	    };
	    // Removes all window eventlisteners that this instance has registered
	    StickController.prototype.dispose = function () {
	        this._registeredEventListeners.forEach(function (arr) {
	            window.removeEventListener(arr[0], arr[1]);
	        });
	    };
	    StickController.prototype.resetPosition = function () {
	        this._joystick.nub.x = 0;
	        this._joystick.nub.y = 0;
	        this._axes.x = 0;
	        this._axes.y = 0;
	    };
	    return StickController;
	}(PIXI.Container));
	exports.StickController = StickController;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StickController;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var debug_1 = __webpack_require__(2);
	/**
	 * The graphical component. Contains no business logic (which is handled in StickController)
	 */
	var Joystick = (function (_super) {
	    __extends(Joystick, _super);
	    function Joystick(x, y, options) {
	        _super.call(this);
	        this.id = debug_1.default.id(this, 'Stick');
	        this._options = {
	            opacity: 0.25
	        };
	        this.x = x;
	        this.y = y;
	        for (var prop in options) {
	            if (options.hasOwnProperty(prop)) {
	                this._options[prop] = options[prop];
	            }
	        }
	        this._initGraphics();
	    }
	    Joystick.prototype._initGraphics = function () {
	        // Init Well
	        if (this._options.well) {
	            this.well = this._options.well;
	            this.well.alpha = this._options.opacity;
	            this.well.width = this._options.wellRadius * 2;
	            this.well.height = this._options.wellRadius * 2;
	            // TODO: Anchor only works on Sprite, not Container. Should add a wellAnchor property to deal with this
	            this.well.anchor.x = 0.5;
	            this.well.anchor.y = 0.5;
	        }
	        else {
	            this.well = new PIXI.Graphics();
	            switch (this._options.axes) {
	                case 'xy':
	                    this.well.beginFill(0xffffff, this._options.opacity);
	                    this.well.drawCircle(0, 0, this._options.wellRadius);
	                    this.well.endFill();
	                    break;
	                case 'x':
	                    this.well.beginFill(0xffffff, this._options.opacity);
	                    this.well.drawRoundedRect(-this._options.wellRadius - this._options.wellRadius * this._options.nubSize, -(this._options.wellRadius * this._options.nubSize), this._options.wellRadius * 2 + this._options.wellRadius * 2 * this._options.nubSize, this._options.wellRadius * 2 * this._options.nubSize, this._options.wellRadius * this._options.nubSize);
	                    this.well.endFill();
	                    break;
	                case 'y':
	                    this.well.beginFill(0xffffff, this._options.opacity);
	                    this.well.drawRoundedRect(-(this._options.wellRadius * this._options.nubSize), -this._options.wellRadius - this._options.wellRadius * this._options.nubSize, this._options.wellRadius * 2 * this._options.nubSize, this._options.wellRadius * 2 + this._options.wellRadius * 2 * this._options.nubSize, this._options.wellRadius * this._options.nubSize);
	                    this.well.endFill();
	                    break;
	                default:
	                    console.warn(this._options);
	                    throw new Error(this._options.axes + ' is not a valid stick axes');
	            }
	        }
	        // Init Nub
	        if (this._options.nub) {
	            this.nub = this._options.nub;
	            this.nub.alpha = this._options.opacity;
	            this.nub.width = this._options.wellRadius * this._options.nubSize * 2;
	            this.nub.height = this._options.wellRadius * this._options.nubSize * 2;
	            // TODO: Anchor only works on Sprite, not Container. Should add a nubAnchor property to deal with this
	            this.nub.anchor.x = 0.5;
	            this.nub.anchor.y = 0.5;
	        }
	        else {
	            this.nub = new PIXI.Graphics();
	            this.nub.beginFill(0xffffff, this._options.opacity);
	            this.nub.drawCircle(0, 0, this._options.wellRadius * this._options.nubSize);
	            this.nub.endFill();
	        }
	        // Add children
	        this.addChild(this.well);
	        this.addChild(this.nub);
	    };
	    return Joystick;
	}(PIXI.Container));
	exports.Joystick = Joystick;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Joystick;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	exports.events = {
	    mouse: {
	        onTouchStart: 'mousedown',
	        onTouchMove: 'mousemove',
	        onTouchEnd: 'mouseup',
	        onTouchEndOutside: 'mouseupoutside'
	    },
	    touch: {
	        onTouchStart: 'touchstart',
	        onTouchMove: 'touchmove',
	        onTouchEnd: 'touchend',
	        onTouchEndOutside: 'touchendoutside'
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.events;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var util_1 = __webpack_require__(1);
	var transformManager_1 = __webpack_require__(7);
	exports.dragListener = {
	    xy: function (event) {
	        transformManager_1.transformManager.mapPositionToPoint(this._axes, event.clientX, event.clientY);
	        this._joystick.toLocal(this._axes, null, this._axes);
	        if (util_1.magnitude(this._axes) > this._options.wellRadius) {
	            util_1.unitVector(this._axes, this._axes);
	            this._joystick.nub.x = this._axes.x * this._options.wellRadius;
	            this._joystick.nub.y = this._axes.y * this._options.wellRadius;
	        }
	        else {
	            this._joystick.nub.x = this._axes.x;
	            this._joystick.nub.y = this._axes.y;
	            this._axes.x /= this._options.wellRadius;
	            this._axes.y /= this._options.wellRadius;
	        }
	        if (this.onTouchMove) {
	            this.onTouchMove(this._axes);
	        }
	        if (this.onAxisChange) {
	            this.onAxisChange(this._axes);
	        }
	    },
	    x: function (event) {
	        transformManager_1.transformManager.mapPositionToPoint(this._axes, event.clientX, event.clientY);
	        this._joystick.toLocal(this._axes, null, this._axes);
	        if (Math.abs(this._axes.x) > this._options.wellRadius) {
	            this._axes.x = util_1.sign(this._axes.x);
	            this._axes.y = 0;
	            this._joystick.nub.x = this._axes.x * this._options.wellRadius;
	            this._joystick.nub.y = 0;
	        }
	        else {
	            this._joystick.nub.x = this._axes.x;
	            this._joystick.nub.y = 0;
	            this._axes.x /= this._options.wellRadius;
	            this._axes.y = 0;
	        }
	        if (this.onTouchMove) {
	            this.onTouchMove(this._axes);
	        }
	        if (this.onAxisChange) {
	            this.onAxisChange(this._axes);
	        }
	    },
	    y: function dragListenerY(event) {
	        transformManager_1.transformManager.mapPositionToPoint(this._axes, event.clientX, event.clientY);
	        this._joystick.toLocal(this._axes, null, this._axes);
	        if (Math.abs(this._axes.y) > this._options.wellRadius) {
	            this._axes.x = 0;
	            this._axes.y = util_1.sign(this._axes.y);
	            this._joystick.nub.x = 0;
	            this._joystick.nub.y = this._axes.y * this._options.wellRadius;
	        }
	        else {
	            this._joystick.nub.x = 0;
	            this._joystick.nub.y = this._axes.y;
	            this._axes.x = 0;
	            this._axes.y /= this._options.wellRadius;
	        }
	        if (this.onTouchMove) {
	            this.onTouchMove(this._axes);
	        }
	        if (this.onAxisChange) {
	            this.onAxisChange(this._axes);
	        }
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exports.dragListener;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Provides a way to get at the InteractionManager.mapPositionToPoint() function from outside of the InteractionManager
	 */
	exports.transformManager = {
	    _renderer: PIXI.SystemRenderer,
	    get renderer() { return this._renderer; },
	    set renderer(value) { this._renderer = value; },
	    mapPositionToPoint: function (point, x, y) {
	        return this._renderer.plugins.interaction.mapPositionToPoint(point, x, y);
	    }
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var util_1 = __webpack_require__(1);
	var joystick_1 = __webpack_require__(4);
	var events_1 = __webpack_require__(5);
	var debug_1 = __webpack_require__(2);
	var drag_listener_1 = __webpack_require__(6);
	function generateColor() {
	    var color = 0;
	    var primary = Math.floor(Math.random() * 3);
	    for (var i = 0; i < 3; i++) {
	        color = color << 8;
	        color += 155 + Math.floor(Math.random() * 100);
	    }
	    return color;
	}
	/***********************/
	/*** Event Listeners ***/
	/***********************/
	function dragListenerXY(event) {
	    if (event.data.identifier != this.identifier)
	        return;
	    if (this.isTouched) {
	        this._joystick.toLocal(event.data.global, null, this._axes);
	        if (util_1.magnitude(this._axes) > this._options.wellRadius) {
	            util_1.unitVector(this._axes, this._axes);
	            this._joystick.nub.x = this._axes.x * this._options.wellRadius;
	            this._joystick.nub.y = this._axes.y * this._options.wellRadius;
	        }
	        else {
	            this._joystick.nub.x = this._axes.x;
	            this._joystick.nub.y = this._axes.y;
	            this._axes.x /= this._options.wellRadius;
	            this._axes.y /= this._options.wellRadius;
	        }
	    }
	    else {
	        this._axes.x = 0;
	        this._axes.y = 0;
	    }
	    if (this.onTouchMove) {
	        this.onTouchMove(this._axes);
	    }
	    if (this.onAxisChange) {
	        this.onAxisChange(this._axes);
	    }
	}
	function dragListenerX(event) {
	    if (!this.isTouched) {
	        this._axes.x = 0;
	        this._axes.y = 0;
	        return;
	    }
	    this._touchData.getLocalPosition(this, this._axes);
	    if (Math.abs(this._axes.x) > this._options.wellRadius) {
	        this._axes.x = util_1.sign(this._axes.x);
	        this._axes.y = 0;
	        this._joystick.nub.x = this._axes.x * this._options.wellRadius;
	        this._joystick.nub.y = 0;
	    }
	    else {
	        this._joystick.nub.x = this._axes.x;
	        this._joystick.nub.y = 0;
	        this._axes.x /= this._options.wellRadius;
	        this._axes.y = 0;
	    }
	    if (this.onTouchMove) {
	        this.onTouchMove({ position: this._axes }); // GARBAGE
	    }
	}
	function dragListenerY(event) {
	    if (!this.isTouched) {
	        this._axes.x = 0;
	        this._axes.y = 0;
	        return;
	    }
	    this._axes.copy(this._touchData.getLocalPosition(this));
	    if (Math.abs(this._axes.y) > this._options.wellRadius) {
	        this._axes.x = 0;
	        this._axes.y = util_1.sign(this._axes.y);
	        this._joystick.nub.x = 0;
	        this._joystick.nub.y = this._axes.y * this._options.wellRadius;
	    }
	    else {
	        this._joystick.nub.x = 0;
	        this._joystick.nub.y = this._axes.y;
	        this._axes.x = 0;
	        this._axes.y /= this._options.wellRadius;
	    }
	    if (this.onTouchMove) {
	        this.onTouchMove(this._axes);
	    }
	}
	var StickArea = (function (_super) {
	    __extends(StickArea, _super);
	    /*******************/
	    /*** Constructor ***/
	    /*******************/
	    function StickArea(x, y, width, height, options) {
	        _super.call(this);
	        this._options = {
	            debug: false,
	            mouse: true,
	            touch: true,
	            axes: 'xy',
	            deadZone: 0,
	            nub: null,
	            nubSize: 0.3,
	            well: null,
	            wellRadius: 50,
	        };
	        this.isTouched = false;
	        this._axes = new PIXI.Point(0, 0);
	        this._registeredEventListeners = [];
	        this.x = x;
	        this.y = y;
	        if (options) {
	            for (var prop in options) {
	                if (options.hasOwnProperty(prop)) {
	                    this._options[prop] = options[prop];
	                }
	            }
	        }
	        this.interactive = true;
	        this._initGraphics(width, height);
	        this._joystick = new joystick_1.default(0, 0, this._options);
	        if (this._options.mouse)
	            this._initEvents('mouse');
	        if (this._options.touch)
	            this._initEvents('touch');
	    }
	    Object.defineProperty(StickArea.prototype, "id", {
	        get: function () { return this._id; },
	        set: function (value) { if (!this._id) {
	            this._id = value;
	        }
	        else {
	            throw new Error('id is readonly');
	        } },
	        enumerable: true,
	        configurable: true
	    });
	    StickArea.prototype._initGraphics = function (width, height) {
	        this.beginFill(generateColor(), this._options.debug ? 0.7 : 0);
	        this.drawRect(0, 0, width, height);
	        this.endFill();
	    };
	    StickArea.prototype._initEvents = function (mouseOrTouch) {
	        var _this = this;
	        // Touch Start
	        this.on(events_1.default[mouseOrTouch].onTouchStart, function (event) {
	            _this.identifier = event.data.identifier;
	            _this._spawnStick(event.data.getLocalPosition(_this));
	            _this.isTouched = true;
	            if (_this.onTouchStart)
	                _this.onTouchStart(_this._axes);
	            event.stopPropagation();
	        });
	        // Touch Drag
	        // Store this eventlistener for removal later
	        // TODO: HOLY HELL DO I NOT NEED TO BIND DRAGLISTNERE?!?!?!!?!??!?
	        if (!this._dragListener)
	            this._dragListener = drag_listener_1.dragListener[this._options.axes];
	        this._registeredEventListeners.push([
	            events_1.default[mouseOrTouch].onTouchMove, function (event) {
	                if (util_1.isMouseEvent(event)) {
	                    if (_this.isTouched)
	                        _this._dragListener(event);
	                }
	                else {
	                    for (var i = 0; i < event.changedTouches.length; i++) {
	                        if (event.changedTouches[i].identifier === _this.identifier) {
	                            _this._dragListener(event.changedTouches[i]);
	                            break;
	                        }
	                    }
	                }
	            }
	        ]);
	        // add the event listener to the window
	        window.addEventListener(events_1.default[mouseOrTouch].onTouchMove, this._registeredEventListeners[this._registeredEventListeners.length - 1][1]);
	        // Touch End
	        // Store this eventlistener for removal later
	        this._registeredEventListeners.push([
	            events_1.default[mouseOrTouch].onTouchEnd, function (event) {
	                if (util_1.isMouseEvent(event)) {
	                    _this.identifier = undefined;
	                    _this.isTouched = false;
	                    _this.resetPosition();
	                    _this.onAxisChange(_this._axes);
	                    _this._despawnStick();
	                    event.stopPropagation();
	                }
	                else {
	                    for (var i = 0; i < event.changedTouches.length; i++) {
	                        if (event.changedTouches[i].identifier === _this.identifier) {
	                            _this.identifier = undefined;
	                            _this.isTouched = false;
	                            _this.resetPosition();
	                            _this.onAxisChange(_this._axes);
	                            _this._despawnStick();
	                            event.stopPropagation();
	                            break;
	                        }
	                    }
	                }
	            }]);
	        // add the event listener to the window
	        window.addEventListener(events_1.default[mouseOrTouch].onTouchEnd, this._registeredEventListeners[this._registeredEventListeners.length - 1][1]);
	    };
	    StickArea.prototype._despawnStick = function () {
	        debug_1.default.log('despawning stick', this);
	        this.removeChild(this._joystick);
	    };
	    StickArea.prototype.dispose = function () {
	        this._registeredEventListeners.forEach(function (arr) {
	            window.removeEventListener(arr[0], arr[1]);
	        });
	    };
	    StickArea.prototype.resetPosition = function () {
	        this._joystick.nub.x = 0;
	        this._joystick.nub.y = 0;
	        this._axes.x = 0;
	        this._axes.y = 0;
	    };
	    StickArea.prototype._spawnStick = function (position) {
	        debug_1.default.log('spawning stick at [' + position.x + ',' + position.y + ']', this);
	        this.addChild(this._joystick);
	        this._joystick.x = position.x;
	        this._joystick.y = position.y;
	        this._joystick.isTouched = true;
	    };
	    return StickArea;
	}(PIXI.Graphics));
	exports.StickArea = StickArea;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = StickArea;


/***/ }
/******/ ])
});
;