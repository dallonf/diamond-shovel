if (!me) {
    cancel();
} else {
    this.username = this.minecraftName;
}

emit('game:' + this.gameId + ':message', this);