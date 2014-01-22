define([
  'marionette',
  'app',
  'modules/auth/common/view',
  'modules/auth/login/view',
  'modules/auth/verify/view',
  'entities/user'
], function(Marionette, app, Auth) {

  var Auth = app.module('Auth');

  Auth.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'auth/verify': 'verifySession',
      'auth/login': 'login'
    }
  });

  var API = {
    verifySession: function() {
      // Show loading
      var layout = new Auth.Common.Layout();
      app.splashRegion.show(layout);

      layout.contentRegion.show(new Auth.Verify.SpinnerView());

      // Request user
      var requestCurrentUser = app.request('user:current');

      $.when(requestCurrentUser).done(function(user) {
        if (!user) {
          app.request('auth:login');
        } else {
          var lastRegimen = user.get('lastRegimen');
          if (lastRegimen) {
            app.request('regimen:show', lastRegimen);
          } else {
            // Show creation screen
          }
        }
      });

      return requestCurrentUser;
    },

    login: function() {
      var layout = new Auth.Common.Layout();
      app.splashRegion.show(layout);

      layout.contentRegion.show(new Auth.Login.Form());
    }
  };

  Auth.addInitializer(function() {
    var router = new Auth.Router({
      controller: API
    });

    app.mainRegion.show = function(view) {
      // Fade out splash before displaying content in main region
      app.splashRegion.ensureEl();
      app.splashRegion.$el.fadeOut();

      // Restore original show function
      app.mainRegion.show = Backbone.Marionette.Region.prototype.show;
      app.mainRegion.show(view);
    };
  });

  app.reqres.setHandler('auth:login', function() {
    app.Router.navigate('/auth/login');
    app.vent.trigger('auth:login');
    return API.login();
  });

  app.reqres.setHandler('auth:verify', function() {
    app.Router.navigate('/auth/verify');
    app.vent.trigger('auth:verify');
    return API.verifySession();
  });

  return Auth;

});
