if (this === window && !window.PIXI){
    throw new Error('PIXI not found! If you are using PixiStick without bundling (i.e. loading pixi-stick.js via <script> tags), ensure that pixi-stick.js is loaded AFTER pixi.js ');
}

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('pixi.js')) :
    typeof define === 'function' && define.amd ? define(['pixi.js'], factory) :
    (global.PixiStick = factory(global.PIXI));
}(this, (function (PIXI$1) { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function magnitude(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}
function unitVector(vec, outVec) {
    outVec = outVec || new PIXI$1.Point();
    var mag = magnitude(vec);
    outVec.x = vec.x / mag;
    outVec.y = vec.y / mag;
    return outVec;
}
function sign(value) {
    return value ? value < 0 ? -1 : 1 : null;
}
function isMouseEvent(event) {
    return event.button !== undefined;
}

/****************************/
/*** The Stick Controller ***/
/****************************/
var GeneralController = function (_super) {
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
            wellRadius: 50
        };
        this.isTouched = false;
        this._axes = new PIXI$1.Point(0, 0);
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
        if (this._options.mouse) this._initEvents('mouse');
        if (this._options.touch) this._initEvents('touch');
    }
    Object.defineProperty(GeneralController.prototype, "id", {
        get: function get() {
            return this._id;
        },
        set: function set(value) {
            if (!this._id) {
                this._id = value;
            } else {
                throw new Error('id is readonly');
            }
        },
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
     * listeners on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the original recipient of
     * TouchStart so the StickController will not receive the TouchEnd event from the PIXI event system if the
     * user's finger is not over the StickController when they release)
     **/
    GeneralController.prototype._processTouchStart = function (event) {
        this.identifier = event.data.identifier;
        this.isTouched = true;
        if (isMouseEvent(event.data.originalEvent)) {
            this._dragListener(event.data.originalEvent);
        } else {
            this._dragListener(event.data.originalEvent.changedTouches[event.data.identifier]);
        }
        
        if (this.onTouchStart) this.onTouchStart(this._axes);
        return true;
    };
    GeneralController.prototype._processTouchMove = function (event) {
        if (isMouseEvent(event)) {
            if (this.isTouched) this._dragListener(event);
            return true;
        } else {
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
        if (isMouseEvent(event)) {
            this.identifier = undefined;
            this.isTouched = false;
            this.resetPosition();
            this.onAxisChange(this._axes);
            event.stopPropagation();
            return true;
        } else {
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
}(PIXI$1.Container);

/**
 * The graphical component. Contains no business logic (which is handled in StickController)
 */
var Joystick = function (_super) {
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
        } else {
            this.well = new PIXI$1.Graphics();
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
        } else {
            this.nub = new PIXI$1.Graphics();
            this.nub.beginFill(0xffffff, this._options.opacity);
            this.nub.drawCircle(0, 0, this._options.wellRadius * this._options.nubSize);
            this.nub.endFill();
        }
        // Add children
        this.addChild(this.well);
        this.addChild(this.nub);
    };
    return Joystick;
}(PIXI$1.Container);

/************************/
/*** The Monkey Patch ***/
/************************/
/* We monkey patch autoDetectRenderer() so that
 * we keep a reference to the mapPositionToPoint method
 * of the most recently created SystemRenderer
*/
var mapPositionToPoint;
PIXI.autoDetectRenderer = function (func) {
    return function (width, height, options, noWebGL) {
        var renderer = window.capturedRenderer = func(width, height, options, noWebGL);
        mapPositionToPoint = renderer.plugins.interaction.mapPositionToPoint.bind(renderer.plugins.interaction);
        return renderer;
    };
}(PIXI.autoDetectRenderer);
var dragListener = {
    xy: function xy(event) {
        mapPositionToPoint(this._axes, event.clientX, event.clientY);
        this._joystick.toLocal(this._axes, null, this._axes);
        if (magnitude(this._axes) > this._options.wellRadius) {
            unitVector(this._axes, this._axes);
            this._joystick.nub.x = this._axes.x * this._options.wellRadius;
            this._joystick.nub.y = this._axes.y * this._options.wellRadius;
        } else {
            this._joystick.nub.x = this._axes.x;
            this._joystick.nub.y = this._axes.y;
            this._axes.x /= this._options.wellRadius;
            this._axes.y /= this._options.wellRadius;
        }
        if (this.onTouchMove) this.onTouchMove(this._axes);
        if (this.onAxisChange) this.onAxisChange(this._axes);
    },
    x: function x(event) {
        mapPositionToPoint(this._axes, event.clientX, event.clientY);
        this._joystick.toLocal(this._axes, null, this._axes);
        if (Math.abs(this._axes.x) > this._options.wellRadius) {
            this._axes.x = sign(this._axes.x);
            this._axes.y = 0;
            this._joystick.nub.x = this._axes.x * this._options.wellRadius;
            this._joystick.nub.y = 0;
        } else {
            this._joystick.nub.x = this._axes.x;
            this._joystick.nub.y = 0;
            this._axes.x /= this._options.wellRadius;
            this._axes.y = 0;
        }
        if (this.onTouchMove) this.onTouchMove(this._axes);
        if (this.onAxisChange) this.onAxisChange(this._axes);
    },
    y: function dragListenerY(event) {
        mapPositionToPoint(this._axes, event.clientX, event.clientY);
        this._joystick.toLocal(this._axes, null, this._axes);
        if (Math.abs(this._axes.y) > this._options.wellRadius) {
            this._axes.x = 0;
            this._axes.y = sign(this._axes.y);
            this._joystick.nub.x = 0;
            this._joystick.nub.y = this._axes.y * this._options.wellRadius;
        } else {
            this._joystick.nub.x = 0;
            this._joystick.nub.y = this._axes.y;
            this._axes.x = 0;
            this._axes.y /= this._options.wellRadius;
        }
        if (this.onTouchMove) this.onTouchMove(this._axes);
        if (this.onAxisChange) this.onAxisChange(this._axes);
    }
};

var events = {
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

/****************************/
/*** The Stick Controller ***/
/****************************/
var StickController = function (_super) {
    __extends(StickController, _super);
    /*******************/
    /*** Constructor ***/
    /*******************/
    function StickController(x, y, options) {
        _super.call(this, x, y, options);
    }
    StickController.prototype._init = function () {
        this._joystick = new Joystick(0, 0, this._options); // ERR: x and y should be computed based on stick type, i.e. static/semi/dynamic
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
        this.on(events[mouseOrTouch].onTouchStart, function (event) {
            _this._processTouchStart(event);
        });
        // TouchMove
        if (!this._dragListener) this._dragListener = dragListener[this._options.axes];
        this._addWindowListener(events[mouseOrTouch].onTouchMove, function (event) {
            _this._processTouchMove(event);
        });
        // Touch End
        this._addWindowListener(events[mouseOrTouch].onTouchEnd, function (event) {
            _this._processTouchEnd(event);
        });
    };
    return StickController;
}(GeneralController);

function generateColor() {
    var color = 0;
    var primary = Math.floor(Math.random() * 3);
    for (var i = 0; i < 3; i++) {
        color = color << 8;
        color += 155 + Math.floor(Math.random() * 100);
    }
    return color;
}
var StickAreaController = function (_super) {
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
            wellRadius: 50
        };
        if (options) {
            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    this._options[prop] = options[prop];
                }
            }
        }
        this._area = new PIXI$1.Graphics();
        this._area.beginFill(generateColor(), this._options.debug ? 0.7 : 0);
        this._area.drawRect(0, 0, width, height);
        this._area.endFill();
        this.addChild(this._area);
    }
    StickAreaController.prototype._init = function () {
        this._joystick = new Joystick(0, 0, this._options);
    };
    StickAreaController.prototype._initEvents = function (mouseOrTouch) {
        var _this = this;
        // Touch Start
        this.on(events[mouseOrTouch].onTouchStart, function (event) {
            _this._spawnStick(event.data.getLocalPosition(_this));
            _this._processTouchStart(event);
        });
        // TouchMove
        if (!this._dragListener) this._dragListener = dragListener[this._options.axes];
        this._addWindowListener(events[mouseOrTouch].onTouchMove, function (event) {
            _this._processTouchMove(event);
        });
        // Touch End
        this._addWindowListener(events[mouseOrTouch].onTouchEnd, function (event) {
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
}(GeneralController);

var pixiStick = {
    StickController: StickController,
    StickAreaController: StickAreaController
};

return pixiStick;

})));
