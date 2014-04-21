define('puyojs/components/puyo', [
    'puyojs/utils',
    'puyojs/math/vector2'
], function (Utils, Vector2) {
    'use strict';
    var Constants = Utils.Constants,
        Settings = Utils.Settings,
        toRadian = function (degree) {
            return Utils.toRadian(degree);
        };
    return function (settings) {
        var type = settings.type,
            parent = null,
            field = null,
            droppable = Utils.isDefined(settings.droppable) ? settings.droppable : true,
            indexX = Utils.isDefined(settings.indexX) ? settings.indexX : -1,
            indexY = Utils.isDefined(settings.indexY) ? settings.indexY : -1,
            scale = Vector2(1, 1),
            position = Vector2(0, 0),
            bounceY = 0,
            bottomY = 0,
            velocityY = 0,
            fallTarget = 0,
            fallState = 0,
            fallDelay = 0,
            delayTimer = 0,
            hard = false,
            bounceState = 1,
            bounceTimer = 0,
            bounceMultiplier = 0,
            maxBounceTime = 20,
            puyoBounceSpeed = 2,
            landed = false,
            bounce = function () {
                if (hard === true) {
                    if (bounceTimer > 0) {
                        // end bounce immediately
                        bounceTimer += 20;
                    }
                    return;
                }
                // scale
                if (bounceTimer > 2 && fallState === Constants.FallState.NONE) {
                    scale.x = (((Math.exp(bounceTimer * -1.0 / 20.0) * bounceMultiplier * Math.cos(toRadian(bounceTimer * 6 - 45)) + 1.05) * (1 - 0.5 * Math.exp(bounceTimer * -1 / 5.0))));
                    scale.y = ((-1 * Math.exp(bounceTimer * -1.0 / 20.0) * bounceMultiplier * Math.cos(toRadian(bounceTimer * 6 - 45)) + 1) + Math.exp(bounceTimer / 2.0 * -1));
                } else if (fallState !== Constants.FallState.NONE) {
                    scale.x = 1;
                    scale.y = 1;
                }
                // bounce y position
                if (bounceTimer > 0 && position.y > 0 && fallState === 0) {
                    bounceY = (Math.exp(bounceTimer * -1 / 20) * Settings.Puyo.height * 1.14 * Math.min(1.2 - 0.2 * (Math.max(5 - position.y + bottomY, 0) + 1), bounceMultiplier) * Math.cos(toRadian(bounceTimer * 6 - 45)) + 1) + Math.exp(bounceTimer * -1 / 2);
                } else if (fallState != 0) {
                    bounceY = 0;
                }
                //set timer
                if (bounceTimer > 0) {
                    bounceTimer += puyoBounceSpeed;
                }
            };
        return {
            init: function (parentObj) {
                parent = parentObj;
            },
            update: function () {
                // ready to drop
                delayTimer += 0.5;
                if (fallState === Constants.FallState.READY && delayTimer >= fallDelay) {
                    fallState = Constants.FallState.FALLING;
                    velocityY = 0;
                    landed = false;
                }
                // falling
                if (fallState === Constants.FallState.FALLING) {
                    if (position.y < fallTarget) {
                        velocityY += 0.5;
                        position.y += velocityY;
                    } else {
                        // landproper
                        fallState = Constants.FallState.NONE;
                        position.y = fallTarget;
                        velocityY = 0;
                        bounceState = 1;
                        bounceTimer = 2;
                    }
                }
                // bouncing
                if (fallState === Constants.FallState.NONE && !landed) {
                    bounceState = 1;
                    landed = true;
                    field.searchBounce(indexX, indexY, indexY + 1);
                }

                // bounce
                bounce();
                if (fallState === Constants.FallState.NONE) {
                    // end of bounce
                    if (bounceTimer > 60) {
                        if (settings.onBounceEnd) {
                            settings.onBounceEnd(field);
                        }
                        scale = Vector2(1, 1);
                        bounceY = 0;
                        if (bounceState === 1) {
                            bounceState = 0;
                        }
                        bounceTimer = 0;
                    }
                }

                // update transform
                parent.setScale(scale);
                parent.setPosition(Vector2(
                    position.x,
                    position.y + bounceY
                ));
            },
            position: function () {
                return position;
            },
            setPosition: function (pos) {
                position = pos;
            },
            type: function () {
                return type;
            },
            isDroppable: function () {
                return droppable;
            },
            setIndex: function (x, y) {
                indexX = x;
                indexY = y;
            },
            indexX: function () {
                return indexX;
            },
            indexY: function () {
                return indexY;
            },
            //Calculate the position the puyo has to fall to
            setFallTarget: function (targetY) {
                fallTarget = targetY;
                // fieldProp prop=m_field->getProperties();
                // m_targetY=prop.gridHeight*((prop.gridY-3)-target);
            },
            setFallState: function (state) {
                fallState = state;
            },
            setFallDelay: function (delay) {
                fallDelay = delay;
            },
            fallState: function () {
                return fallState;
            },
            fall: function (delay, targetY) {
                fallState = Constants.FallState.READY;
                fallTarget = targetY;
                fallDelay = delay;
                delayTimer = 0;
            },
            isFalling: function () {
                return fallState !== Constants.FallState.NONE;
            },
            setField: function (obj) {
                field = obj;
            },
            hard: function () {
                return hard;
            },
            setBottomY: function (value) {
                bottomY = value;
            },
            setBounceMultiplier: function (value) {
                bounceMultiplier = value;
            },
            setBounceTimer: function (value) {
                bounceTimer = value;
            },
            bounceState: function () {
                return bounceState;
            }
        };
    }
});