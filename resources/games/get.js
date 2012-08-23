dpd.users.get({id: {$in: this.players || []}}, function(res, err) {
  this.players = res.map(function(p) {
    return {
        id: p.id
      , minecraftName: p.minecraftName
    };
  });
});