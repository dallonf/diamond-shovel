var gameId = parts[0];
if (!me) cancel("You are not logged in", 401);
if (!gameId) cancel("You must provide an id");

dpd.games.put(gameId, {playerIds: {$push: me.id}}, function(res, err) {
    setResult({success: true});
});