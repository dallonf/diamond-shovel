if (!internal && (!me || me.id !== this.hostId)) {
    cancel("This is not your game", 401);
}

dpd.users.get({id: {$in: this.playerIds || []}}, function(res, err) {
  this.players = res.map(function(p) {
    return {
        id: p.id
      , minecraftName: p.minecraftName
    };
  });

  emit('games:update', this);
});