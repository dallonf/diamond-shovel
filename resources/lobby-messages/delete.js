if (!internal) cancel();
emit('game:' + this.gameId + ':message:delete', this);