define(function(require, exports, module) {

var ko = require('knockout');

ko.bindingHandlers.integerValue = {
  init: function(element, valueAccessor, allBindingsAccessor, vm) {
    var prop = valueAccessor()
      , allBindings = allBindingsAccessor()
      , updateMode = allBindings.valueUpdate || 'blur';

    $(element).val(ko.utils.unwrapObservable(prop));

    if (typeof prop === 'function') {

      if (updateMode === 'afterinput') {
        var keypress = 0; //Wow this is a hack.
        // The intention is to raise an event when
        // a number input is scrolled, but not on a keypress.

        $(element).on('keypress', function(e) {
          keypress++;
          setTimeout(function() {
            keypress--;
          }, 1);
        });
        $(element).on('input', function(e) {
          if (keypress === 0) {
            setProp(element, prop);  
          }
        });
      }

      $(element).blur(function() {
        setProp(element, prop);
      });
    }
  }, update: function(element, valueAccessor) {
    $(element).val(ko.utils.unwrapObservable(valueAccessor()));
  }
};

function setProp(element, prop) {
  var num = parseInt($(element).val(), 10);
  prop(num);
}

});