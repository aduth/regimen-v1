define([
  'marionette',
  'app',
  'hbs!modules/set/list/templates/item'
], function(Marionette, app, tmplSetItem) {

  var Set = app.module('Set');

  Set.List = { };

  Set.List.ItemView = Marionette.ItemView.extend({
    template: tmplSetItem,

    tagName: 'li',

    className: 'instruction',

    modelEvents: {
      'change': 'modelChanged'
    },

    modelChanged: function() {
      this.render();
    },

    initialize: function() {
      app.vent.on('change:week', this.calculateSets, this);
    },

    onRender: function() {
      var isCalculated = !!this.model.get('weight_calc');
      if (!isCalculated) {
        this.calculateSets();
      }
    },

    calculateSets: function() {
      this.model.updateVariables();
    }
  });

  Set.List.CollectionView = Marionette.CollectionView.extend({
    itemView: Set.List.ItemView,

    tagName: 'ol',

    className: 'instructions'
  });

  return Set;

});
