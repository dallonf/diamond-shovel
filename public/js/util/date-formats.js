define(function(require, exports, module) {

var months = require('./months')
  , timeUnits = require('./time-units')

exports.full = function(date) {
  var month = months[date.getMonth()]
    , ampm = date.getHours() >= 12 ? "pm" : "am"
    , hour = date.getHours() % 12
    , minutes = date.getMinutes().toString();

  if (minutes.length < 2) minutes = "0" + minutes;

  if (hour === 0) hour = 12;

  return hour + ":" + minutes + " " + ampm + ", " + month + " " + date.getDate();
};

exports.countdown = function(date, now) {
  if (!now) now = new Date();

  var difference = date.getTime() - now.getTime();

  if (difference < -timeUnits.MINUTE*30) {
    return "Already started";
  } else if (difference < timeUnits.MINUTE) {
    return "Starting now!";
  } else if (difference < timeUnits.HOUR * 1.5) {
    return "Starts in " + (difference/timeUnits.MINUTE).toFixed(0) + " minutes";
  } else if (difference < timeUnits.HOUR * 48) {
    return "Starts in " + (difference/timeUnits.HOUR).toFixed(0) + " hours";
  } else {
    return "Starts in " + (difference/timeUnits.DAY).toFixed(0) + " days";
  }
};

});