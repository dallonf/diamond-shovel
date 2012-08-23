define(function(require, exports, module) {

var ko = require('knockout')
  , koMapping = require('knockout-mapping')
  , dateFormats = require('util/date-formats')
  , timeUnits = require('util/time-units');

function create(id) {
  var state = {
      id: id
    , date: ko.observable()
    , description: ko.observable()
    , players: ko.observableArray()


    , now: ko.observable(new Date())
    , loaded: ko.observable(false)
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
  
  loadGame();

  function loadGame() {
    dpd.games.get(id, function(res, err) {
      if (err) return;
      koMapping.fromJS(res, null, state);
      state.loaded(true);
    });
  }

  dpd.games.on('update', function(game) {
    if (game.id === id) {
      koMapping.fromJS(game, null, state);
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