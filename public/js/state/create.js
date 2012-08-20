define(function(require, exports, module) {

var ko = require('knockout')
  , months = require('util/months')
  , timeUnits = require('util/time-units');

require('bindings/integer-value');

function create() {
  var state = {
      type: ko.observable()
    , maxPlayers: ko.observable(16)
    , isPublic: ko.observable(true)

    , month: ko.observable()
    , date: ko.observable()

    , months: months
  };

  var now = new Date()
    , tomorrow = new Date(now.getTime() + timeUnits.DAY);

  state.fullDate = ko.computed({
      read: function() {
        //TODO: should be last year if it would otherwise be in the past
        var newDate = new Date(now.getFullYear(), months.indexOf(state.month()), state.date());
        return newDate;
      }
    , write: function(value) {
        if (!value instanceof Date) throw new TypeError("Must be a date")
        setDateFromFullDate(value);
      }
    , owner: state
  });

  state.dateHelpText = ko.computed(function() {
    var difference = state.fullDate().getTime() - new Date().getTime();

    if (difference < 0) {
      return "(in the past)";
    } else if (difference < timeUnits.DAY) {
      return "(today)";
    } else if (difference < timeUnits.DAY*2) {
      return "(tomorrow)";
    } else if (difference < timeUnits.WEEK) {
      return "(in " + (difference / timeUnits.DAY).toFixed(0) + " days)";
    } else if (difference < timeUnits.WEEK * 2) {
      return "(in a week)";
    } else if (difference < timeUnits.MONTH) {
      return "(in " + (difference / timeUnits.WEEK).toFixed(0) + " weeks)";
    }
  }, state);

  var setDateFromFullDate = function(value) {
    value = value || state.fullDate();
    state.date(value.getDate());
    state.month(months[value.getMonth()]);
  };

  state.date.subscribe(function(newValue) {
    //Changing the date should recalcuate everything
    setTimeout(function() {
      setDateFromFullDate();
    }, 1);
  });

  state.month.subscribe(function(newValue) {
    var targetMonth = months.indexOf(newValue);
    setTimeout(function() {
      var iterations = 4;
      while(state.fullDate().getMonth() !== targetMonth) {
        state.date(state.date() - 1);
        iterations--;
        if (iterations <= 0) break;
      }
    }, 1);
  });


  state.fullDate(tomorrow);

  return state;
}

module.exports = create;

});