define([
  'app',
  'backbone',
  'backbone.relational',
  'entities/program'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.Regimen = Backbone.RelationalModel.extend({
    urlRoot: '/api/regimen/',

    relations: [{
      type: Backbone.HasOne,
      key: 'program',
      relatedModel: Entities.Program,
      reverseRelation: {
        type: Backbone.HasOne,
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
          //regimen.fetchRelated();
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
