define(function(require, exports, module) {

var Backbone = require('backbone')
  , appState = require('app')
  , indexState = require('state/index')
  , registerState = require('state/register')
  , createState = require('state/create');

var CustomRouter = Backbone.Router.extend({
  routes: {
      "": "index"
    , "register": "register"
    , "create": "create"
    , "lobby/:id": "lobby"
    , "*fallback": "fallback"
  },

  index: function() {
    appState.setPage('index', indexState());
  },

  register: function() {
    appState.setPage('register', registerState());
  },

  create: function() {
    appState.setPage('create', createState());
  },

  lobby: function(id) {
    appState.setPage('lobby', {id: id});
  },

  fallback: function() {
    this.navigate("", {trigger: true});
  }
});

module.exports = CustomRouter;

});