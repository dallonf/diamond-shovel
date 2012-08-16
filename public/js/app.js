define(function(require, exports, module) {

var ko = require('knockout')
  , Router = require('router')
  , loginState = require('state/login')
  , state = exports;

state.currentPage = ko.observable("index");
state.pageState = ko.observable();

state.currentUser = ko.observable();

state.loginState = loginState;

state.setPage = function(page, pageState) {
  pageState = pageState || {};

  state.pageState(null); // Null out the page state so it doesn't try to render when we change pages
  state.currentPage(page);
  state.pageState(pageState);
};

state.logout = function() {
  dpd.users.logout(function(res, err) {
    if (!err) {
      state.currentUser(null);
    }
  });
}

state.start = function() {
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

state.navigate = function() {
  state.router.navigate.apply(state.router, arguments);
};

state.isTwoColumn = ko.computed(function() {
  return state.currentPage() !== "register";
}, state);

state.router = new Router();

});