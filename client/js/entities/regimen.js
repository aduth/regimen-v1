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
      var newWeek = this.get('week') + increment;
      this.set('week', newWeek);
      app.vent.trigger('change:week', this);
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
