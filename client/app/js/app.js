define([
  'marionette',
  'router'
], function(Marionette, AppRouter) {

  var app = new Marionette.Application();

  app.addRegions({
    splashRegion: '#splashRegion',
    headerRegion: '#headerRegion',
    mainRegion: '#mainRegion',
    iterate: '#iteration'
  });

  app.on('initialize:after', function() {
    // Pre-load all modules and configuration prior to routing
    var modules = ['auth', 'exercise', 'regimen', 'set', 'workout', 'dashboard', 'progress'];

    var setup = modules.map(function(module) {
      return 'modules/' + module + '/module';
    }).concat([ 'config/sync' ]);

    require(setup, function() {
      // Start routing
      app.Router = new AppRouter();
      Backbone.history.start({ pushState: true });
    });
  });

  return app;

});
