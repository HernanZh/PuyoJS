define([
    'puyojs/utils',
    'puyojs/math/vector2',
    'puyojs/game/puyo/colorpuyo'
], function (Utils, Vector2, ColorPuyo) {
    'use strict';
    var Constants = Utils.Constants;
    describe('ColorPuyo', function () {
        it('should initialize a color puyo', function () {
            var puyo = ColorPuyo({
                color: Constants.Color.GREEN
            });
            expect(puyo.puyo).toBeTruthy();
            expect(puyo.color()).toEqual(Constants.Color.GREEN);
        });
    });
});