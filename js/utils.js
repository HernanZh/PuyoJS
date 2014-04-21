define('puyojs/utils', function () {
    'use strict';
    var utils = {
        Constants: {
            Color: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
                YELLOW: 3,
                PURPLE: 4
            },
            Puyo: {
                COLOR: 0,
                NUISANCE: 1
            },
            MovePuyo: {
                DOUBLET: 0,
                TRIPLET: 1,
                QUADRUPLET: 2,
                BIG: 3,
                TRIPLETR: 4
            },
            Direction: {
                UP: 0,
                DOWN: 1,
                LEFT: 2,
                RIGHT: 3
            },
            FallState: {
                NONE: 0,
                READY: 1,
                FALLING: 2
            },
            Phase: {
                PICKCOLORS: -2,
                IDLE: -1,
                GETREADY: 0,
                PREPARE: 1,

                MOVE: 10,
                CREATEPUYO: 20,
                DROPPUYO: 21,
                FALLPUYO: 22,

                SEARCHCHAIN: 30,
                DESTROYPUYO: 32,
                GARBAGE: 33,

                CHECKALLCLEAR: 40,
                DROPGARBAGE: 41,
                FALLGARBAGE: 42,
                CHECKLOSER: 43,
                WAITGARBAGE: 45, //wait until receving garbage message
                WAITCONFIRMGARBAGE: 46,

                CHECKFEVER: 50,
                PREPAREFEVER: 51,
                DROPFEVER: 52,
                CHECKENDFEVER: 53,
                ENDFEVER: 54,
                CHECKENDFEVERONLINE: 55, //wait until receiving end fever message

                LOSEDROP: 60,
                WIN_IDLE: 61,
                WAITLOSE: 62 //online player loses: wait until receiving lose message
            }
        },
        Settings: {
            Puyo: {
                width: 72,
                height: 72,
                spacingX: 0,
                spacingY: -4
            }
        },
        requestAnimationFrame: function () {
            window.requestAnimationFrame.apply(window, arguments);
        },
        isDefined: function (obj) {
            return obj !== void 0;
        },
        getRandom: function () {

        },
        toRadian: function (degree) {
            return degree * Math.PI / 180;
        }
    };
    // http://www.makeitgo.ws/articles/animationframe/
    (function () {
        var lastFrame, method, now, queue, requestAnimationFrame, timer, vendor, _i, _len, _ref, _ref1;
        method = 'native';
        now = Date.now || function () {
            return new Date().getTime();
        };
        requestAnimationFrame = window.requestAnimationFrame;
        _ref = ['webkit', 'moz', 'o', 'ms'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            vendor = _ref[_i];
            if (!(requestAnimationFrame != null)) {
                requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
            }
        }
        if (!(requestAnimationFrame != null)) {
            method = 'timer';
            lastFrame = 0;
            queue = timer = null;
            requestAnimationFrame = function (callback) {
                var fire, nextFrame, time;
                if (queue != null) {
                    queue.push(callback);
                    return;
                }
                time = now();
                nextFrame = Math.max(0, 16.66 - (time - lastFrame));
                queue = [callback];
                lastFrame = time + nextFrame;
                fire = function () {
                    var cb, q, _j, _len1;
                    q = queue;
                    queue = null;
                    for (_j = 0, _len1 = q.length; _j < _len1; _j++) {
                        cb = q[_j];
                        cb(lastFrame);
                    }
                };
                timer = setTimeout(fire, nextFrame);
            };
        }
        requestAnimationFrame(function (time) {
            var _ref1;
            if ((((_ref1 = window.performance) != null ? _ref1.now : void 0) != null) && time < 1e12) {
                requestAnimationFrame.now = function () {
                    return window.performance.now();
                };
                requestAnimationFrame.method = 'native-highres';
            } else {
                requestAnimationFrame.now = now;
            }
        });
        requestAnimationFrame.now = ((_ref1 = window.performance) != null ? _ref1.now : void 0) != null ? (function () {
            return window.performance.now();
        }) : now;
        requestAnimationFrame.method = method;
        window.requestAnimationFrame = requestAnimationFrame;
    })();

    return utils;
});