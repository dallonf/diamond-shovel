if (!me) {
    cancel();
} else {
    this.username = me.minecraftName;
}

emit('game:' + this.gameId + ':message', this);