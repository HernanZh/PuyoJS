define('puyojs/game/controller', function () {
    'use strict';
    return function (keys) {
        var controller,
            key,
            // remembers key settings
            keyCodes = {
                keyUp: 0,
                keyDown: 0,
                keyLeft: 0,
                keyRight: 0,
                keyA: 0,
                keyB: 0,
                keyX: 0,
                keyY: 0,
                keyStart: 0,
                keySelect: 0
            },
            // keeps track of how long a key has been pressed
            keyState = {
                up: 0,
                down: 0,
                left: 0,
                right: 0,
                a: 0,
                b: 0,
                x: 0,
                y: 0,
            };

        // init key codes
        for (key in keys) {
            if (keys.hasOwnProperty(key)) {
                keyCodes[key] = keys[key];
                keyState[keys[key]] = 0;
            }
        }

        controller = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            a: 0,
            b: 0,
            x: 0,
            y: 0,
            keyDown: function (evt) {
                switch (evt.keyCode) {
                case keyCodes.keyUp:
                    ++keyState.up;
                    break;
                case keyCodes.keyDown:
                    ++keyState.down;
                    break;
                case keyCodes.keyLeft:
                    ++keyState.left;
                    break;
                case keyCodes.keyRight:
                    ++keyState.right;
                    break;
                case keyCodes.keyA:
                    ++keyState.a;
                    break;
                case keyCodes.keyB:
                    ++keyState.b;
                    break;
                case keyCodes.keyX:
                    ++keyState.x;
                    break;
                case keyCodes.keyY:
                    ++keyState.y;
                    break;
                }
            },
            keyUp: function (evt) {
                switch (evt.keyCode) {
                case keyCodes.keyUp:
                    keyState.up = 0;
                    break;
                case keyCodes.keyDown:
                    keyState.down = 0;
                    break;
                case keyCodes.keyLeft:
                    keyState.left = 0;
                    break;
                case keyCodes.keyRight:
                    keyState.right = 0;
                    break;
                case keyCodes.keyA:
                    keyState.a = 0;
                    break;
                case keyCodes.keyB:
                    keyState.b = 0;
                    break;
                case keyCodes.keyX:
                    keyState.x = 0;
                    break;
                case keyCodes.keyY:
                    keyState.y = 0;
                    break;
                }
            },
            reset: function () {

            },
            update: function () {
                if (keyState.up) {
                    ++controller.up;
                } else {
                    controller.up = 0;
                }
                if (keyState.down) {
                    ++controller.down;
                } else {
                    controller.down = 0;
                }
                if (keyState.left) {
                    ++controller.left;
                } else {
                    controller.left = 0;
                }
                if (keyState.right) {
                    ++controller.right;
                } else {
                    controller.right = 0;
                }
                if (keyState.a) {
                    ++controller.a;
                } else {
                    controller.a = 0;
                }
                if (keyState.b) {
                    ++controller.b;
                } else {
                    controller.b = 0;
                }
                if (keyState.x) {
                    ++controller.x;
                } else {
                    controller.x = 0;
                }
                if (keyState.y) {
                    ++controller.y;
                } else {
                    controller.y = 0;
                }
            }
        };
        return controller;
    };
});