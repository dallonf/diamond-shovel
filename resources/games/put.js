if (!me || me.id !== this.hostId) {
    error("You are not the host of this game", 401);
}

emit('games:update', this);