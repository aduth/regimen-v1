define([
  'app',
  'backbone',
  'constants',
  'backbone.relational',
  'entities/program'
], function(app, Backbone, constants) {

  var Entities = app.module('Entities');

  Entities.Regimen = Backbone.RelationalModel.extend({
    urlRoot: constants.url.api + '/regimen/',

    relations: [{
      type: Backbone.HasOne,
      key: 'program',
      relatedModel: Entities.Program,
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'regimen'
      }
    }],

    initialize: function() {
      this.on('change:week', this.onWeekChanged, this);
    },

    adjustWeek: function(increment) {
      var newWeek = this.get('week') + increment;
      this.set('week', newWeek);
    },

    onWeekChanged: function() {
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
