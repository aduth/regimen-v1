define([
  'marionette',
  'app'
], function(Marionette, app) {

  var Auth = app.module('Auth');

  Auth.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'auth/': 'verifySession',
      'auth/login': 'login'
    }
  });

  var API = {
    verifySession: function() {
      throw new Error('NYI');
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
