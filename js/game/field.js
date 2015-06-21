define('puyojs/game/field', [
    'puyojs/utils',
    'puyojs/components/base',
    'puyojs/math/array2d',
    'puyojs/math/vector2'
], function (Utils, Base, Array2D, Vector2) {
    'use strict';
    var Settings = Utils.Settings,
        Constants = Utils.Constants;
    return function (settings) {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            width = settings.width,
            height = settings.height,
            array = Array2D(width, height + 2),
            field = Base(),
            initCanvas = function () {
                // init canvas
                canvas.width = width * (Settings.Puyo.width + Settings.Puyo.spacingX);
                canvas.height = height * (Settings.Puyo.height + Settings.Puyo.spacingY);
            },
            updateCanvas = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // ctx.fillRect(0, 0, canvas.width, canvas.height);
                array.iterate(function (x, y, puyo) {
                    if (puyo) {
                        puyo.draw(ctx);
                    }
                });
            },
            indexToPos = function (indexX, indexY) {
                var bottom = height * (Settings.Puyo.height + Settings.Puyo.spacingY),
                    x = indexX * (Settings.Puyo.width + Settings.Puyo.spacingX),
                    y = (indexY + 1) * (Settings.Puyo.height + Settings.Puyo.spacingY);
                return Vector2(x, bottom - y);
            },
            isEmpty = function (indexX, indexY) {
                // left and right are regarded
                // as walls: not empty!
                if (indexX >= array.width() || indexX < 0 || indexY < 0) {
                    return false;
                }
                // the space above the field stretches
                // out to infinity, regarded as empty
                if (indexY >= array.height && indexX >= 0 && indexX < array.width) {
                    return true;
                }

                return array.get(indexX, indexY) === null;
            },
            isPuyo = function (indexX, indexY) {
                var element = array.get(indexX, indexY);
                if (element === null) {
                    return false;
                } else {
                    return Utils.isDefined(element.isPuyo);
                }
            },
            isColorPuyo = function (puyo) {
                if (puyo === null) {
                    return false;
                }
                if (!Utils.isDefined(puyo.type)) {
                    return false;
                }
                return puyo.type() === Constants.Puyo.COLOR;
            },
            isWithinBounds = function (x, y) {
                if (x >= array.width() || x < 0 || y >= array.height() || y < 0) {
                    return false;
                } else {
                    return true;
                }
            },
            getPuyo = function (x, y) {
                if (isWithinBounds(x, y)) {
                    return array.get(x, y);
                } else {
                    return null;
                }
            },
            setLink = function (x, y) {
                var current = getPuyo(x, y),
                    neighbor;

                if (!current) {
                    return;
                }
                // check down
                neighbor = getPuyo(x, y - 1);
                if (neighbor && isColorPuyo(neighbor) && !neighbor.isFalling() &&
                    current.color() === neighbor.color() && y !== array.height() - 3) {
                    neighbor.setLink(Constants.Direction.UP);
                    current.setLink(Constants.Direction.DOWN);
                }
                //check up
                neighbor = getPuyo(x, y + 1);
                if (neighbor && isColorPuyo(neighbor) && !neighbor.isFalling() &&
                    current.color() === neighbor.color() && y !== array.height() - 4) {
                    neighbor.setLink(Constants.Direction.DOWN);
                    current.setLink(Constants.Direction.UP);
                }
                //check right
                neighbor = getPuyo(x + 1, y);
                if (neighbor && isColorPuyo(neighbor) && current.color() === neighbor.color()) {
                    if (!neighbor.isFalling()) {
                        neighbor.setLink(Constants.Direction.LEFT);
                        current.setLink(Constants.Direction.RIGHT);
                    } else {
                        neighbor.unsetLink(Constants.Direction.LEFT);
                        current.unsetLink(Constants.Direction.RIGHT);
                    }
                }
                //check left
                neighbor = getPuyo(x - 1, y);
                if (neighbor && isColorPuyo(neighbor) && current.color() === neighbor.color()) {
                    if (!neighbor.isFalling()) {
                        neighbor.setLink(Constants.Direction.RIGHT);
                        current.setLink(Constants.Direction.LEFT);
                    } else {
                        neighbor.unsetLink(Constants.Direction.RIGHT);
                        current.unsetLink(Constants.Direction.LEFT);
                    }
                }
            },
            unsetLink = function (x, y, direction) {
                //invalid position
                if (isWithinBounds(x, y)) {
                    return;
                }
                if (isPuyo(x, y)) {
                    array.get(x, y).unsetLink(direction);
                }
            },
            unsetLinkAll = function (i, j) {
                // Check down -> unset uplink
                if (isColorPuyo(i, j - 1)) {
                    unsetLink(i, j - 1, Constants.Direction.UP);
                }
                // Check up
                if (isColorPuyo(i, j + 1)) {
                    unsetLink(i, j + 1, Constants.Direction.DOWN);
                }
                // Check right
                if (isColorPuyo(i + 1, j)) {
                    unsetLink(i + 1, j, Constants.Direction.LEFT);
                }
                // Check left
                if (isColorPuyo(i - 1, j)) {
                    unsetLink(i - 1, j, Constants.Direction.RIGHT);
                }

                // Disconnect self
                unsetLink(i, j, Constants.Direction.UP);
                unsetLink(i, j, Constants.Direction.DOWN);
                unsetLink(i, j, Constants.Direction.LEFT);
                unsetLink(i, j, Constants.Direction.RIGHT);
            },
            /*
             * Drop a single puyo down, returns new y index.
             * Returns same y index if no puyo dropped at all
             */
            dropSingle = function (x, y) {
                var element = array.get(x, y),
                    foundEmpty = false,
                    emptyY = y;
                if (!isPuyo(x, y) || !element.isDroppable() || !isWithinBounds(x, y)) {
                    return y;
                }

                // puyo is on bottom: don't bother
                if (y === 0) {
                    return y;
                }
                // initial checking if empty
                foundEmpty = isEmpty(x, y - 1);
                if (!foundEmpty) {
                    return y;
                }
                while (foundEmpty && emptyY >= 1) {
                    //check if next position is empty
                    foundEmpty = isEmpty(x, emptyY - 1);
                    if (foundEmpty === true) {
                        emptyY -= 1;
                    }
                }
                //drop puyo down
                array.set(x, emptyY, array.get(x, y));
                array.set(x, y, null);
                array.get(x, emptyY).setIndex(x, emptyY);
                return emptyY;
            };

        initCanvas();
        field.attach({
            update: function () {
                // update puyos
                array.iterate(function (x, y, puyo) {
                    if (puyo) {
                        puyo.update();
                    }
                });
            },
            draw: function (context) {
                // temp: draw all the time
                updateCanvas();
                // temp: draw a grid
                array.iterate(function (x, y, puyo) {
                    var w = Settings.Puyo.width + Settings.Puyo.spacingX,
                        h = Settings.Puyo.width + Settings.Puyo.spacingY;

                    if (y >= 12) {
                        return
                    }
                    context.fillStyle = 'rgb(128, 128, 128)';
                    if ((x + y * width + y % 2) % 2 === 0) {
                        context.fillStyle = 'rgb(160, 160, 160)';
                    }
                    context.fillRect(x * w, y * h, w, h);
                });

                // draw field canvas onto main canvas
                context.drawImage(canvas, 0, 0);
            }
        });
        // public functions
        field.extend({
            /*
             * Is field empty at index x, y
             */
            isEmpty: function (x, y) {
                return isEmpty(x, y);
            },
            /*
             * Converts index x, y to world position
             */
            indexToPos: function (x, y) {
                return indexToPos(x, y);
            },
            /*
             * Retrieves object at index x, y
             */
            get: function (x, y) {
                return array.get(x, y);
            },
            /*
             * Counts non-empty entries
             */
            count: function () {
                var count = 0;
                array.iterate(function (x, y, puyo) {
                    if (puyo) {
                        ++count;
                    }
                });
                return count;
            },
            /*
             * Adds puyo object to field
             * @param {Number} x - hor index
             * @param {Number} y - ver index
             * @param {Puyo} puyo - puyo object
             * @param {Bool} -
             */
            addPuyo: function (x, y, puyo, fallFlag, offset, fallDelay) {
                if (!Utils.isDefined(fallFlag)) {
                    fallFlag = 0;
                }
                if (!Utils.isDefined(offset)) {
                    offset = 0;
                }
                if (!Utils.isDefined(fallDelay)) {
                    fallDelay = 0;
                }
                array.set(x, y, puyo);
                puyo.setField(field);
                puyo.setIndex(x, y);
                puyo.setPuyoPosition(indexToPos(x, y).add(puyo.origin()));
                puyo.setFallState(fallFlag);
                puyo.setFallDelay(fallDelay);
                return true;
            },
            linkField: function () {
                array.iterate(function (x, y, puyo) {
                    setLink(x, y);
                });
            },
            searchLink: function (x, y) {
                setLink(x, y);
            },
            dropField: function () {
                var i, j, y, pos, puyo, countDelay;
                for (i = 0; i < array.width(); ++i) {
                    countDelay = 0;
                    for (j = 0; j < array.height(); ++j) {
                        y = dropSingle(i, j);
                        if (y !== j) {
                            puyo = array.get(i, y);
                            if (isColorPuyo(puyo)) {
                                // unlink
                                unsetLinkAll(i, j);
                                unsetLink(i, y, Constants.Direction.Up);
                                unsetLink(i, y, Constants.Direction.Down);
                                unsetLink(i, y, Constants.Direction.LEFT);
                                unsetLink(i, y, Constants.Direction.RIGHT);
                            }
                            // drop the sprite
                            pos = indexToPos(i, y - 1);
                            puyo.fall(countDelay, pos.y);
                            ++countDelay;
                        }
                    }
                }
            },
            searchBounce: function (x, y, posy) {
                var i,
                    j,
                    funFlag = 1,
                    count = 1,
                    puyo;
                for (i = 0; i < posy; ++i) {
                    if (isPuyo(x, y - i)) {
                        puyo = array.get(x, y - i);
                        if (funFlag == 1 && puyo.hard() === true) {
                            //loop back up
                            for (j = 0; j <= i; j++) {
                                array.get(x, y - i + j).setBottomY(y - i);
                            }
                            funFlag = 0;
                            break;
                        }
                        //default value
                        puyo.setBottomY(0);
                    }
                    if (funFlag === 1 && y - i < 0)
                        funFlag = 0;
                    // set bouncemultiplied, also start disconnecting puyos
                    // search for disconnect
                    // the count is what determines how many puyos disconnect
                    if (funFlag === 1 && count < 5) {
                        if (puyo.fallState() === 0) {
                            unsetLinkAll(x, y - i);
                            // Set bouncemultiplier
                            puyo.setBounceMultiplier(1 / Math.pow(2, count - 1));
                            puyo.setBounceTimer(2);
                        }
                        count++;
                    }
                }
            },
            endFallPuyoPhase: function () {
                // TO CHANGE
                //loop through puyos
                var i,
                    j,
                    end = true;
                array.iterate(function (i, j, puyo) {
                    if (puyo) {
                        // check if any is bouncing falling or destroying
                        if (puyo.bounceState() || puyo.fallState()) {
                            end = false;
                        }
                    }
                });
                return end;
            }
        });
        return field;
    };
});