define(function(require, exports, module) {

var ko = require('knockout')
  , koMapping = require('knockout-mapping')
  , app = require('app')
  , months = require('util/months')
  , timeUnits = require('util/time-units')
  , dateFormats = require('util/date-formats')
  , createGame = require('./game-listing')
  , PAGE_SIZE = 5;

function create() {
  var state = {
      games: ko.observableArray()
    , loaded: ko.observable(false)
    , moreAvailable: ko.observable(false)
    , now: ko.observable(new Date())
    , loadingMore: ko.observable(false)
  };  

  var mapping = {
    'games': {
      copy: ['id'],
      key: function(data) {
        return ko.utils.unwrapObservable(data.id);
      },
      create: function(options) {
        return createGame(options.data, state.now);
      }
    }
  };

  state.timeCutoff = ko.computed(function() {
    return state.now().getTime() - timeUnits.HALF_HOUR;
  });

  state.orderedGames = ko.computed(function() {
    var list = state.games();

    list = list.filter(function(g) {
      return g.timeMillis() > state.timeCutoff();
    }).sort(function(a, b) {
      return a.timeMillis() - b.timeMillis();
    });

    return list;
  }, state);

  function loadGames() {
    dpd.games.get({timeMillis: {$gt: state.timeCutoff()}, $limit: PAGE_SIZE + 1, $sort: {timeMillis: 1}}, function(res, err) {
      if (err) return;
      state.loaded(true);

      if (res.length > PAGE_SIZE) {
        res.pop();
        state.moreAvailable(true);
      } else {
        state.moreAvailable(false);
      }

      koMapping.fromJS({
        games: res
      }, mapping, state);
    });
  }

  state.loadGames = loadGames;

  state.loadMore = function(){
    var games = koMapping.toJS(state.orderedGames())
      , lastGame = games[games.length - 1]
      , lastGameTime = lastGame.timeMillis
      , gameIds;

    gameIds = games.map(function(g) {
      return g.id;
    });

    state.loadingMore(true);
    dpd.games.get({timeMillis: {$gte: lastGameTime}, id: {$nin: gameIds}, $limit: PAGE_SIZE + 1, $sort: {timeMillis: 1}}, function(res, err) {
      state.loadingMore(false);
      if (err) return;

      if (res.length > PAGE_SIZE) {
        res.pop();
        state.moreAvailable(true);
      } else {
        state.moreAvailable(false);
      }

      var allGames = games.concat(res);

      koMapping.fromJS({
        games: allGames
      }, mapping, state);
    });
  };

  dpd.games.on('create', function(game) {
    var games = state.orderedGames()
      , lastGame = games[games.length - 1];

    if ((!state.moreAvailable() && state.orderedGames().length < PAGE_SIZE) || game.timeMillis < lastGame.timeMillis()) {
      state.games.push(createGame(game, state.now));  
    } else {
      state.moreAvailable(true);
    }
  });

  dpd.games.on('update', function(game) {
    state.games().forEach(function(g) {
      if (g.id == game.id) {
        koMapping.fromJS(game, null, g);
        return false;
      }
    });
  });

  dpd.games.on('remove', function(game) {
    state.games().forEach(function(g) {
      if (g.id == game.id) {
        state.games.remove(g);
        if (state.orderedGames.length < PAGE_SIZE) {
          loadGames();
        }
        return false;
      }
    });
  });

  loadGames();

  var reloadTimeout = setInterval(function() {
    if (state.orderedGames.length < PAGE_SIZE) {
      loadGames();
    }
  }, timeUnits.MINUTE);

  var nowTimeout = setInterval(function() {
    state.now(new Date());
  }, 30*timeUnits.SECOND);

  state._close = function() {
    clearInterval(nowTimeout);
    clearInterval(reloadTimeout);
  };

  return state;
}

module.exports = create;

});