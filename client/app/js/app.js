define([
  'backbone',
  'marionette',
  'router'
], function(Backbone, Marionette, AppRouter) {

  var app = new Marionette.Application();

  app.addRegions({
    headerRegion: '#headerRegion',
    mainRegion: '#mainRegion',
    iterate: '#iteration'
  });

  app.on('initialize:after', function() {
    var modules = ['auth', 'exercise', 'regimen', 'set', 'workout'].map(function(module) {
      return 'modules/' + module + '/module';
    });

    require(modules, function() {
      app.Router = new AppRouter();
      Backbone.history.start({ pushState: true });
    });
  });

  return app;

});
