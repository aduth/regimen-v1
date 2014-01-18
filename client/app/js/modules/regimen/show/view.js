define([
  'marionette',
  'app',
  'hbs!modules/regimen/show/templates/layout',
  'hbs!modules/regimen/show/templates/iterateRegion',
  'entities/regimen'
], function(Marionette, app, tmplRegimenLayout, tmplIterateRegion) {

  var Regimen = app.module('Regimen');

  Regimen.Show = { };

  Regimen.Show.Layout = Marionette.Layout.extend({
    template: tmplRegimenLayout,

    regions: {
      iterateRegion: '#iterateRegion',
      workoutsRegion: '#workoutsRegion'
    }
  });

  Regimen.Show.IterateView = Marionette.ItemView.extend({
    template: tmplIterateRegion,

    ui: {
      navPrevious: 'button[rel=previous]',
      navNext: 'button[rel=next]'
    },

    events: {
      'click button[rel=previous]': 'showPreviousWeek',
      'click button[rel=next]': 'showNextWeek'
    },

    modelEvents: {
      'change': 'render'
    },

    showPreviousWeek: function() {
      this.model.adjustWeek(-1);
    },

    showNextWeek: function() {
      this.model.adjustWeek(1);
    }
  });

  return Regimen;

});
