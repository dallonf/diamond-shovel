define(function(require, exports, module) {

var ko = require('knockout');

ko.bindingHandlers.blink = {
  init: function(element, valueAccessor, allBindingsAccessor, vm) {
    var value = valueAccessor(), allBindings = allBindingsAccessor();
    var duration = allBindings.blinkDuration || 200;
     
    value.subscribe(function() {
      $(element).hide();
      setTimeout(function() {
        $(element).show();
      }, duration);
    }, vm, 'blink');
  }
};

});