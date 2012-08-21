define(function(require, exports, module) {

var ko = require('knockout')
  , app = require('app')
  , loading = require('loading')
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

  loading.add();

  dpd.users.login(credentials, function(res, err) {
    if (err) {
      loading.remove();
      state.error(err.message);
      return;
    }

    state.username(null);
    state.password(null);
    dpd.users.me(function(user) {
      loading.remove();
      app.currentUser(user);
    });
  });
};

});