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
        width: 1280,
        height: 960
    });
});