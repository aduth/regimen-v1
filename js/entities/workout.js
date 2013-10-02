define([
  'app',
  'backbone',
  'entities/exercise',
  'backbone.relational'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.Workout = Backbone.RelationalModel.extend({ });

  Entities.Workouts = Backbone.Collection.extend({
    model: Entities.Workout,

    initialize: function(models, options) {
      this.regimen = options.regimen;
      this.listenTo(options.regimen, 'change:week', this.buildWorkout);
      this.buildWorkout();
    },

    buildWorkout: function() {
      console.log(this.regimen.get('program'))
      this.reset([
        new Entities.Workout({ name: 'Monday' }),
        new Entities.Workout({ name: 'Tuesday' })
      ]);

      return this;
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
