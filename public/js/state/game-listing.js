define(function(require, exports, module) {

var gameMapping = {
  copy: ['id']
};

var ko = require('knockout')
  , koMapping = require('knockout-mapping')
  , dateFormats = require('util/date-formats')
  , app = require('app');

function createGame(data, now) {
  data = koMapping.fromJS(data, gameMapping);

  data.formattedTime = ko.computed(function() {
    return dateFormats.full(new Date(data.date()));
  }, data);

  data.countdown = ko.computed(function() {
    return dateFormats.countdown(new Date(data.date()), now());
  }, data);


  data.navigate = function() {
    app.navigate('lobby/' + ko.utils.unwrapObservable(data.id), true);
  };

  return data;
}

module.exports = createGame;

});