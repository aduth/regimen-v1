define([
  'app',
  'marionette',
  'router',
  'constants'
], function(app, Marionette, AppRouter, constants) {
  // Override Backbone sync to include Authorization header
  var _sync = Backbone.sync;
  Backbone.sync = function(method, model, options) {
    var url;

    // Retrieve URL from model/collection
    if (model instanceof Backbone.Model) {
      url = model.urlRoot;
    } else if (model instanceof Backbone.Collection) {
      url = model.url;
    }

    // Only add header if target is off-domain
    if (url.indexOf(constants.url.api) !== 0) {
      return _sync.call(this, method, model, options);
    }

    $.when(app.request('user:current')).done(function(user) {
      // Inject header
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + user.get('accessToken'));
      };

      // Call original
      _sync.call(this, method, model, options).fail(function(xhr) {
        if (xhr.responseJSON && xhr.responseJSON.error === 'invalid_grant') {
          // On expired token, redirect to login
          app.request('auth:login');
        }
      });
    }).fail(function() {
      app.request('auth:login');
    });
  };
});