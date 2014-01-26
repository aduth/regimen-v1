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

    initialize: function() {
      app.vent.on('change:week', this.expandFirst, this);
    },

    onRender: function() {
      this.expandFirst();
    },

    expandFirst: function() {
      // Expand first child and collapse all others
      var isFirstExpanded = false;
      this.children.each(function(child) {
        child.toggleExpanded(!isFirstExpanded);
        isFirstExpanded = true;
      });
    }
  });

  return Workout;

});
