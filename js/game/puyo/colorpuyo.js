define('puyojs/game/puyo/colorpuyo', [
    'puyojs/utils',
    'puyojs/loader',
    'puyojs/math/vector2',
    'puyojs/components/base',
    'puyojs/components/sprite',
    'puyojs/components/puyo'
], function (Utils, Loader, Vector2, Base, Sprite, Puyo) {
    'use strict';
    var Settings = Utils.Settings,
        Constants = Utils.Constants;
    return function (settings) {
        var color = settings.color,
            linkUp = false,
            linkDown = false,
            linkLeft = false,
            linkRight = false,
            sprite = Sprite({
                image: Loader.getImage('puyo'),
                size: Vector2(Settings.Puyo.width, Settings.Puyo.height),
                spriteOffset: Vector2(0, settings.color * Settings.Puyo.height)
            }),
            puyo = Base();
        // basepuyo component
        Puyo(puyo, {
            type: Constants.Puyo.COLOR,
            onBounceEnd: function (field) {
                field.searchLink(puyo.indexX(), puyo.indexY());
            }
        });
        // sprite
        puyo.attach(sprite, 'sprite');
        // set origin to bottom
        puyo.setOrigin(Vector2(Settings.Puyo.width / 2, Settings.Puyo.height));

        // public
        puyo.extend({
            color: function () {
                return color;
            },
            updateSprite: function () {
                var x = Settings.Puyo.width * (linkDown + (linkUp << 1) + (linkRight << 2) + (linkLeft << 3)),
                    y = Settings.Puyo.height * settings.color;
                this.sprite.setSpriteOffset(Vector2(x, y));
            },
            setLink: function (dir) {
                switch (dir) {
                case Constants.Direction.UP:
                    linkUp = true;
                    break;
                case Constants.Direction.DOWN:
                    linkDown = true;
                    break;
                case Constants.Direction.LEFT:
                    linkLeft = true;
                    break;
                case Constants.Direction.RIGHT:
                    linkRight = true;
                    break;
                }
                this.updateSprite();
            },
            unsetLink: function (dir) {
                switch (dir) {
                case Constants.Direction.UP:
                    linkUp = false;
                    break;
                case Constants.Direction.DOWN:
                    linkDown = false;
                    break;
                case Constants.Direction.LEFT:
                    linkLeft = false;
                    break;
                case Constants.Direction.RIGHT:
                    linkRight = false;
                    break;
                }
                this.updateSprite();
            }
        })
        return puyo;
    };
});