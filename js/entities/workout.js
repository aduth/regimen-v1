define([
  'app',
  'backbone',
  'entities/exercise',
  'backbone.relational'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.Workout = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany,
      key: 'exercises',
      relatedModel: Entities.Exercise,
      collectionType: Entities.Exercises,
      collectionOptions: function(workout) {
        return { workout: workout };
      }
    }]
  });

  Entities.Workouts = Backbone.Collection.extend({
    model: Entities.Workout,

    initialize: function(models, options) {
      this.regimen = options.regimen;
      this.listenTo(options.regimen, 'change:week', this.buildWorkout);
    },

    buildWorkout: function() {
      var program = this.regimen.get('program'),
        workouts = [];

      for (var w = 0, wl = program.workouts.length; w < wl; w++) {
        var workout = program.workouts[w];
        this.add(new Entities.Workout(workout));
      }
    }
  });

  var API = {
    getWorkouts: function(regimen) {
      var exercises = app.request('exercise:entities');

      return new Entities.Workouts([
        new Entities.Workout({ name: 'Monday', exercises: exercises }),
        new Entities.Workout({ name: 'Tuesday' })
      ]);
    }
  };

  app.reqres.setHandler('workout:entities', function(regimen) {
    return API.getWorkouts(regimen);
  });

  return Entities;

});
