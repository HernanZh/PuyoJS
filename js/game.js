define('puyojs/game', [
    'puyojs/utils',
    'puyojs/components/base',
    'puyojs/loader',
    'puyojs/inputmanager',
    'puyojs/game/playermanager'
], function (Utils, Base, Loader, InputManager, PlayerManager) {
    'use strict';
    return function () {
        var lastTime = new Date().getTime(),
            cumulativeTime = 1000 / 60,
            canvas,
            context,
            playerManager = PlayerManager(),
            setupEventListeners = function () {
                window.addEventListener('mousedown', function (evt) {
                    evt.preventDefault();
                    InputManager.onPointerDown(evt);
                }, false);
                window.addEventListener('mousemove', function (evt) {
                    evt.preventDefault();
                    InputManager.onPointerMove(evt);
                }, false);
                window.addEventListener('mouseup', function (evt) {
                    evt.preventDefault();
                    InputManager.onPointerUp(evt);
                }, false);
                // listen for touches
                window.addEventListener('touchstart', function (evt) {
                    evt.preventDefault();
                    InputManager.onPointerDown(evt);
                }, false);
                window.addEventListener('touchmove', function (evt) {
                    evt.preventDefault();
                    InputManager.onPointerMove(evt);
                }, false);
                window.addEventListener('touchend', function (evt) {
                    evt.preventDefault();
                    InputManager.onPointerUp(evt);
                }, false);
                //keyboard controls
                window.addEventListener('keydown', function (evt) {
                    evt.preventDefault();
                    InputManager.onKeyDown(evt);
                }, false);
                window.addEventListener('keyup', function (evt) {
                    evt.preventDefault();
                    InputManager.onKeyUp(evt);
                }, false);
            },
            mainNode = Base().attach({
                update: function () {

                },
                draw: function (context) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    if (window.debugText) {
                        context.font = '32px Arial';
                        context.fillText(window.debugText, 32, 32);
                    }
                }
            }),
            mainLoop = function () {
                var currentTime = new Date().getTime(),
                    deltaTime = currentTime - lastTime;
                lastTime = currentTime;
                cumulativeTime += deltaTime;
                while (cumulativeTime >= 1000 / 60) {
                    cumulativeTime -= 1000 / 60;
                    mainNode.update();
                }
                mainNode.draw(context);
                Utils.requestAnimationFrame(mainLoop);
            };

        setupEventListeners();
        mainNode.attach(playerManager);

        return {
            init: function (settings) {
                var Puyo = Utils.Settings.Puyo,
                    onLoad = function () {
                        // create players        
                        playerManager.addPlayer();

                        // start game
                        mainLoop();
                    };
                // init canvas
                if ((canvas = document.getElementById('canvas')) === null) {
                    canvas = document.createElement('canvas');
                    if (document.getElementById('game') !== null) {
                        document.getElementById('game').appendChild(canvas);
                    } else {
                        document.body.appendChild(canvas);
                    }
                }
                context = canvas.getContext('2d');
                canvas.width = settings.width;
                canvas.height = settings.height;

                canvas.style.width = 640;
                canvas.style.height = 480;

                Puyo.width = settings.Puyo.width || 32;
                Puyo.height = settings.Puyo.height || 32;
                Puyo.spacingX = settings.Puyo.spacingX || 0;
                Puyo.spacingY = settings.Puyo.spacingY || -4;

                Loader.load({
                    images: {
                        puyo: 'assets/aqua.png',
                        allClear: 'assets/allclear.png',
                        chain: 'assets/chain.png'
                    }
                }, onLoad);
            }
        };
    };
});