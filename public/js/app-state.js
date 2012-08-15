define(function(require, exports, module) {

var ko = require('knockout')
  , state;

state = module.exports = {
  currentPage: ko.observable("index")
};

state.isTwoColumn = ko.computed(function() {
  return state.currentPage() !== "register";
}, state);

});