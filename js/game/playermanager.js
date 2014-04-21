define('puyojs/game/playermanager', [
    'puyojs/components/base',
    'puyojs/game/player'
], function (Base, Player) {
    return function () {
        var players = [],
            manager = Base().extend({
                addPlayer: function () {
                    var player = Player();
                    players.push(player);
                    manager.attach(player);
                }
            });

        return manager;

    }
});