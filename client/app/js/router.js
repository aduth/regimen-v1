define([
  'backbone',
  'marionette',
], function(Backbone, Marionette) {

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
        if (handler.route.test(fragment) && handler.route.toString() !== '/^(.*?)$/') {
          handler.callback(fragment);
          return true;
        }
      })) {
        this.navigate('', { trigger: true });
      }
    }
  });

  return AppRouter;

});
