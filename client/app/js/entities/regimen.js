define([
  'app',
  'backbone',
  'constants',
  'bootstrap',
  'backbone.relational',
  'entities/program'
], function(app, Backbone, constants, bootstrap) {

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
    getRegimenEntity: function(regimenId, options) {
      var deferred = $.Deferred(),
        regimen;

      options = options || { };
      if (!options.force && bootstrap.regimen && bootstrap.regimen[regimenId]) {
        regimen = new Entities.Regimen(bootstrap.regimen[regimenId]);
        deferred.resolve(regimen);
      } else {
        regimen = new Entities.Regimen({ id: regimenId });
        regimen.fetch({
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.resolve(undefined);
          }
        });
      }

      return deferred.promise();
    }
  };

  app.reqres.setHandler('regimen:entity', function(regimenId) {
    return API.getRegimenEntity(regimenId);
  });

  return Entities;

});
