define(function(require, exports, module) {

var ko = require('knockout')
  , koMapping = require('knockout-mapping')
  , app = require('app')
  , months = require('util/months')
  , timeUnits = require('util/time-units')
  , PAGE_SIZE = 5;
  

var gameMapping = {
  copy: ['id']
};

function createGame(data, state) {
  data = koMapping.fromJS(data, gameMapping);

  data.formattedTime = ko.computed(function() {
    var date = new Date(data.date())
      , month = months[date.getMonth()]
      , ampm = date.getHours() >= 12 ? "pm" : "am"
      , hour = date.getHours() % 12
      , minutes = date.getMinutes().toString();

    if (minutes.length < 2) minutes = "0" + minutes;

    if (hour === 0) hour = 12;

    return hour + ":" + minutes + " " + ampm + ", " + month + " " + date.getDate();

  }, data);

  data.countdown = ko.computed(function() {
    var date = new Date(data.date())
      , difference = date.getTime() - state.now().getTime();

    if (difference < timeUnits.MINUTE) {
      return "Starting now!";
    } else if (difference < timeUnits.HOUR * 1.5) {
      return "Starts in " + (difference/timeUnits.MINUTE).toFixed(0) + " minutes";
    } else if (difference < timeUnits.HOUR * 48) {
      return "Starts in " + (difference/timeUnits.HOUR).toFixed(0) + " hours";
    } else {
      return "Starts in " + (difference/timeUnits.DAY).toFixed(0) + " days";
    }
  }, data);


  data.navigate = function() {
    app.navigate('lobby/' + data.id, true);
  };

  return data;
}

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
      key: function(data) {
        return ko.utils.unwrapObservable(data.id);
      },
      create: function(options) {
        return createGame(options.data, state);
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
    state.loaded(false);
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
      state.games.push(createGame(game, state));  
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
    if (orderedGames.length < PAGE_SIZE) {
      loadGames();
    }
  }, timeUnits.MINUTE);

  var nowTimeout = setInterval(function() {
    state.now(new Date());
  }, 30*timeUnits.SECOND);

  state._close = function() {
    clearInterval(nowTimeout);
  };

  return state;
}

module.exports = create;

});