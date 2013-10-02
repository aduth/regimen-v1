define([
  'app',
  'backbone',
  'entities/set'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.Exercise = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany,
      key: 'sets',
      relatedModel: Entities.Set,
      collectionType: Entities.Sets,
      collectionOptions: function(exercise) {
        return { exercise: exercise };
      }
    }]
  });

  Entities.Exercises = Backbone.Collection.extend({
    model: Entities.Exercise,

    initialize: function(models, options) {
      this.workout = options.workout;
    }
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
