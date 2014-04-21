(function () {
    var specs = [
        'spechelper',
        'spec/game/puyo/colorpuyo',
        'spec/game/field'
    ];

    require.config({
        baseUrl: '.',
        paths: {
            puyojs: '../js',
            spec: 'specs',
            jasmine: 'jasmine-2.0.0-rc5/jasmine',
            'jasmine-html': 'jasmine-2.0.0-rc5/jasmine-html',
            boot: 'jasmine-2.0.0-rc5/boot'
        },
        shim: {
            'jasmine': {
                exports: 'window.jasmineRequire'
            },
            'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
            },
            'boot': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
            }
        }
    });

    require([
        'boot',
    ], function () {
        // Load the specs
        require(specs, function () {
            // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
            window.onload();
        });
    });
})();