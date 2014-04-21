define('puyojs/components/base', [
    'puyojs/components/transform',
    'puyojs/utils'
], function (Transform, Utils) {
    'use strict';
    return function (settings) {
        var transform = Transform(),
            components = [],
            parent = null,
            base = {
                transform: function () {
                    return transform;
                },
                position: function () {
                    return transform.position;
                },
                setPosition: function (position) {
                    transform.position = position;
                },
                scale: function () {
                    return transform.scale;
                },
                setScale: function (scale) {
                    transform.scale = scale;
                },
                origin: function () {
                    return transform.origin;
                },
                setOrigin: function (origin) {
                    transform.origin = origin;
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
                    var i,
                        l,
                        fn;
                    transform.save(context);
                    for (i = 0, l = components.length; i < l; ++i) {
                        if (fn = components[i].draw) {
                            fn(context);
                        }
                    }
                    transform.restore(context);
                },
                attach: function (obj, name) {
                    components.push(obj);
                    // make attachment public if name is supplied
                    if (Utils.isDefined(name)) {
                        base[name] = obj;
                    }
                    // call init, at this point a component can retrieve the parent
                    if (obj.init) {
                        obj.init(this);
                    }
                    return base;
                },
                extend: function (obj) {
                    var prop;
                    for (prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            this[prop] = obj[prop];
                        }
                    }
                    return this;
                }
            };
        return base;
    }
});