define([
  'backbone',
  'marionette',
], function(Backbone, Marionette) {

  var AppRouter = Backbone.Router.extend({
    autoload: {
      'regimen/*': 'regimen'
    },

    routes: {
      '': 'defaultToRegimen'
    },

    initialize: function() {
      var moduleLoader = function(path, module) {
        return this.loadModule(path, module);
      };

      for (var path in this.autoload) {
        var module = this.autoload[path];
        this.route(path, module, moduleLoader.call(this, path, module));
      }
    },

    defaultToRegimen: function() {
      this.navigate('regimen/1/week/1', { trigger: true });
    },

    loadModule: function(path, module) {
      require(['modules/' + module + '/module'], function() {
        // Manually re-trigger history handler
        Backbone.history.loadUrl(Backbone.history.fragment);
      });
    },
  });

  return AppRouter;

});
