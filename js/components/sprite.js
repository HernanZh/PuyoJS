define('puyojs/components/sprite', [
    'puyojs/math/vector2',
    'puyojs/components/transform'
], function (Vector2, Transform) {
    'use strict';
    return function (settings) {
        var visible = true,
            image = settings.image,
            spriteOffset = settings.spriteOffset || Vector2(0, 0),
            size = settings.size || Vector2(image.width, image.height),
            obj = {
                update: function () {},
                draw: function (context) {
                    if (!visible) {
                        return;
                    }
                    if (image) {
                        context.drawImage(
                            image,
                            spriteOffset.x,
                            spriteOffset.y,
                            size.x,
                            size.y,
                            0,
                            0,
                            size.x,
                            size.y
                        );
                    }
                },
                size: function () {
                    return size;
                },
                setSize: function (newSize) {
                    size = newSize;
                },
                spriteOffset: function () {
                    return spriteOffset;
                },
                setSpriteOffset: function (newOffset) {
                    spriteOffset = newOffset;
                },
                visible: function () {
                    return visible;
                },
                setVisible: function (bool) {
                    visible = bool;
                }
            };
        return obj;
    };
});