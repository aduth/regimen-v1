define([
  'marionette',
  'app',
  'hbs!modules/auth/form/templates/layout',
  'entities/user'
], function(Marionette, app, tmplAuthLayout) {

  var Auth = app.module('Auth');

  Auth.Form = { };

  Auth.Form.Layout = Marionette.Layout.extend({
    template: tmplAuthLayout
  });

  return Auth;

});
