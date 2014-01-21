define([
  'marionette',
  'app',
  'hbs!modules/auth/common/templates/layout',
  'entities/user'
], function(Marionette, app, tmplAuthLayout) {

  var Auth = app.module('Auth');

  Auth.Common = { };

  Auth.Common.Layout = Marionette.Layout.extend({
    template: tmplAuthLayout,

    regions: {
      contentRegion: '.auth-content'
    }
  });

  return Auth;

});
