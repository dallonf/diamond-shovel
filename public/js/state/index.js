define(function(require, exports, module) {

var ko = require('knockout')
  , timeUnits = require('util/time-units')
  , koMapping = require('knockout-mapping');

var mapping = {
  'games': {
    key: function(data) {
      return ko.utils.unwrapObservable(data.id);
    },
    create: function(options) {
      var data = options.data;
      data.formattedTime = ko.computed(function() {
        var date = new Date(data.date);
        return date.toLocaleTimeString();
      }, data);
      return data;
    }
  }
};

function create() {
  var state = {
      games: ko.observableArray()
    , loaded: ko.observable(false)
  };  

  function loadGames() {
    var cutoff = Date.now() + timeUnits.HOUR*2;

    dpd.games.get({timeUnits: {$gt: cutoff}, $limit: 10, $sort: {timeMillis: 1}}, function(res, err) {
      if (err) return;
      koMapping.fromJS({
        games: res
      }, mapping, state);
    });
  }


  loadGames();

  return state;
}

module.exports = create;

});