define(function(require, exports, module) {

var Backbone = require('backbone')
  , appState = require('app-state');

var CustomRouter = Backbone.Router.extend({
  routes: {
      "": "index"
    , "register": "register"
  },

  index: function() {
    appState.currentPage('index');
  },

  register: function() {
    appState.currentPage('register');
  },

  start: function() {
    Backbone.history.start({pushState: true});

    if (Backbone.history && Backbone.history._hasPushState) {

      // Use delegation to avoid initial DOM selection and allow all matching elements to bubble
      $(document).delegate("a", "click", function(evt) {
        // Get the anchor href and protcol
        var href = $(this).attr("href");
        var protocol = this.protocol + "//";

        // Ensure the protocol is not part of URL, meaning its relative.
        // Stop the event bubbling to ensure the link will not cause a page refresh.
        if (href.slice(protocol.length) !== protocol) {
          evt.preventDefault();

          // Note by using Backbone.history.navigate, router events will not be
          // triggered.  If this is a problem, change this to navigate on your
          // router.
          Backbone.history.navigate(href, true);
        }
      });

    }
  }

});

module.exports = new CustomRouter();

});