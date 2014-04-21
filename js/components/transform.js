define('puyojs/components/transform', [
    'puyojs/math/vector2'
], function (Vector2) {
    'use strict';
    return function (position, origin, scale, angle, transparency) {
        return {
            position: position || Vector2(0, 0),
            origin: origin || Vector2(0, 0),
            scale: scale || Vector2(1, 1),
            angle: angle || 0,
            transparency: transparency || 1,
            save: function (context) {
                context.save();
                context.translate(this.position.x, this.position.y);
                if (this.transparency != 1) {
                    context.globalAlpha = this.transparency;
                }
                if (this.angle) {
                    context.rotate(this.angle);
                }
                if (this.scale.x != 1 || this.scale.y != 1) {
                    context.scale(this.scale.x, this.scale.y);
                }
                context.translate(-this.origin.x, -this.origin.y);
            },
            restore: function (context) {
                context.restore();
            }
        }
    }
});