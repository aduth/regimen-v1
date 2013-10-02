require.config({

  deps: ['entry'],

  paths: {
    jquery: 'vendor/jquery',
    underscore: 'vendor/underscore',
    backbone: 'vendor/backbone',
    marionette: 'vendor/backbone.marionette',
    'backbone.babysitter': 'vendor/backbone.babysitter',
    'backbone.wreqr': 'vendor/backbone.wreqr',
    'backbone.relational': 'vendor/backbone.relational',
    Handlebars: 'vendor/handlebars',
    text: 'vendor/require.text',
    hbars: 'vendor/require.hbars'
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
