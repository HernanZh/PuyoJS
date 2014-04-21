define('puyojs/game/puyoappearance', [
    'puyojs/math/vector2'
], function (Vector2) {
    'use strict';
    return function (settings) {
        var module = {};
        if (settings.type === 'colorPuyo') {
            module = {
                size: Vector(32, 32),
                spriteOffset: Vector
            };
        }
        return module;
    };
});