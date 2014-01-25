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

    parse: function(res) {
      var week;

      // If week previously specified, preserve during parse
      if (this.get('id') === res.id && (week = this.get('week'))) {
        res.week = week;
      }

      return res;
    },

    adjustWeek: function(increment) {
      var newWeek = this.get('week') + increment;
      this.set('week', newWeek);
    }
  });

  var API = {
    getRegimenEntity: function(regimenId, options) {
      var deferred = $.Deferred();

      options = options || { };
      if (!options.force && bootstrap.regimen && bootstrap.regimen[regimenId]) {
        // Load from bootstrap if exists
        var regimen = new Entities.Regimen(bootstrap.regimen[regimenId]);
        deferred.resolve(regimen);
      } else {
        // Otherwise, fetch from server
        var init = { id: regimenId };
        if (options.week) init.week = options.week;

        new Entities.Regimen(init).fetch({
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

  app.reqres.setHandler('regimen:entity', function(regimenId, week) {
    var options = { };
    if (week) {
      options.week = week;
    }

    return API.getRegimenEntity(regimenId, options);
  });

  return Entities;

});
