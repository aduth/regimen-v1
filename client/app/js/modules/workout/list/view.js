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
        this.trigger('expanded');
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
      this.on('itemview:expanded', this.collapseSiblingsOnExpand, this);
      this.on('itemview:expanded', this.saveWorkoutProgress, this);
    },

    onRender: function() {
      var requestCurrentRegimen = app.request('regimen:current');
      $.when(requestCurrentRegimen).done(function(regimen) {
        var workoutIndex = regimen.get('workout');

        if (workoutIndex) {
          // If resuming previous workout, expand
          this.expandWorkoutAtIndex(workoutIndex);
        } else {
          // Otherwise, show first
          this.expandFirst();
        }
      }.bind(this));
    },

    expandFirst: function() {
      this.children.first().toggleExpanded(true);
    },

    expandWorkoutAtIndex: function(workoutIndex) {
      var workoutChild = this.children.findByIndex(workoutIndex);
      workoutChild.toggleExpanded(true);
    },

    collapseSiblingsOnExpand: function(expandedChild) {
      this.children.each(function(child) {
        // Collapse child unless source of event trigger
        if (child.cid !== expandedChild.cid) {
          child.toggleExpanded(false);
        }
      });
    },

    saveWorkoutProgress: function(workoutChild) {
      var newIndex = _.keys(this.children._views).indexOf(workoutChild.cid),
        requestCurrentRegimen = app.request('regimen:current');

      $.when(requestCurrentRegimen).done(function(regimen) {
        var currentIndex = regimen.get('workout');

        if (currentIndex !== newIndex) {
          regimen.set('workout', newIndex);
          app.request('regimen:update:workout', regimen.get('id'), newIndex);
        }
      }.bind(this));
    }
  });

  return Workout;

});
