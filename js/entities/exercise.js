define([
  'app',
  'backbone',
  'entities/set'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.Exercise = Backbone.Model.extend({
  });

  Entities.Exercises = Backbone.Collection.extend({
    model: Entities.Exercise
  });

  var API = {
    getExercises: function() {
      var sets = app.request('set:entities');

      return new Entities.Exercises([
        new Entities.Exercise({ name: 'Bench Press', sets: sets })
      ]);
    }
  };

  app.reqres.setHandler('exercise:entities', function() {
    return API.getExercises();
  });

  return Entities;

});
