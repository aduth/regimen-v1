require.config({

  deps: ['entry'],

  paths: {
    jquery: 'vendor/jquery/jquery',
    underscore: 'vendor/underscore/underscore',
    backbone: 'vendor/backbone/backbone',
    marionette: 'vendor/marionette/lib/backbone.marionette',
    'backbone.relational': 'vendor/backbone-relational/backbone-relational',
    Handlebars: 'vendor/handlebars/handlebars',
    text: 'vendor/require.text',
    hbars: 'vendor/require.hbars',
    fastclick: 'vendor/fastclick/lib/fastclick'
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    marionette: {
      deps: ['jquery', 'underscore', 'backbone'],
      exports: 'Marionette'
    },
    relational: {
      deps: ['backbone']
    },
    Handlebars: {
      exports: 'Handlebars'
    }
  }

});
