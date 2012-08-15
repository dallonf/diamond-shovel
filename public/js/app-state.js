define(function(require, exports, module) {

var ko = require('knockout')
  , state;

state = module.exports = {
    currentPage: ko.observable("index")
  , pageState: ko.observable()
};

state.setPage = function(page, pageState) {
  pageState = pageState || {};

  state.pageState(null); // Null out the page state so it doesn't try to render when we change pages
  state.currentPage(page);
  state.pageState(pageState);
};

state.isTwoColumn = ko.computed(function() {
  return state.currentPage() !== "register";
}, state);

});