define([
  'marionette',
  'app',
  'vendor/spinjs/spin',
  'entities/user'
], function(Marionette, app, Spinner) {

  var Auth = app.module('Auth');

  Auth.Verify = { };

  Auth.Verify.SpinnerView = Marionette.View.extend({
    render: function() {
      this.startSpinner();
    },

    startSpinner: function() {
      var opts = {
        width: 4,
        radius: 11,
        color: '#fff'
      };

      var spinner = new Spinner(opts).spin(this.el);
    }
  });

  return Auth;

});
