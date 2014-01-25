define([
  'backbone',
  'marionette',
  'router',
  'constants'
], function(Backbone, Marionette, AppRouter, constants) {

  var app = new Marionette.Application();

  app.addRegions({
    splashRegion: '#splashRegion',
    headerRegion: '#headerRegion',
    mainRegion: '#mainRegion',
    iterate: '#iteration'
  });

  app.on('initialize:after', function() {
    var modules = ['auth', 'exercise', 'regimen', 'set', 'workout'].map(function(module) {
      return 'modules/' + module + '/module';
    });

    require(modules, function() {
      // Override Backbone sync to include Authorization header
      var _sync = Backbone.sync;
      Backbone.sync = function(method, model, options) {
        // Only add header if target is off-domain
        if (model.urlRoot.indexOf(constants.url.api) !== 0) {
          return _sync.call(this, method, model, options);
        }

        $.when(app.request('user:current')).done(function(user) {
          // Inject header
          options.beforeSend = function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + user.get('accessToken'));
          };

          // Call original
          _sync.call(this, method, model, options);
        }).fail(function() {
          app.request('auth:login');
        });
      };

      // Start routing
      app.Router = new AppRouter();
      Backbone.history.start({ pushState: true });
    });
  });

  return app;

});
