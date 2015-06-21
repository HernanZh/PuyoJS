require.config({
    baseUrl: '../js/',
    paths: {
        puyojs: '.'
    }
});

require(['puyojs/game'], function (Game) {
    // set up game
    var game = Game();
    game.init({
        width: 640,
        height: 480,
        Puyo: {
            width: 32,
            height: 32,
            spacingX: -1,
            spacingY: -2
        }
    });
});