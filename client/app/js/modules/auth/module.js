define([
  'marionette',
  'app',
  'modules/auth/form/view',
  'entities/user'
], function(Marionette, app, Auth) {

  var Auth = app.module('Auth');

  Auth.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'auth/': 'verifySession',
      'auth/login': 'login'
    }
  });

  var API = {
    verifySession: function() {
      var requestCurrentUser = app.request('user:current');

      $.when(requestCurrentUser).done(function(user) {
        if (!user) {
          app.mainRegion.show(new Auth.Form.Layout());
        } else {
          var lastRegimen = user.get('lastRegimen');
          if (lastRegimen) {
            // Show last regimen
          } else {
            // Show creation screen
          }
        }
      });

      return requestCurrentUser;
    },
    login: function() {
      throw new Error('NYI');
    }
  };

  Auth.addInitializer(function() {
    var router = new Auth.Router({
      controller: API
    });
  });

  return Auth;

});
