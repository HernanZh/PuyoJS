define('puyojs/inputmanager', function () {
    'use strict';
    var controllers = [];
    return {
        onKeyDown: function (evt) {
            var i,
                l;
            for (i = 0, l = controllers.length; i < l; ++i) {
                controllers[i].keyDown(evt);                
            }
        },
        onKeyUp: function (evt) {
            var i,
                l;
            for (i = 0, l = controllers.length; i < l; ++i) {
                controllers[i].keyUp(evt);                
            }
        },
        onPointerDown: function (evt) {

        },
        onPointerUp: function (evt) {

        },
        onPointerMove: function (evt) {

        },
        addController: function (controller) {
            controllers.push(controller);
        }
    };
});