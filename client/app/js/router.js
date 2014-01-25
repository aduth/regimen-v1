define([
  'marionette'
], function(Marionette) {

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'home',
      '*undefined': '404'
    },

    home: function() {
      this.navigate('auth/verify', { trigger: true });
    },

    404: function(fragment) {
      if (!_.any(Backbone.history.handlers, function(handler) {
        // Shortcut to any matching routes
        if (handler.route.test(fragment) && handler.route.toString() !== '/^(.*?)$/') {
          handler.callback(fragment);
          return true;
        }
      })) {
        // If no routes exist, redirect to 404 view
        this.navigate('', { trigger: true });
      }
    }
  });

  return AppRouter;

});
