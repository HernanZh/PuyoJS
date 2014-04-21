define('puyojs/loader', function () {
    'use strict';
    var loaded = false,
        loadedAssets = {
            image: {},
            audio: {},
            json: {}
        },
        loadImage = function (name, source, callback) {
            var image = new Image();
            image.src = source;
            image.addEventListener('load', callback, false);
            loadedAssets.image[name] = image;
        };
    return {
        load: function (assets, callback) {
            var items = 0,
                loaded = 0,
                image;
            for (image in assets.images) {
                if (assets.images.hasOwnProperty(image)) {
                    ++items;
                    loadImage(image, assets.images[image], function () {
                        ++loaded;
                        if (loaded === items) {
                            console.log('done');
                            callback();
                        }
                    });
                }
            }
        },
        getImage: function (name) {
            return loadedAssets.image[name];
        }
    };
});