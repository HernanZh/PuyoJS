define([
    'puyojs/utils',
    'puyojs/math/vector2',
    'puyojs/game/field',
    'puyojs/game/puyo/colorpuyo'
], function (Utils, Vector2, Field, ColorPuyo) {
    'use strict';
    var Settings = Utils.Settings,
        Constants = Utils.Constants,
        createRedPuyo = function () {
            return ColorPuyo({
                color: Constants.Color.RED
            });
        };
    describe('Field', function () {
        it('should intialize a field', function () {
            var field = Field({
                width: 6,
                height: 12
            });
            expect(field).toBeTruthy();
        });

        it('should be able to add color puyos', function () {
            var field = Field({
                width: 6,
                height: 12
            });
            expect(field.count()).toEqual(0);
            field.addPuyo(0, 0, createRedPuyo());
            expect(field.count()).toEqual(1);
            field.addPuyo(1, 0, createRedPuyo());
            expect(field.count()).toEqual(2);
        });

        it('should able to link color puyos', function () {
            var puyo1 = createRedPuyo(),
                puyo2 = createRedPuyo(),
                puyo3 = createRedPuyo(),
                puyo4 = createRedPuyo(),
                field = Field({
                    width: 6,
                    height: 12
                });
            field.addPuyo(0, 0, puyo1);
            field.addPuyo(1, 0, puyo2);
            field.addPuyo(0, 4, puyo3);
            field.addPuyo(0, 5, puyo4);
            field.linkField(0, 0);
            expect(puyo1.sprite.spriteOffset())
                .toBeVector(Vector2(4 * Settings.Puyo.width, 0));
            expect(puyo2.sprite.spriteOffset())
                .toBeVector(Vector2(8 * Settings.Puyo.width, 0));
            expect(puyo3.sprite.spriteOffset())
                .toBeVector(Vector2(2 * Settings.Puyo.width, 0));
            expect(puyo4.sprite.spriteOffset())
                .toBeVector(Vector2(1 * Settings.Puyo.width, 0));
        });

        it('should be able to drop puyos', function () {
            var field = Field({
                width: 6,
                height: 12
            });
            field.addPuyo(0, 0, createRedPuyo());
            field.addPuyo(1, 1, createRedPuyo());
            field.addPuyo(2, 2, createRedPuyo());
            field.addPuyo(3, 3, createRedPuyo());
            field.addPuyo(4, 4, createRedPuyo());
            field.addPuyo(4, 0, createRedPuyo());
            field.addPuyo(4, 1, createRedPuyo());

            field.dropField();

            expect(field.get(0, 0)).toBeTruthy();
            expect(field.get(1, 0)).toBeTruthy();
            expect(field.get(2, 0)).toBeTruthy();
            expect(field.get(3, 0)).toBeTruthy();
            expect(field.get(4, 0)).toBeTruthy();
            expect(field.get(4, 1)).toBeTruthy();
            expect(field.get(4, 2)).toBeTruthy();
            expect(field.get(4, 3)).toBeFalsy();
            expect(field.get(4, 4)).toBeFalsy();

        });
    });
});