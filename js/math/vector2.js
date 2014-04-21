define('puyojs/math/vector2', function () {
    var module = function (x, y) {
        return {
            x: x,
            y: y,
            add: function (vector) {
                return module(this.x + vector.x, this.y + vector.y);
            },
            addTo: function (vector) {
                this.x += vector.x;
                this.y += vector.y;
            }
        };
    };
    return module;
});