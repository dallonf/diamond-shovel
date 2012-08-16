define(function(require, exports, module) {

var Backbone = require('backbone')
  , appState = require('app')
  , registerState = require('state/register');

var CustomRouter = Backbone.Router.extend({
  routes: {
      "": "index"
    , "register": "register"
  },

  index: function() {
    appState.setPage('index');
  },

  register: function() {
    appState.setPage('register', registerState());
  }
});

module.exports = CustomRouter;

});