define([
  'app',
  'backbone',
  'entities/workout',
  'backbone.relational'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.Program = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany,
      key: 'workouts',
      relatedModel: Entities.Workout,
      collectionType: Entities.Workouts,
      collectionOptions: function(program) {
        return { program: program };
      },
      reverseRelation: {
        key: 'program'
      }
    }]
  });

  return Entities;

});
