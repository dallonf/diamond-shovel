define(function(require, exports, module) {

var ko = require('knockout')
  , app = require('app')
  , state = exports;

state.username = ko.observable();
state.password = ko.observable();

state.error = ko.observable();

state.login = function() {
  var credentials = {
      username: state.username()
    , password: state.password()
  };

  state.error(null);

  dpd.users.login(credentials, function(res, err) {
    if (err) {
      state.error(err.message);
      return;
    }

    state.username(null);
    state.password(null);
    dpd.users.me(function(user) {
      app.currentUser(user);
    });
  });
};

});