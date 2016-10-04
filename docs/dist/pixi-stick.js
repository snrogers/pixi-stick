(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("PIXI"));
	else if(typeof define === 'function' && define.amd)
		define("PixiStick", ["PIXI"], factory);
	else if(typeof exports === 'object')
		exports["PixiStick"] = factory(require("PIXI"));
	else
		root["PixiStick"] = factory(root["PIXI"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__) {
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
	var stick_controller_1 = __webpack_require__(1);
	exports.StickController = stick_controller_1.StickController;
	var stick_area_controller_1 = __webpack_require__(8);
	exports.StickAreaController = stick_area_controller_1.StickAreaController;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var general_controller_1 = __webpack_require__(2);
	var joystick_1 = __webpack_require__(5);
	var drag_listener_1 = __webpack_require__(6);
	var events_1 = __webpack_require__(7);
	/****************************/
	/*** The Stick Controller ***/
	/****************************/
	var StickController = (function (_super) {
	    __extends(StickController, _super);
	    /*******************/
	    /*** Constructor ***/
	    /*******************/
	    function StickController(x, y, options) {
	        _super.call(this, x, y, options);
	    }
	    StickController.prototype._init = function () {
	        this._joystick = new joystick_1.Joystick(0, 0, this._options); // ERR: x and y should be computed based on stick type, i.e. static/semi/dynamic
	        this.addChild(this._joystick);
	    };
	    /**
	     * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
	     * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
	     * listener on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
	     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the original recipient of
	     * TouchStare so the StickController will not receive the TouchEnd event from the PIXI event system if the
	     * user's finger is not over the StickController when they release)
	     **/
	    StickController.prototype._initEvents = function (mouseOrTouch) {
	        var _this = this;
	        // Touch Start
	        this.on(events_1.events[mouseOrTouch].onTouchStart, function (event) {
	            _this._processTouchStart(event);
	        });
	        // TouchMove
	        if (!this._dragListener)
	            this._dragListener = drag_listener_1.dragListener[this._options.axes];
	        this._addWindowListener(events_1.events[mouseOrTouch].onTouchMove, function (event) {
	            _this._processTouchMove(event);
	        });
	        // Touch End
	        this._addWindowListener(events_1.events[mouseOrTouch].onTouchEnd, function (event) {
	            _this._processTouchEnd(event);
	        });
	    };
	    return StickController;
	}(general_controller_1.GeneralController));
	exports.StickController = StickController;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var util_1 = __webpack_require__(3);
	var PIXI = __webpack_require__(4);
	/****************************/
	/*** The Stick Controller ***/
	/****************************/
	var GeneralController = (function (_super) {
	    __extends(GeneralController, _super);
	    /*******************/
	    /*** Constructor ***/
	    /*******************/
	    function GeneralController(x, y, options) {
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
	        this.interactive = true;
	        this._init();
	        if (this._options.mouse)
	            this._initEvents('mouse');
	        if (this._options.touch)
	            this._initEvents('touch');
	    }
	    Object.defineProperty(GeneralController.prototype, "id", {
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
	    /** Adds a listener to the window and keeps a reference to it so the listener can be removed via dispose() */
	    GeneralController.prototype._addWindowListener = function (eventString, func) {
	        this._registeredEventListeners.push([eventString, func]);
	        window.addEventListener(eventString, func);
	    };
	    /**
	     * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
	     * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
	     * listener on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
	     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the original recipient of
	     * TouchStare so the StickController will not receive the TouchEnd event from the PIXI event system if the
	     * user's finger is not over the StickController when they release)
	     **/
	    GeneralController.prototype._processTouchStart = function (event) {
	        this.identifier = event.data.identifier;
	        this.isTouched = true;
	        if (util_1.isMouseEvent(event.data.originalEvent)) {
	            this._dragListener(event.data.originalEvent);
	        }
	        else {
	            this._dragListener(event.data.originalEvent.changedTouches[event.data.identifier]);
	        }
	        ;
	        if (this.onTouchStart)
	            this.onTouchStart(this._axes);
	        return true;
	    };
	    GeneralController.prototype._processTouchMove = function (event) {
	        if (util_1.isMouseEvent(event)) {
	            if (this.isTouched)
	                this._dragListener(event);
	            return true;
	        }
	        else {
	            for (var i = 0; i < event.changedTouches.length; i++) {
	                if (event.changedTouches[i].identifier === this.identifier) {
	                    this._dragListener(event.changedTouches[i]);
	                    return true;
	                }
	            }
	        }
	        return false;
	    };
	    GeneralController.prototype._processTouchEnd = function (event) {
	        if (util_1.isMouseEvent(event)) {
	            this.identifier = undefined;
	            this.isTouched = false;
	            this.resetPosition();
	            this.onAxisChange(this._axes);
	            event.stopPropagation();
	            return true;
	        }
	        else {
	            for (var i = 0; i < event.changedTouches.length; i++) {
	                if (event.changedTouches[i].identifier === this.identifier) {
	                    this.identifier = undefined;
	                    this.isTouched = false;
	                    this.resetPosition();
	                    this.onAxisChange(this._axes);
	                    event.stopPropagation();
	                    return true;
	                }
	            }
	        }
	        return false;
	    };
	    // Removes all window eventlisteners that this instance has registered
	    GeneralController.prototype.dispose = function () {
	        this._registeredEventListeners.forEach(function (arr) {
	            window.removeEventListener(arr[0], arr[1]);
	        });
	    };
	    GeneralController.prototype.resetPosition = function () {
	        this._joystick.nub.x = 0;
	        this._joystick.nub.y = 0;
	        this._axes.x = 0;
	        this._axes.y = 0;
	    };
	    return GeneralController;
	}(PIXI.Container));
	exports.GeneralController = GeneralController;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var PIXI = __webpack_require__(4);
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
	function isTouchEvent(event) {
	    return event.changedTouches !== undefined;
	}
	exports.isTouchEvent = isTouchEvent;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var PIXI = __webpack_require__(4);
	/**
	 * The graphical component. Contains no business logic (which is handled in StickController)
	 */
	var Joystick = (function (_super) {
	    __extends(Joystick, _super);
	    function Joystick(x, y, options) {
	        _super.call(this);
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var util_1 = __webpack_require__(3);
	/************************/
	/*** The Monkey Patch ***/
	/************************/
	/* We monkey patch autoDetectRenderer() so that
	 * we keep a reference to the mapPositionToPoint method
	 * of the most recently created SystemRenderer
	*/
	var mapPositionToPoint;
	PIXI.autoDetectRenderer = (function (func) {
	    return function (width, height, options, noWebGL) {
	        var renderer = window.capturedRenderer = func(width, height, options, noWebGL);
	        mapPositionToPoint = renderer.plugins.interaction.mapPositionToPoint.bind(renderer.plugins.interaction);
	        return renderer;
	    };
	})(PIXI.autoDetectRenderer);
	exports.dragListener = {
	    xy: function (event) {
	        mapPositionToPoint(this._axes, event.clientX, event.clientY);
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
	        if (this.onTouchMove)
	            this.onTouchMove(this._axes);
	        if (this.onAxisChange)
	            this.onAxisChange(this._axes);
	    },
	    x: function (event) {
	        mapPositionToPoint(this._axes, event.clientX, event.clientY);
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
	        if (this.onTouchMove)
	            this.onTouchMove(this._axes);
	        if (this.onAxisChange)
	            this.onAxisChange(this._axes);
	    },
	    y: function dragListenerY(event) {
	        mapPositionToPoint(this._axes, event.clientX, event.clientY);
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
	        if (this.onTouchMove)
	            this.onTouchMove(this._axes);
	        if (this.onAxisChange)
	            this.onAxisChange(this._axes);
	    }
	};


/***/ },
/* 7 */
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var joystick_1 = __webpack_require__(5);
	var general_controller_1 = __webpack_require__(2);
	var drag_listener_1 = __webpack_require__(6);
	var events_1 = __webpack_require__(7);
	var PIXI = __webpack_require__(4);
	function generateColor() {
	    var color = 0;
	    var primary = Math.floor(Math.random() * 3);
	    for (var i = 0; i < 3; i++) {
	        color = color << 8;
	        color += 155 + Math.floor(Math.random() * 100);
	    }
	    return color;
	}
	var StickAreaController = (function (_super) {
	    __extends(StickAreaController, _super);
	    /*******************/
	    /*** Constructor ***/
	    /*******************/
	    function StickAreaController(x, y, width, height, options) {
	        _super.call(this, x, y, options);
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
	        if (options) {
	            for (var prop in options) {
	                if (options.hasOwnProperty(prop)) {
	                    this._options[prop] = options[prop];
	                }
	            }
	        }
	        this._area = new PIXI.Graphics();
	        this._area.beginFill(generateColor(), this._options.debug ? 0.7 : 0);
	        this._area.drawRect(0, 0, width, height);
	        this._area.endFill();
	        this.addChild(this._area);
	    }
	    StickAreaController.prototype._init = function () {
	        this._joystick = new joystick_1.Joystick(0, 0, this._options);
	    };
	    StickAreaController.prototype._initEvents = function (mouseOrTouch) {
	        var _this = this;
	        // Touch Start
	        this.on(events_1.events[mouseOrTouch].onTouchStart, function (event) {
	            _this._spawnStick(event.data.getLocalPosition(_this));
	            _this._processTouchStart(event);
	        });
	        // TouchMove
	        if (!this._dragListener)
	            this._dragListener = drag_listener_1.dragListener[this._options.axes];
	        this._addWindowListener(events_1.events[mouseOrTouch].onTouchMove, function (event) {
	            _this._processTouchMove(event);
	        });
	        // Touch End
	        this._addWindowListener(events_1.events[mouseOrTouch].onTouchEnd, function (event) {
	            if (_this._processTouchEnd(event)) {
	                _this._despawnStick();
	            }
	        });
	    };
	    StickAreaController.prototype._despawnStick = function () {
	        this._area.removeChild(this._joystick);
	    };
	    StickAreaController.prototype._spawnStick = function (position) {
	        this._area.addChild(this._joystick);
	        this._joystick.x = position.x;
	        this._joystick.y = position.y;
	    };
	    return StickAreaController;
	}(general_controller_1.GeneralController));
	exports.StickAreaController = StickAreaController;


/***/ }
/******/ ])
});
;