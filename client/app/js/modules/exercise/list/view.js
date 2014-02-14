define([
  'marionette',
  'app',
  'modules/set/list/view',
  'hbs!modules/exercise/list/templates/layout'
], function(Marionette, app, Set, tmplExerciseLayout) {

  var Exercise = app.module('Exercise');

  Exercise.List = { };

  Exercise.List.Layout = Marionette.Layout.extend({
    template: tmplExerciseLayout,

    className: 'exercise',

    regions: {
      setsRegion: '#instructionsRegion'
    },

    onRender: function() {
      var setsView = this.setsView = new Set.List.CollectionView({
        collection: this.model.get('sets')
      });

      setsView.on('completed', this.onExerciseComplete, this);

      this.setsRegion.show(setsView);
    },

    onExerciseComplete: function(progress, increment) {
      this.complete = true;
      this.trigger('completed', progress, increment);
    }
  });

  Exercise.List.CollectionView = Marionette.CollectionView.extend({
    itemView: Exercise.List.Layout,

    initialize: function() {
      this.on('itemview:completed', this.saveProgressOnCompletion, this);
      this.on('itemview:completed', this.logProgress, this);
      this.on('expanded', this.populateProgress, this);
    },

    logProgress: function(childView, progress, increment) {
      var requestCurrentRegimen = app.request('regimen:current');
      var requestCurrentWorkout = app.request('workout:current', this);

      $.when(requestCurrentRegimen, requestCurrentWorkout).done(function(regimen, workoutIndex) {
        var regimenId = regimen.get('id'),
          exerciseId = childView.model.get('_exercise'),
          week = regimen.get('week');

        app.request('progress:create', regimenId, exerciseId, workoutIndex, week, progress, increment);
      });
    },

    saveProgressOnCompletion: function(childView) {
      // Find any incomplete exercises
      var allExercisesComplete = !this.children.any(function(childView) {
        return !childView.complete;
      });

      if (allExercisesComplete) {
        this.incrementWorkout();
      }
    },

    incrementWorkout: function() {
      var requestCurrentRegimen = app.request('regimen:current');
      $.when(requestCurrentRegimen).done(function(regimen) {
        // If all exercises complete, increment workout
        var regimenId = regimen.get('id'),
          nextWorkout = (regimen.get('workout') || 0) + 1,
          programWorkouts = regimen.get('program').get('workouts');

        if (nextWorkout >= programWorkouts.length) {
          // If all workouts in week are complete, increment week
          var nextWeek = (regimen.get('week') || 0) + 1;
          app.request('regimen:update:week', regimenId, nextWeek);
          nextWorkout = 0;
        }

        app.request('regimen:update:workout', regimenId, nextWorkout);
      });
    },

    populateProgress: function() {
      var requestCurrentProgresses = app.request('progress:current');
      var requestCurrentWorkout = app.request('workout:current', this);

      $.when(requestCurrentProgresses, requestCurrentWorkout).done(function(progresses, workoutIndex) {
        this.children.each(function(childView) {
          // Attempt to find progress for exercise
          var exercise = childView.model.get('_exercise'),
            progress = progresses.find(function(progress) {
              return progress.get('workout') === workoutIndex &&
                progress.get('_exercise') === exercise;
            });

          // If match, activate child
          if (progress) {
            childView.setsView.trigger('progress', progress);
          }
        });
      }.bind(this));
    }
  });

  return Exercise;

});
