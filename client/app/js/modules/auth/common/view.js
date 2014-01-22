define([
  'marionette',
  'app',
  'hbs!modules/auth/common/templates/layout',
  'entities/user'
], function(Marionette, app, tmplAuthLayout) {

  var Auth = app.module('Auth');

  Auth.Common = { };

  Auth.Common.Layout = Marionette.Layout.extend({
    tagName: 'section',

    className: 'auth',

    template: tmplAuthLayout,

    ui: {
      brand: '.brand'
    },

    onShow: function() {
      _.defer(function($el) {
        $el.addClass('active');
      }, this.$el);
    },

    regions: {
      contentRegion: '.auth-content'
    }
  });

  return Auth;

});
