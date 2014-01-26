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

    toggleExpanded: function() {
      var isExpanded = this.ui.contentBox.toggleClass('expanded').hasClass('expanded');

      // Render sets if visible
      if (isExpanded) {
        var exercisesView = new Exercise.List.CollectionView({
          collection: this.model.get('exercises')
        });

        this.exercisesRegion.show(exercisesView);
      }

      // Slide display
      this.exercisesRegion.ensureEl();
      this.exercisesRegion.$el.slideToggle(isExpanded);
    }
  });

  Workout.List.WorkoutCollectionView = Marionette.CollectionView.extend({
    itemView: Workout.List.WorkoutLayout
  });

  return Workout;

});
