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

    onExerciseComplete: function() {
      this.complete = true;
      this.logProgress();
      this.trigger('completed');
    },

    logProgress: function(regimen) {
      var requestCurrentRegimen = app.request('regimen:current');
      $.when(requestCurrentRegimen).done(function(regimen) {
        var regimenId = regimen.get('id'),
          exerciseId = this.model.get('id'),
          week = regimen.get('week'),
          increment = 1;

        app.request('progress:create', regimenId, exerciseId, week, increment);
      }.bind(this));
    }
  });

  Exercise.List.CollectionView = Marionette.CollectionView.extend({
    itemView: Exercise.List.Layout,

    initialize: function() {
      this.on('itemview:completed', this.saveProgressOnCompletion, this);
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
    }
  });

  return Exercise;

});
