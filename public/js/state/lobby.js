define(function(require, exports, module) {

var ko = require('knockout')
  , koMapping = require('knockout-mapping')
  , dateFormats = require('util/date-formats')
  , timeUnits = require('util/time-units')
  , app = require('app');

function create(id) {

  var mapping = {
      copy: ['id']
    , 'players': {
          copy: ['id']
        , key: function(data) {
          return ko.utils.unwrapObservable(data.id);
        }
      }
  };


  var state = {
      id: id
    , date: ko.observable()
    , description: ko.observable()
    , players: ko.observableArray()
    , hostId: ko.observable()

    , now: ko.observable(new Date())
    , loaded: ko.observable(false)
    , saveLoading: ko.observable(false)
  }

  state.playerCount = ko.computed(function() {
    return state.players().length + 1; // Including host
  });

  state.countdown = ko.computed(function() {
    return dateFormats.countdown(new Date(state.date()), state.now());
  }, state);

  state.fullTime = ko.computed(function() {
    return dateFormats.full(new Date(state.date()));
  }, state);

  state.isHost = ko.computed(function() {
    return app.currentUser() && state.hostId() == app.currentUser().id;
  });

  state.isPlaying = ko.computed(function() {
    return state.isHost() || (app.currentUser() && state.players().some(function(p) {
      return p.id() === app.currentUser().id; 
    }));
  });

  state.join = function() {
    state.saveLoading(true);
    dpd.joingame.post(state.id, function() {
      state.saveLoading(false);
    });
  };

  state.leave = function() {
    state.saveLoading(true);
    dpd.leavegame.post(state.id, function() {
      state.saveLoading(false);
    });
  };
  
  loadGame();

  function loadGame() {
    dpd.games.get(id, function(res, err) {
      if (err) return;
      koMapping.fromJS(res, mapping, state);
      state.loaded(true);
    });
  }

  dpd.games.on('update', function(game) {
    if (game.id === id) {
      koMapping.fromJS(game, mapping, state);
    }
  });
  
  var nowTimeout = setInterval(function() {
    state.now(new Date());
  }, timeUnits.SECOND);

  state._close = function() {
    clearInterval(nowTimeout);
  };

  return state;
}

module.exports = create;

});