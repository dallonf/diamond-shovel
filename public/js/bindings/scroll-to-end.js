define(function(require, exports, module) {

var ko = require('knockout');

ko.bindingHandlers.scrollToEnd = {
  init: function(element, valueAccessor, allBindingsAccessor, vm) {
    var value = valueAccessor();
    if (vm.postbox) {
      vm.postbox.subscribe(function(force) {
        scrollToEnd($(element), force);
      }, vm, value);
    } else {
      throw new Error("ViewModel must have a postbox to use the scrollTo binding");
    }
  }
};

function scrollToEnd($element, force) {
  var height = $element.innerHeight()
    , scrollTop = $element.scrollTop()
    , childrenHeight
    , lastChildHeight;

  childrenHeight = $element.children().get().reduce(function(prev, curr) {
    return prev + $(curr).outerHeight(true);
  }, 0);

  lastChildHeight = $element.children().last().outerHeight(true);

  if (force || scrollTop >= childrenHeight - height - lastChildHeight - 10) {
    $element.scrollTop(Math.max(childrenHeight - height, 0));
  }
}

});