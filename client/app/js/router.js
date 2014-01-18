define([
  'backbone',
  'marionette',
], function(Backbone, Marionette) {

  var AppRouter = Backbone.Router.extend({
    autoload: {
      '^regimen/*': 'regimen',
      '^auth/*': 'auth'
    },

    routes: {
      '*notFound': 'notFound'
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

    notFound: function(path) {
      for (var autoloadPath in this.autoload) {
        if (new RegExp(autoloadPath).test(path)) return;
      }

      this.defaultToAuth();
    },

    defaultToAuth: function() {
      this.navigate('auth/', { trigger: true });
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
