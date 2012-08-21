define(function(require, exports, module) {

var ko = require('knockout');

ko.bindingHandlers.scrollTo = {
  init: function(element, valueAccessor, allBindingsAccessor, vm) {
    var value = valueAccessor();
    if (vm.postbox) {
      vm.postbox.subscribe(function() {
        $(document).scrollTop($(element).offset().top - 10);
      }, vm, value);
    } else {
      throw new Error("ViewModel must have a postbox to use the scrollTo binding");
    }
  }
};

});