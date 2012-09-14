if (!this.gameId) error('gameId', "game is required");

if (this.message) {
    if (this.message.length >= 200) {
        error('message', "Message must be less than 200 characters");
    }
} else {
    error('message', "message is required");
}