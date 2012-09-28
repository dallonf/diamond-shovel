require.config({
  baseUrl: "/js",
  paths: {
      "knockout": "lib/knockout-2.1.0"
    , "knockout-mapping": "lib/knockout.mapping-latest"
    , "underscore": "lib/underscore-min"
    , "backbone": "lib/backbone-min"
    , "jquery-ui": "lib/jquery-ui-1.8.23.custom.min"
    , "uikit": "lib/ui"
  },
  shim: {
    "underscore": {
      exports: '_'
    },
    "backbone": {
      deps: ["underscore"],
      exports: "Backbone"
    },
    "uikit": {
      exports: 'ui'
    }
  }
});

define(function(require, module, exports) {

  var ko = require('knockout')
    , appState = require('app')
    , Router = require('router');

  dpd.users.me(function(user, err) {
    appState.currentUser(user);
    appState.start();
    $('#app-container').show();
    $('body').removeClass('loading');
    ko.applyBindings(appState);
  });

});