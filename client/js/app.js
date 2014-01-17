define([
  'backbone',
  'marionette'
], function(Backbone, Marionette) {

  var app = new Marionette.Application();

  app.addRegions({
    headerRegion: '#headerRegion',
    mainRegion: '#mainRegion',
    iterate: '#iteration'
  });

  app.on('initialize:after', function() {
    require([
      'modules/regimen/module'
    ], function(RegimenModule) {
      Backbone.history.start({ pushState: true });
    });
  });

  return app;

});
