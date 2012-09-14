define(function(require, exports, module) {

var ko = require('knockout');

ko.bindingHandlers.element = {
  init: function(element, valueAccessor) {
    var value = valueAccessor();
    value(element);
  }
};

});