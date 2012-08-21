if (!this.type) {
    error('type', "Game Type is required");
}

if (!this.maxPlayers || this.maxPlayers < 2) {
    error('maxPlayers', "Must allow at least 2 players");
}

var date = new Date(this.date);
if (!this.date || isNaN(date.getTime())) {
    error('date', "Date is invalid");
} else {
    this.timeMillis = date.getTime();
    if (this.timeMillis < new Date().getTime()) {
        error('date', "You cannot schedule a game in the past");
    }
}