define(function(require, exports, module) {

var ko = require('knockout')
  , app = require('app');

function create(previousUrl) {

  var state = {
      username: ko.observable()
    , password: ko.observable()
    , confirmPassword: ko.observable()
    , email: ko.observable()

    , errors: ko.observable({})

    , usernameAvailable: ko.observable()
    , confirmPasswordBlurred: ko.observable(false)
  };

  state.goBack = function() {
    app.navigate(previousUrl || "", {trigger: true});  
  };

  state.register = function() {
    if (state.password() !== state.confirmPassword()) return state.confirmPasswordBlurred(true);

    var user = {
        username: state.username()
      , password: state.password()
      , email: state.email()
    }

    state.errors({});

    dpd.users.post(user, function(res, err) {
      if (err) {
        state.errors(err.errors || {});
        if (err.message) alert(err.message);
        return;
      }

      dpd.users.login({
          username: res.username
        , password: state.password()
      }, function() {
        dpd.users.me(function(user, err) {
          app.currentUser(user);
          state.goBack();
        });
      });
    });
  }

  state.usernameError = ko.computed(function() {
    if (state.errors().username) return state.errors().username;
    if (state.username && state.usernameAvailable() === false) {
      return "That username is already registered";
    } else if (state.username && state.usernameAvailable() === true) {
      return "Username is available!";
    }
  });

  state.passwordError = ko.computed(function() {
    if (state.errors().password) return state.errors().password;
  });

  state.confirmPasswordError = ko.computed(function() {
    if (state.password() && state.confirmPasswordBlurred() && state.password() !== state.confirmPassword()) {
      return "Passwords do not match";
    } else {
      return;
    }
  }, state);

  state.emailError = ko.computed(function() {
    if (state.errors().email) return state.errors().email;
  });

  ko.computed(function() {
    if (state.username()) {
      dpd.users.get({$limit: 1, username: state.username()}, function(res, err) {
        if (res.length) {
          state.usernameAvailable(false);
        } else {
          state.usernameAvailable(true);
        }
      });
    }
  }, state).extend({throttle: 100});

  return state;
}

module.exports = create;

});