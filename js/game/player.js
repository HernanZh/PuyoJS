define('puyojs/game/player', [
    'puyojs/utils',
    'puyojs/components/base',
    'puyojs/inputmanager',
    'puyojs/game/controller',
    'puyojs/game/puyo/movepuyo',
    'puyojs/game/puyo/colorpuyo',
    'puyojs/game/field',
    'puyojs/game/nextlist'
], function (
    Utils,
    Base,
    InputManager,
    Controller,
    MovePuyo,
    ColorPuyo,
    Field,
    NextList
) {
    'use strict';
    var Settings = Utils.Settings,
        Constants = Utils.Constants;
    return function () {
        var controller,
            currentphase = 0,
            colorsCount = 4,
            currentColors = {},
            currentMovePuyo = Constants.MovePuyo.DOUBLET,
            nextList = NextList(),
            //
            chain = 0,
            predictedChain = 0,
            //
            activeField = 'fieldNormal',
            fields = {
                fieldNormal: Field({
                    width: 6,
                    height: 12
                }),
                fieldFever: Field({
                    width: 6,
                    height: 12
                }),
            },
            player = Base(),
            movePuyo = MovePuyo(),
            endPhase = function () {
                if (currentphase === Constants.Phase.GETREADY) {
                    currentphase = Constants.Phase.PREPARE;
                } else if (currentphase === Constants.Phase.PREPARE) {
                    currentphase = Constants.Phase.MOVE;
                } else if (currentphase === Constants.Phase.MOVE) {
                    currentphase = Constants.Phase.CREATEPUYO;
                } else if (currentphase === Constants.Phase.CREATEPUYO) {
                    currentphase = Constants.Phase.FALLPUYO;
                } else if (currentphase === Constants.Phase.FALLPUYO) {
                    currentphase = Constants.Phase.PREPARE;
                }
            },
            getReady = function () {
                endPhase();
            },
            prepare = function () {
                //Read colors and pop front after reading
                console.log(currentColors);
                currentColors = nextList.getNext();
                nextList.addNewColorPair(colorsCount);

                currentMovePuyo = Constants.MovePuyo.DOUBLET;
                // if (useDropPattern)
                //     mpt = getFromDropPattern(m_character, turns);
                movePuyo.prepare(currentMovePuyo, player, currentColors);

                endPhase();
            },
            createPuyo = function () {
                var index = movePuyo.index(),
                    puyo1,
                    puyo2;
                if (currentMovePuyo === Constants.MovePuyo.DOUBLET) {
                    puyo1 = ColorPuyo({
                        color: currentColors.first
                    });
                    puyo2 = ColorPuyo({
                        color: currentColors.second
                    });
                    fields[activeField].addPuyo(index[0].x, index[0].y, puyo1);
                    fields[activeField].addPuyo(index[1].x, index[1].y, puyo2);
                    fields[activeField].dropField();
                }
                endPhase();
            };
        player.attach(movePuyo, 'movePuyo');

        // initialize controller
        controller = Controller({
            keyUp: 38,
            keyDown: 40,
            keyLeft: 37,
            keyRight: 39,
            keyA: 88,
            keyB: 90
        });
        InputManager.addController(controller);
        player.attach(controller, 'controller');
        player.attach({
            update: function () {
                //=====PHASE 0: GETREADY
                if (currentphase === Constants.Phase.GETREADY) {
                    getReady();
                }
                //=====PHASE 1: PREPARE
                if (currentphase === Constants.Phase.PREPARE) {
                    prepare();
                }

                // PHASE 10
                if (currentphase === Constants.Phase.MOVE) {
                    movePuyo.setVisible(true);
                    movePuyo.move();
                } else {
                    movePuyo.setVisible(false);
                }
                if (currentphase === Constants.Phase.CREATEPUYO) {
                    // CREATEPUYO phase is dropping a colored puyo pair
                    createPuyo();
                    //reset chain number
                    // chain = 0;
                    // predictedChain = 0;
                    //set target point
                    // if (currentgame - > currentruleset - > marginTime >= 0)
                    //     targetPoint = getTargetFromMargin(currentgame - > currentruleset - > targetPoint, currentgame - > currentruleset - > marginTime, margintimer);
                }
                if (currentphase === Constants.Phase.FALLPUYO) {
                    if (fields[activeField].endFallPuyoPhase()) {
                        endPhase();
                    }
                }

                fields[activeField].update();
            },
            draw: function (context) {
                fields[activeField].draw(context);
            },
            init: function () {
                // fill up next list
                nextList.addNewColorPair(3);
                nextList.addNewColorPair(3);

                // test: fill field with puyos
                fields[activeField].addPuyo(0, 0, ColorPuyo({
                    color: Constants.Color.RED
                }));
                fields[activeField].addPuyo(1, 0, ColorPuyo({
                    color: Constants.Color.GREEN
                }));
                fields[activeField].addPuyo(2, 0, ColorPuyo({
                    color: Constants.Color.GREEN
                }));
                fields[activeField].addPuyo(3, 0, ColorPuyo({
                    color: Constants.Color.RED
                }));
                fields[activeField].addPuyo(4, 0, ColorPuyo({
                    color: Constants.Color.YELLOW
                }));
                fields[activeField].addPuyo(5, 0, ColorPuyo({
                    color: Constants.Color.PURPLE
                }));
                fields[activeField].addPuyo(0, 1, ColorPuyo({
                    color: Constants.Color.RED
                }));
                fields[activeField].addPuyo(1, 1, ColorPuyo({
                    color: Constants.Color.GREEN
                }));
                fields[activeField].addPuyo(2, 1, ColorPuyo({
                    color: Constants.Color.RED
                }));
                fields[activeField].addPuyo(3, 1, ColorPuyo({
                    color: Constants.Color.RED
                }));
                fields[activeField].addPuyo(4, 1, ColorPuyo({
                    color: Constants.Color.RED
                }));
                fields[activeField].addPuyo(5, 1, ColorPuyo({
                    color: Constants.Color.BLUE
                }));
                fields[activeField].linkField();

                fields[activeField].addPuyo(5, 10, ColorPuyo({
                    color: Constants.Color.BLUE
                }));
                fields[activeField].addPuyo(5, 11, ColorPuyo({
                    color: Constants.Color.BLUE
                }));

                fields[activeField].dropField();

            }
        });

        // public
        player.extend({
            activeField: function () {
                return fields[activeField];
            },
            endPhase: function () {
                endPhase();
            }
        });

        return player;
    };
});