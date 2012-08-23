if (!me || me.id !== this.hostId) {
    protect('type');
    protect('maxPlayers');
    protect('date');
    protect('timeMillis');
    protect('serverId');
    protect('usingHamachi');
    protect('hamachiPassword');
    protect('description');
    protect('hostId');
    protect('hostName');
}

emit('games:update', this);