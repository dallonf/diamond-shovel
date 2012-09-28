var playerId = parts[0];
var gameId = body && body.game;
if (!me) cancel("You are not logged in", 401);
if (!playerId) cancel("You must provide a player id");
if (!gameId) cancel("You must provide a game id");

dpd.users.get(playerId, function(user) {
    var name = user.minecraftName; 
    emit('game:' + gameId + ':kicked', {playerId: playerId});
    dpd.lobbymessages.get({username: name, gameId: gameId}, function(messages) {
        messages.forEach(function(m) {
            dpd.lobbymessages.del(m.id);
        });
    });
    dpd.games.put(gameId, {playerIds: {$pull: playerId}}, function(res, err) {
        setResult({success: true});
    });
});



