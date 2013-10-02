define([
  'marionette',
  'app',
  'modules/set/list/view',
  'hbars!modules/exercise/list/templates/layout'
], function(Marionette, app, Set, tmplExerciseLayout) {

  var Exercise = app.module('Exercise');

  Exercise.List = { };

  Exercise.List.Layout = Marionette.Layout.extend({
    template: tmplExerciseLayout,
    regions: {
      setsRegion: '.instructions'
    },
    onRender: function() {
      this.setsRegion.show(new Set.List.CollectionView({
        collection: this.model.get('sets')
      }));
    }
  });

  Exercise.List.CollectionView = Marionette.CollectionView.extend({
    itemView: Exercise.List.Layout
  });

  return Exercise;

});
