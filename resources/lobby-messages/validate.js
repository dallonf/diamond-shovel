if (!this.gameId) error('gameId', "game is required");

if (this.message) {
    if (this.message.length > 200 || this.message.length < 4) {
        error('message', "Message must be between 4 and 200 characters");
    }
} else {
    error('message', "message is required");
}