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
      },
      reverseRelation: {
        key: 'workout'
      }
    }]
  });

  Entities.Workouts = Backbone.Collection.extend({
    model: Entities.Workout,

    initialize: function(models, options) {
      this.regimen = options.regimen;
    }
  });

  return Entities;

});
