define(function(require, exports, module) {

var ko = require('knockout');

require('jquery-ui');

ko.bindingHandlers.datepicker = {
  init: function(element, valueAccessor, allBindingsAccessor) {
    var allBindings = allBindingsAccessor()
      , value = valueAccessor()
     ,  options = {};

    if (allBindings.datepickerOptions) {
      options = allBindings.datepickerOptions;
    }

    options.onSelect = function() {
      var date = $(element).datepicker('getDate');
      value(date);
    };

    $(element).datepicker(options);
  }, update: function(element, valueAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor());
    $(element).datepicker('setDate', value);
  }
};


});