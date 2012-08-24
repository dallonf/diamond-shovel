dpd.users.get({id: {$in: this.playerIds || []}}, function(res, err) {
  this.players = res.map(function(p) {
    return {
        id: p.id
      , minecraftName: p.minecraftName
    };
  });
});