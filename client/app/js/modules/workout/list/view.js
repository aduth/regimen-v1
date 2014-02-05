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

    toggleExpanded: function(state) {
      var isExpanding = typeof state === 'boolean' ? state : !this.ui.contentBox.hasClass('expanded');
      this.ui.contentBox.toggleClass('expanded', isExpanding);

      // Render sets if visible
      if (isExpanding) {
        var exercisesView = new Exercise.List.CollectionView({
          collection: this.model.get('exercises')
        });

        this.exercisesRegion.show(exercisesView);
      }

      // Slide display
      this.exercisesRegion.ensureEl();
      this.exercisesRegion.$el['slide' + (isExpanding ? 'Down' : 'Up')]();
    }
  });

  Workout.List.WorkoutCollectionView = Marionette.CollectionView.extend({
    itemView: Workout.List.WorkoutLayout,

    initialize: function(options) {
      app.vent.on('change:week', this.expandFirst, this);

      this.regimen = options.regimen;
    },

    onRender: function() {
      var workoutIndex = this.regimen.get('workout');

      if (workoutIndex) {
        // If resuming previous workout, expand
        this.expandWorkout(workoutIndex);
      } else {
        // Otherwise, show first
        this.expandFirst();
      }
    },

    expandFirst: function() {
      // Expand first child and collapse all others
      var isFirstExpanded = false;
      this.children.each(function(child) {
        child.toggleExpanded(!isFirstExpanded);
        isFirstExpanded = true;
      });
    },

    expandWorkout: function(workoutIndex) {
      var workoutChild = this.children.findByIndex(workoutIndex);
      workoutChild.toggleExpanded(true);
    }
  });

  return Workout;

});
