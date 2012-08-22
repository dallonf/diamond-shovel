if (me) {
    this.hostId = me.id;
    this.hostName = me.minecraftName;
    emit('games:create', this);
} else {
    cancel("You must be logged in to create a game!", 401);
}