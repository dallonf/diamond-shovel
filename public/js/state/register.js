define(function(require, exports, module) {

var ko = require('knockout');

function create() {
  var state = {
      username: ko.observable()
    , password: ko.observable()
    , confirmPassword: ko.observable()
    , email: ko.observable()
  };

  state.register = function() {
    alert(state.username() + " / " + state.password());
  }

  return state;
}

module.exports = create;

});