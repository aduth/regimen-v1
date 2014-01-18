define([
  'marionette',
  'app',
  'modules/exercise/list/view',
  'hbs!modules/workout/list/templates/layout'
], function(Marionette, app, Exercise, tmplWorkoutLayout) {

  var Workout = app.module('Workout');

  Workout.List = { };

  Workout.List.WorkoutLayout = Marionette.Layout.extend({
    template: tmplWorkoutLayout,
    regions: {
      exercisesRegion: '.exercises'
    },
    ui: {
      contentBox: '.content-box'
    },
    events: {
      'click .expander': 'toggleExpanded'
    },
    onRender: function() {
      this.exercisesRegion.show(new Exercise.List.CollectionView({
        collection: this.model.get('exercises')
      }));
    },
    toggleExpanded: function() {
      this.ui.contentBox.toggleClass('expanded');
    }
  });

  Workout.List.WorkoutCollectionView = Marionette.CollectionView.extend({
    itemView: Workout.List.WorkoutLayout
  });

  return Workout;

});
