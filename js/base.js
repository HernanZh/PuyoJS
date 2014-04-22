define('puyojs/components/base', [
    'puyojs/components/transform',
    'puyojs/utils'
], function (Transform, Utils) {
    'use strict';
    return function () {
        var transform = Transform(),
            components = [],
            parent = null,
            base = {
                init: function (p) {
                    parent = p;
                },
                update: function () {
                    var i, l, fn;
                    for (i = 0, l = components.length; i < l; ++i) {
                        if (fn = components[i].update) {
                            fn();
                        }
                    }
                },
                draw: function (context) {
                    var i, l, fn;
                    transform.save(context);
                    for (i = 0, l = components.length; i < l; ++i) {
                        if (fn = components[i].draw) {
                            fn(context);
                        }
                    }
                    transform.restore(context);
                },
                transform: function () {
                    return transform;
                },
                attach: function (obj, name) {
                    components.push(obj);
                    // make attachment public if name is supplied
                    if (Utils.isDefined(name)) {
                        base[name] = obj;
                    }
                    if (Utils.isDefind(obj.init)) {
                        obj.init(this);
                    }
                    return base;
                },
                extend: function (obj) {
                    var prop;
                    for (prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            if (this.hasOwnProperty(prop)) {
                                throw 'Object already has this property';
                            }
                            this[prop] = obj[prop];
                        }
                    }
                    return this;
                }
            };
        return base;
    }
});