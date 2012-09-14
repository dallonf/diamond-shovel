define(function(require, exports, module) {

var ko = require('knockout')
  , koMapping = require('knockout-mapping')
  , dateFormats = require('util/date-formats')
  , timeUnits = require('util/time-units')
  , app = require('app');

require('bindings/scroll-to-end');

function create(id) {

  var isActive = true;

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
    , notFound: ko.observable(false)

    , messageText: ko.observable()

    , messages: ko.observableArray()

    , postbox: new ko.subscribable()
  };

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

  dpd.on('game:' + state.id + ':message', function(message) {
    state.messages.push(message);
    setTimeout(function() {
      state.postbox.notifySubscribers(false, 'chatScroll');  
    }, 1);
    
  });

  function loadMessages() {
    dpd.lobbymessages.get({gameId: state.id}, function(res, err) {
      state.messages(res);
      setTimeout(function() {
        state.postbox.notifySubscribers(true, 'chatScroll');
      }, 1);
    });
  }

  ko.computed(function() {
    if (state.isPlaying()) {
      loadMessages();
    } else {
      state.messages([]);
    }
  }, state);

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

  state.deleteGame = function() {
    if (confirm("Delete this game?")) {
      dpd.games.del(id, function(res, err) {
        if (!err) {
          app.navigate("", true);
        }
      });
    }
  };

  state.submitMessage = function() {
    if (state.isPlaying()) {
      dpd.lobbymessages.post({
          gameId: state.id
        , message: state.messageText()
      }, function(res, err) {
        if (!err) {
          state.messageText('');
        }
      });
    }
  };
  
  loadGame();

  function loadGame() {
    state.notFound(null);
    dpd.games.get(id, function(res, err) {
      if (err) return state.notFound(true);
      koMapping.fromJS(res, mapping, state);
      state.loaded(true);
    });
  }

  dpd.games.on('update', function(game) {
    if (game.id === id) {
      koMapping.fromJS(game, mapping, state);
    }
  });

  dpd.games.on('remove', function(game) {
    if (isActive && game.id === id) {
      state.notFound(true);
      state.loaded(false);
      isActive = false;
    }
  });
  
  var nowTimeout = setInterval(function() {
    state.now(new Date());
  }, timeUnits.SECOND);

  state._close = function() {
    clearInterval(nowTimeout);
    isActive = false;
  };

  return state;
}

module.exports = create;

});