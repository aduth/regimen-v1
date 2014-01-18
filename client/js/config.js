require.config({

  deps: ['entry'],

  paths: {
    jquery: 'vendor/jquery/jquery',
    underscore: 'vendor/underscore/underscore',
    backbone: 'vendor/backbone/backbone',
    'backbone.relational': 'vendor/backbone-relational/backbone-relational',
    marionette: 'vendor/marionette/lib/backbone.marionette',
    handlebars: 'vendor/handlebars/handlebars',
    hbs: 'vendor/hbs/hbs',
    json2: 'vendor/hbs/hbs/json2',
    i18nprecompile: 'vendor/hbs/hbs/i18nprecompile',
    fastclick: 'vendor/fastclick/lib/fastclick'
  },

  hbs: {
    disableI18n: true
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
    handlebars: {
      exports: 'Handlebars'
    }
  }

});
