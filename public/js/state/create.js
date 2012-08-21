define(function(require, exports, module) {

var ko = require('knockout')
  , app = require('app')
  , months = require('util/months')
  , timeUnits = require('util/time-units')
  , daysOfWeek = require('util/days-of-week');

require('bindings/integer-value');
require('bindings/datepicker');
require('bindings/scroll-to');

function create() {
  var state = {
      type: ko.observable()
    , maxPlayers: ko.observable(16)
    , isPublic: ko.observable(true)
    , serverIp: ko.observable()
    , usingHamachi: ko.observable(false)
    , hamachiNetwork: ko.observable()
    , hamachiPassword: ko.observable() 
    , description: ko.observable()

    , date: ko.observable(isolateDate(new Date()))
    , time: ko.observable()

    , errors: ko.observable()

    , months: months

    , postbox: new ko.subscribable()
  };

  var now = new Date()
    , tomorrow = new Date(now.getTime() + timeUnits.DAY);

  state.dateTime = ko.computed({
      read: function() {
        var date = state.date() || new Date();
        var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), state.time(), state.time() % 1 * 60);
        return newDate;
      }
    , write: function(value) {
        if (!value instanceof Date) throw new TypeError("Must be a date")
        setDateFromDateTime(value);
      }
    , owner: state
  });

  state.dateHelpText = ko.computed(function() {
    var difference = state.date().getTime() - isolateDate(new Date()).getTime();

    if (difference < 0) {
      return "(in the past)";
    } else if (difference < timeUnits.DAY) {
      return "(today)";
    } else if (difference < timeUnits.DAY*2) {
      return "(tomorrow)";
    } else if (difference < timeUnits.WEEK * 2) {
      return "(in " + (difference / timeUnits.DAY).toFixed(0) + " days)";
    } else if (difference < timeUnits.MONTH) {
      return "(in " + (difference / timeUnits.WEEK).toFixed(0) + " weeks)";
    } else {
      return "(in " + (difference / timeUnits.MONTH).toFixed(0) +  " months)";
    }
  }, state);

  state.timeHelpText = ko.computed(function() {
    var difference = state.dateTime().getTime() - new Date().getTime()
      , hours = difference / timeUnits.HOUR;

    if (hours < 0) {
      return "(in the past)";
    } else if (hours < 0.75) {
      return "(very soon)";
    } else if (hours < 1.75) {
      return "(in an hour)";
    } else if (hours <= 24.5) {
      return "(in " + hours.toFixed(0) + " hours)";
    }
  });

  state.dayOfWeek = ko.computed(function() {
    return "(" + daysOfWeek[state.dateTime().getDay()] + ")";
  });

  state.times = ko.computed(function() {
    var times = []
      , i
      , hour
      , ampm;

    for (i = 0; i < 24; i++) {
      hour = (i % 12);
      ampm = i >= 12 ? "pm" : "am";

      if (hour === 0) hour = 12;
      hour = hour.toString();

      times.push({text: hour + ":00 " + ampm, value: i});
      times.push({text: hour + ":30 " + ampm, value: i + 0.5});
    }
    return times;
  });

  state.submit = function() {
    var game = {
        type: state.type()
      , maxPlayers: state.maxPlayers()
      , date: state.dateTime().toString()
      , isPublic: state.isPublic()
      , serverIp: state.serverIp()
      , usingHamachi: state.usingHamachi()
      , description: state.description()
    }

    if (game.usingHamachi) {
      game.hamachiNetwork = state.hamachiNetwork;
      game.hamachiPassword = state.hamachiPassword;
    }

    state.errors(null);
    dpd.games.post(game, function(res, err) {
      if (err) {
        var errors = [];

        if (err.message) {
          errors.push(err.message);
        }

        if (err.errors) {
          Object.keys(err.errors).forEach(function(k) {
            errors.push(err.errors[k]);
          });
        }

        
        state.errors(errors);
        state.postbox.notifySubscribers(null, 'scrollToError');
        return;
      }

      app.navigate('', true);
    });

    // state.errors([
    //     "You must construct additional pylons"
    //   , "You need to download more RAM" 
    //   ]);

    // state.postbox.notifySubscribers(null, 'scrollToError');
  };

  var setDateFromDateTime = function(value) {
    value = value || state.dateTime();
    state.date(isolateDate(value));

    var time = value.getHours() + value.getMinutes()/60.0;
    time = Math.round(time * 2) / 2; //Round to the half-hour
    state.time(time);
  };

  // state.date.subscribe(function(newValue) {
  //   //Changing the date should recalcuate everything
  //   setTimeout(function() {
  //     setDateFromDateTime();
  //   }, 1);
  // });

  // state.month.subscribe(function(newValue) {
  //   var targetMonth = months.indexOf(newValue);
  //   setTimeout(function() {
  //     var iterations = 4;
  //     while(state.dateTime().getMonth() !== targetMonth) {
  //       state.date(state.date() - 1);
  //       iterations--;
  //       if (iterations <= 0) break;
  //     }
  //   }, 1);
  // });


  state.dateTime(tomorrow);


  return state;
}

function isolateDate(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

module.exports = create;

});