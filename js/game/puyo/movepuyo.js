define('puyojs/game/puyo/movepuyo', [
    'puyojs/utils',
    'puyojs/loader',
    'puyojs/math/vector2',
    'puyojs/components/base',
    'puyojs/components/sprite'
], function (Utils, Loader, Vector2, Base, Sprite) {
    'use strict';
    var Constants = Utils.Constants,
        Settings = Utils.Settings,
        MovePuyo = Constants.MovePuyo,
        Phase = Constants.Phase,
        Direction = Constants.Direction;
    return function (settings) {
        var visible = false,
            dropSpeed = 2,
            fastDrop = 48,
            rotation = 0,
            color1 = 0,
            color2 = 0,
            bigColor = 0,
            movePuyoAngle = 0,
            sprite1Angle = 0,
            sprite2Angle = 0,
            flip = 0,
            transpose = false,
            fallCounter = 0,
            rotateCounter = 0,
            flipCounter = 0,
            dropCounter = 0,
            holdCounter = 0,
            gridWidth = Settings.Puyo.width + Settings.Puyo.spacingX,
            gridHeight = Settings.Puyo.height + Settings.Puyo.spacingY,
            pos = [Vector2(0, 0), Vector2(0, 0), Vector2(0, 0), Vector2(0, 0)],
            type = MovePuyo.DOUBLET,
            player = null,
            puyo1 = Base().attach(Sprite({
                image: Loader.getImage('puyo'),
                size: Vector2(Settings.Puyo.width, Settings.Puyo.height),
                spriteOffset: Vector2(0, 0)
            }), 'sprite'),
            puyo2 = Base().attach(Sprite({
                image: Loader.getImage('puyo'),
                size: Vector2(Settings.Puyo.width, Settings.Puyo.height),
                spriteOffset: Vector2(0, 0)
            }), 'sprite'),
            sprite1Angle = 0,
            sprite2Angle = 0,
            setType = function (mpt) {
                type = mpt;
                //Unset the other variables
                if (mpt === MovePuyo.DOUBLET) {
                    pos[2].x = -1;
                    pos[2].y = -1;
                    pos[3].x = -1;
                    pos[3].y = -1;
                }
                if (mpt === MovePuyo.TRIPLET) {
                    pos[3].x = -1;
                    pos[3].y = -1;
                }
            },
            setSprite = function () {
                puyo1.sprite.setSpriteOffset(Vector2(
                    0,
                    Settings.Puyo.height * color1
                ));
                puyo2.sprite.setSpriteOffset(Vector2(
                    0,
                    Settings.Puyo.height * color2
                ));
                puyo1.setOrigin(Vector2(Settings.Puyo.width / 2, Settings.Puyo.height / 2));
                puyo2.setOrigin(Vector2(Settings.Puyo.width / 2, Settings.Puyo.height / 2));
            },
            setRotation = function () {
                rotation += 4;
                rotation %= 4;
                if (type === MovePuyo.DOUBLET || type === MovePuyo.TRIPLET) {
                    //Set variables
                    if (rotation === 0) {
                        pos[1].x = pos[0].x;
                        pos[1].y = pos[0].y + 1;
                    } else if (rotation === 1) {
                        pos[1].x = pos[0].x + 1;
                        pos[1].y = pos[0].y;
                    } else if (rotation === 2) {
                        pos[1].x = pos[0].x;
                        pos[1].y = pos[0].y - 1;
                    } else if (rotation === 3) {
                        pos[1].x = pos[0].x - 1;
                        pos[1].y = pos[0].y;
                    }
                }

            },
            setSpriteAngle = function () {
                var position1 = puyo1.position(),
                    position2 = puyo2.position(),
                    hor = 0,
                    ver = 0;
                if (type === MovePuyo.DOUBLET) {
                    //Doublet does not rotate puyo sprites
                    sprite1Angle = 0;
                    sprite2Angle = 0;
                    //Doublet: puyo2 rotates around puyo1
                    position2.x = position1.x + gridWidth * Math.sin(Utils.toRadian(movePuyoAngle));
                    position2.y = position1.y - gridHeight * Math.cos(Utils.toRadian(movePuyoAngle));
                }
                //(This movement is incomplete for nazo puyo: it doesn't check for collisions upwards)
                if (type === MovePuyo.DOUBLET) { //ROTATION
                    //Clockwise
                    switch (rotation) {
                    case 0:
                        hor = 1;
                        ver = 0;
                        break;
                    case 1:
                        hor = 0;
                        ver = -1;
                        break;
                    case 2:
                        hor = -1;
                        ver = 0;
                        break;
                    case 3:
                        hor = 0;
                        ver = 1;
                        break;
                    }
                    if (player.controller.a === 1 && player.activeField().isEmpty(pos[0].x + hor, pos[0].y + ver)) {
                        rotation++;
                        rotation %= 4;
                        rotateCounter = -8;
                        player.controller.a += 1;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }

                    //Counter Clockwise
                    switch (rotation) {
                    case 0:
                        hor = -1;
                        ver = 0;
                        break;
                    case 1:
                        hor = 0;
                        ver = 1;
                        break;
                    case 2:
                        hor = 1;
                        ver = 0;
                        break;
                    case 3:
                        hor = 0;
                        ver = -1;
                        break;
                    }
                    if (player.controller.b === 1 && player.activeField().isEmpty(pos[0].x + hor, pos[0].y + ver)) {
                        rotation--;
                        rotation += 4;
                        rotation %= 4;
                        rotateCounter = 8;
                        player.controller.b += 1;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                }
                if (type === MovePuyo.DOUBLET) {
                    // 7Rule
                    if (player.controller.a === 1 && rotation === 0 && player.activeField().isEmpty(pos[0].x + 1, pos[0].y + 1) && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y)) {
                        pos[0].y += 1;
                        rotation = 1;
                        rotateCounter = -8;
                        player.controller.a += 1;
                        fallCounter = 60;
                        dropCounter += 10;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                    if (player.controller.b === 1 && rotation === 0 && player.activeField().isEmpty(pos[0].x - 1, pos[0].y + 1) && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y)) {
                        pos[0].y += 1;
                        rotation = 3;
                        rotateCounter = 8;
                        player.controller.b += 1;
                        fallCounter = 60;
                        dropCounter += 10;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                }
                if (type === MovePuyo.DOUBLET) {
                    // Wall kick
                    // right wall
                    if (player.controller.a === 1 && rotation === 0 && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && player.activeField().isEmpty(pos[0].x - 1, pos[0].y)) {
                        player.controller.a += 1;
                        pos[0].x -= 1;
                        rotateCounter = -8;
                        rotation = 1;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                    if (player.controller.b === 1 && rotation == 2 && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && player.activeField().isEmpty(pos[0].x - 1, pos[0].y)) {
                        player.controller.b += 1;
                        pos[0].x -= 1;
                        rotateCounter = 8;
                        rotation = 1;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                    // left wall
                    if (player.controller.a === 1 && rotation === 2 && player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y)) {
                        player.controller.a += 1;
                        pos[0].x += 1;
                        rotateCounter = -8;
                        rotation = 3;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                    if (player.controller.b === 1 && rotation === 0 && player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y)) {
                        player.controller.b += 1;
                        pos[0].x += 1;
                        rotateCounter = 8;
                        rotation = 3;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                }
                if (type === MovePuyo.DOUBLET || type === MovePuyo.TRIPLET) {
                    // Ground kick
                    if (player.controller.a === 1 && rotation === 1 && player.activeField().isEmpty(pos[0].x, pos[0].y + 1) && !player.activeField().isEmpty(pos[0].x, pos[0].y - 1)) {
                        player.controller.a += 1;
                        pos[0].y += 1;
                        rotateCounter = -8;
                        rotation = 2;
                        fallCounter = 60;
                        dropCounter += 10;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                    if (player.controller.b === 1 && rotation === 3 && player.activeField().isEmpty(pos[0].x, pos[0].y + 1) && !player.activeField().isEmpty(pos[0].x, pos[0].y - 1)) {
                        player.controller.b += 1;
                        pos[0].y += 1;
                        rotateCounter = 8;
                        rotation = 2;
                        fallCounter = 60;
                        dropCounter += 10;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                }
                if (type === MovePuyo.DOUBLET) {
                    // Flip
                    if (player.controller.a === 1 && flip === 0 && flipCounter > 0 && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y) && player.activeField().isEmpty(pos[0].x, pos[0].y - 1)) {
                        flipCounter = -8;
                        flip = 1;
                        rotation = Math.abs(rotation - 2);
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                    if (player.controller.b === 1 && flip === 0 && flipCounter < 0 && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y) && player.activeField().isEmpty(pos[0].x, pos[0].y - 1)) {
                        flipCounter = 8;
                        flip = 1;
                        rotation = Math.abs(rotation - 2);
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                }
                if (type === MovePuyo.DOUBLET) {
                    // Flip & Ground Kick
                    if (player.controller.a === 1 && flip === 0 && rotation === 0 && flipCounter > 0 && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x, pos[0].y - 1)) {
                        flipCounter = -8;
                        flip = 1;
                        rotation = Math.abs(rotation - 2);
                        pos[0].y += 1;
                        fallCounter = 60;
                        dropCounter += 10;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                    if (player.controller.b === 1 && flip === 0 && rotation === 0 && flipCounter < 0 && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x, pos[0].y - 1)) {
                        flipCounter = 8;
                        flip = 1;
                        rotation = Math.abs(rotation - 2);
                        pos[0].y += 1;
                        fallCounter = 60;
                        dropCounter += 10;
                        //play sound
                        // data - > snd.rotate.Play(data);
                    }
                }
                setRotation();

                //edit timer
                if (rotateCounter > 0) {
                    rotateCounter -= 1;
                }
                if (rotateCounter < 0) {
                    rotateCounter += 1;
                }

                //edit fliptimer
                if (flipCounter > 0) {

                    flipCounter -= 1;
                }
                if (flipCounter < 0) {
                    flipCounter += 1;
                }
                if (flipCounter == 0) {
                    flip = 0;
                }

                // Rotate Puyos
                // RotateCounter is for normal rotations, FlipTimer is for fast flipping 
                // (Variable Flip determines if used or not)
                movePuyoAngle = rotation * 90 + rotateCounter / 8 * 90 + flipCounter / 8.0 * 180 * flip;

                //Trigger flip
                if (type === MovePuyo.DOUBLET && dropCounter < 90) {
                    if (player.controller.a === 1 && flip === 0 && flipCounter <= 0 && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y)) {
                        flipCounter = 20;
                    }
                    if (player.controller.b === 1 && flip === 0 && flipCounter >= 0 && !player.activeField().isEmpty(pos[0].x + 1, pos[0].y) && !player.activeField().isEmpty(pos[0].x - 1, pos[0].y)) {
                        flipCounter = -20;
                    }
                }
            },
            setSpriteY = function () {
                var position1 = puyo1.position(),
                    field = player.activeField();
                //MovePuyosY
                //Move puyos down: relative to field
                //there is now a complication that the origin is now the center of the puyo -> problem when PUYOY and gridsize are unequal
                //so we must correct it by +PUYOY/2-(PUYOY-gridSizeY)
                position1.y = field.indexToPos(pos[0].x, pos[0].y).y - (100 - fallCounter) / 100 * gridHeight + Settings.Puyo.height / 2 - (Settings.Puyo.height - gridHeight);

                //add to fallcounter
                if (fallCounter < 100) {
                    fallCounter += dropSpeed;
                }

                //add score here
                if (player.controller.down > 0 &&
                    fallCounter >= 100 && !isAnyTouching(Direction.DOWN)) {
                    // m_player - > scoreVal += 1;
                    // m_player - > dropBonus += 1;
                }

                //reset fallcounter
                if (fallCounter >= 100 && !isAnyTouching(Direction.DOWN)) {
                    fallCounter -= 100;
                    pos[0].y -= 1;
                    pos[1].y -= 1;
                }

                //Controller movement
                //Move puyo down
                if (player.controller.down > 0 &&
                    player.controller.left === 0 &&
                    player.controller.right === 0 &&
                    fallCounter < 100) {
                    fallCounter += fastDrop;
                }
                if (player.controller.down > 0 &&
                    player.controller.left === 0 &&
                    player.controller.right > 0 &&
                    isAnyTouching(Direction.RIGHT) &&
                    fallCounter < 100) {
                    fallCounter += fastDrop;
                }
                if (player.controller.down > 0 &&
                    player.controller.left > 0 &&
                    player.controller.right === 0 &&
                    isAnyTouching(Direction.LEFT) &&
                    fallCounter < 100) {
                    fallCounter += fastDrop;
                }

                // Last bit
                if (player.controller.down > 0 &&
                    fallCounter >= 100 &&
                    isAnyTouching(Direction.DOWN) &&
                    holdCounter > 0) {
                    dropCounter = 100;
                }

                if (player.controller.down > 0 &&
                    fallCounter >= 100 &&
                    isAnyTouching(Direction.DOWN)) {
                    fallCounter = 100;
                    // m_player - > scoreVal += 1;
                    // m_player - > dropBonus += 1;
                    holdCounter = 1;
                }

                // Holdcounter
                if (player.controller.down === 0) {
                    holdCounter = 0;
                }
            },
            setSpriteX = function () {
                var position = puyo1.position();
                position.x = pos[0].x * gridWidth + Settings.Puyo.width / 2;
            },
            moveSpriteX = function () {
                var position = puyo1.position(),
                    halfWidth = Settings.Puyo.width / 2;
                //Actual movement
                if (position.x < pos[0].x * gridWidth + halfWidth) {
                    position.x += gridWidth / 2;
                } else if (position.x > pos[0].x * gridWidth + halfWidth) {
                    position.x -= gridWidth / 2;
                }

                //Snap
                if (position.x < pos[0].x * gridWidth + halfWidth && position.x > pos[0].x * gridWidth + halfWidth - gridWidth / 2) {
                    position.x = pos[0].x * gridWidth + halfWidth;
                } else if (position.x > pos[0].x * gridWidth + halfWidth && position.x < pos[0].x * gridWidth + halfWidth + gridWidth / 2) {
                    position.x = pos[0].x * gridWidth + halfWidth;
                }

                if (player.controller.right === 1 && !isAnyTouching(Direction.RIGHT)) {
                    pos[0].x += 1;
                    setRotation();
                }
                if (player.controller.left === 1 && !isAnyTouching(Direction.LEFT)) {
                    pos[0].x -= 1;
                    setRotation();
                }
                if (player.controller.right > 8 && player.controller.right % 2 === 0 && player.controller.left === 0 && !isAnyTouching(Direction.RIGHT)) {
                    pos[0].x += 1;
                    setRotation();
                }
                if (player.controller.left > 8 && player.controller.left % 2 === 0 && player.controller.right === 0 && !isAnyTouching(Direction.LEFT)) {
                    pos[0].x -= 1;
                    setRotation();
                }
            },
            isAnyTouching = function (dir) {
                var hor, ver;
                if (dir === Direction.DOWN) {
                    hor = 0;
                    ver = -1;
                } else if (dir === Direction.LEFT) {
                    hor = -1;
                    ver = 0;
                } else if (dir === Direction.RIGHT) {
                    hor = 1;
                    ver = 0;
                }
                if (!player.activeField().isEmpty(pos[0].x + hor, pos[0].y + ver) || !player.activeField().isEmpty(pos[1].x + hor, pos[1].y + ver)
                    // || !player.activeField().isEmpty(pos[2].x + hor, pos[2].y + ver) 
                    // || !player.activeField().isEmpty(pos[3].x + hor, pos[3].y + ver)
                ) {
                    return true;
                }

                if (dir === Direction.LEFT || dir === Direction.RIGHT) {
                    //floating object
                    if ((!player.activeField().isEmpty(pos[0].x + hor, pos[0].y + 1) || !player.activeField().isEmpty(pos[1].x + hor, pos[1].y + 1)
                        // || !player.activeField().isEmpty(pos[2].x + hor, pos[2].y + 1) 
                        // || !player.activeField().isEmpty(pos[3].x + hor, pos[3].y + 1)
                    ) && fallCounter < 90) {
                        return true;
                    }
                }
                return false;
            },
            placePuyos = function () {
                if (fallCounter > 90 && isAnyTouching(Direction.DOWN)) {
                    dropCounter += 1;
                }
                if (dropCounter > 90) {
                    // End phase 10
                    player.endPhase();
                }
            },
            placeShadow = function () {},
            movePuyo = Base().extend({
                init: function (parent) {
                    player = parent;
                },
                prepare: function (mpt, player, colors, spawnPosition) {
                    //triplet and quadruplet start in rotation=1 mode
                    if (mpt === MovePuyo.DOUBLET || mpt === MovePuyo.BIG) {
                        rotation = 0;
                    } else if (mpt === MovePuyo.TRIPLET || mpt === MovePuyo.TRIPLETR || mpt === MovePuyo.QUADRUPLET) {
                        rotation = 1;
                    }
                    //set to triplet if tripletR
                    if (mpt == MovePuyo.TRIPLETR) {
                        setType(MovePuyo.TRIPLET);
                        transpose = true;
                    } else {
                        setType(mpt);
                        transpose = false;
                    }
                    //define a spawn point (x index) and top of the field
                    // fieldProp prop = player.activeField.getProperties();
                    // m_spawnX = (prop.gridX - 1) / 2;
                    // m_spawnY = prop.gridY - 4;
                    //reset values
                    movePuyoAngle = 0;
                    dropCounter = 0;
                    fallCounter = 0;
                    flipCounter = 0;
                    rotateCounter = 0;
                    //set color
                    color1 = colors.first;
                    color2 = colors.second;
                    bigColor = colors.first;
                    setSprite();
                    //set spawn point
                    pos[0].x = 2;
                    pos[0].y = 12;
                    setRotation();

                    //set initial position of doublet
                    setSpriteX();
                    setSpriteY();
                },
                move: function (currentphase) {
                    moveSpriteX();
                    setSpriteY();
                    setSpriteAngle();
                    // if (currentphase === MOVE) {
                    placePuyos();
                    // }
                    // placeShadow();

                    //fade out quick drop
                    // m_quick1.setTransparency(max(m_quick1.getTransparency()-0.1,0.0));
                    // m_quick2.setTransparency(max(m_quick2.getTransparency()-0.1,0.0));
                    // window.debugText = '' + pos[0].x + ', ' + pos[0].y + '\n' + pos[1].x + ', ' + pos[1].y + ' ' + rotation;
                },
                index: function () {
                    return pos;
                },
                setVisible: function (bool) {
                    puyo1.sprite.setVisible(bool);
                    puyo2.sprite.setVisible(bool);
                }
            });
        movePuyo.attach(puyo1);
        movePuyo.attach(puyo2);
        return movePuyo;
    };
});