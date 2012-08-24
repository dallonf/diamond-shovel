define(function(require, exports, module) {

var ko = require('knockout')
  , koMapping = require('knockout-mapping')
  , app = require('app');

var state = exports;

var mapping = {};

state.games = ko.observableArray();

state.logout = function() {
  dpd.users.logout(function(res, err) {
    if (!err) {
      app.currentUser(null);
    }
  });
  return false;
}

function loadGames() {
  if (!app.currentUser()) return state.games([]);
  dpd.games.get({
    $or: [{
      hostId: app.currentUser().id
    }, {
      playerIds: app.currentUser().id 
    }],
    $sort: { timeMillis: 1 }
  }, function(res, err) {
    koMapping.fromJS({games: res}, mapping, state);
  });
}

function onUpdate(game) {
  if (!app.currentUser()) return state.games([]);

  var userId = app.currentUser().id;


  if (game.hostId === userId
    || game.playerIds.some(function(p) {return p === userId;})
    || state.games().some(function(g) {return g.id() === game.id;})) {
    loadGames();  
  }
  
}

state.init = function() {
  app.currentUser.subscribe(function(newValue) {
      loadGames();
  });

  dpd.games.on('update', onUpdate);
  dpd.games.on('create', onUpdate);
  dpd.games.on('delete', onUpdate);
}



});