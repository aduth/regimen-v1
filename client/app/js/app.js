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
    Backbone.history.start({ pushState: true });
    app.Router = new AppRouter();
  });

  return app;

});
