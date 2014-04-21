define('puyojs/game/nextlist', [
    'puyojs/utils',
], function (Utils) {
    'use strict';
    var Constants = Utils.constants;
    return function (seed) {
        var list = [],
            useDropPattern = false,
            character,
            randomizer = new MersenneTwister(seed),
            setRandomSeed = function (seed_in) {
                randomizer.init_genrand(seed_in);
            },
            getRandom = function (value) {
                return Math.floor(value * randomizer.random());
            },
            checkAllClearStart = function () {

            };
        return {
            // init: function (seed) {
            //     if (seed) {
            //         setRandomSeed(seed);
            //     }
            //     list = [];
            //     // nextList needs 3 pairs to start
            //     this.addNewColorPair(3);
            //     this.addNewColorPair(3);
            //     this.addNewColorPair(colors);
            // },
            addNewColorPair: function (n) {
                var color1 = getRandom(n),
                    color2 = getRandom(n);
                list.push(color1);
                //Regenerate color 2 if type is quadruple and colors are the same
                if (useDropPattern) {
                    while (color1 === color2 && getFromDropPattern(m_character, turns + 3) == QUADRUPLET) {
                        color2 = getRandom(n);
                    }
                }
                list.push(color2);
                //update nextpuyo
                // if (useDropPattern)
                //     m_nextPuyo.update(m_nextList, m_character, turns);
                // else
                //     m_nextPuyo.update(m_nextList, ARLE, turns);
            },
            getNext: function () {
                return {
                    first: list.shift(),
                    second: list.shift()
                };
            }
        };
    };
});