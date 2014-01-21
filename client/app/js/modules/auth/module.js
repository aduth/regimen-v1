define([
  'marionette',
  'app',
  'modules/auth/login/view',
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
      app.mainRegion.show(new Auth.Login.Layout());
    }
  };

  Auth.addInitializer(function() {
    var router = new Auth.Router({
      controller: API
    });
  });

  app.reqres.setHandler('auth:login', function() {
    app.Router.navigate('/auth/login');
    app.vent.trigger('auth:login');
    return API.login();
  });

  return Auth;

});
