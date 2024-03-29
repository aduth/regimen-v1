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
      if (this.model.get('week') > 1) {
        this.showWeek(-1);
      }
    },

    showNextWeek: function() {
      this.showWeek(1);
    },

    showWeek: function(increment) {
      var newWeek = this.model.adjustWeek(increment);
      app.vent.trigger('change:week', this.model);
      app.request('regimen:update:week', this.model.get('id'), newWeek);
    }
  });

  return Regimen;

});
