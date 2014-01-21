define([
  'marionette',
  'app',
  'hbs!modules/auth/login/templates/layout',
  'entities/user'
], function(Marionette, app, tmplAuthLayout) {

  var Auth = app.module('Auth');

  Auth.Login = { };

  Auth.Login.Form = Marionette.Layout.extend({
    template: tmplAuthLayout
  });

  return Auth;

});
