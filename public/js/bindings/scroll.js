define(function(require, exports, module) {

var ko = require('knockout');

ko.bindingHandlers.scrollX = {
  init: function(element, valueAccessor) {
    var val = valueAccessor();

    if (typeof val === 'function') {
      $(element).scroll(function() {
        val($(element).scrollLeft());
      });
    }
  },
  update: function(element, valueAccessor) {
    var val = ko.utils.unwrapObservable(valueAccessor());
    setTimeout(function() {
      $(element).scrollLeft(val);
    });
  }
};

ko.bindingHandlers.scrollY = {
  init: function(element, valueAccessor) {
    var val = valueAccessor();

    if (typeof val === 'function') {
      $(element).scroll(function() {
        val($(element).scrollTop());
      });
    }
  },
  update: function(element, valueAccessor) {
    var val = ko.utils.unwrapObservable(valueAccessor());
    setTimeout(function() {
      $(element).scrollTop(val);  
    }, 1);
  }
};

});