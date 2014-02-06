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
      this.trigger('completed');
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
        // If all exercises complete, increment workout
        var requestCurrentRegimen = app.request('regimen:current');
        $.when(requestCurrentRegimen).done(function(regimen) {
          var regimenId = regimen.get('id'),
            currentWorkout = regimen.get('workout');

          app.request('regimen:update:workout', regimenId, (currentWorkout || 0) + 1);
        });
      }
    }
  });

  return Exercise;

});
