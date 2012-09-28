define(function(require, exports, module) {

var Backbone = require('backbone')
  , appState = require('app')
  , indexState = require('state/index')
  , registerState = require('state/register')
  , editState = require('state/edit')
  , lobbyState = require('state/lobby');

var CustomRouter = Backbone.Router.extend({
  routes: {
      "": "index"
    , "register": "register"
    , "create": "create"
    , "lobby/:id": "lobby"
    , "edit/:id": "edit"
    , "*fallback": "fallback"
  },

  index: function() {
    appState.setPage('index', indexState());
  },

  register: function() {
    appState.setPage('register', registerState());
  },

  create: function() {
    appState.setPage('edit', editState());
  },

  lobby: function(id) {
    appState.setPage('lobby', lobbyState(id));
  },

  edit: function(id) {
    appState.setPage('edit', editState(id));
  },

  fallback: function() {
    this.navigate("", {trigger: true});
  }
});

module.exports = CustomRouter;

});