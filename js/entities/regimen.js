define([
  'app',
  'backbone',
  'backbone.relational',
  'entities/workout'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.Regimen = Backbone.RelationalModel.extend({
    urlRoot: '/api/regimen/',

    relations: [{
      type: Backbone.HasMany,
      key: 'workouts',
      relatedModel: Entities.Workout,
      collectionType: Entities.Workouts,
      collectionOptions: function(regimen) {
        return { regimen: regimen };
      },
      reverseRelation: {
        key: 'regimen'
      }
    }],

    adjustWeek: function(increment) {
      this.set('week', this.get('week') + increment);
    }
  });

  var API = {
    getRegimenEntity: function(regimenId) {
      var regimen = new Entities.Regimen({ id: regimenId }),
        defer = $.Deferred();

      regimen.fetch({
        success: function(data) {
          defer.resolve(data);
        },
        error: function(data) {
          defer.resolve(undefined);
        }
      });

      return defer.promise();
    }
  };

  app.reqres.setHandler('regimen:entity', function(regimenId) {
    return API.getRegimenEntity(regimenId);
  });

  return Entities;

});
