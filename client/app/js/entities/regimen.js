define([
  'app',
  'backbone',
  'constants',
  'bootstrap',
  'backbone.relational',
  'entities/program',
  'entities/progress'
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
    }, {
      type: Backbone.HasMany,
      key: 'progress',
      relatedModel: Entities.Progress,
      reverseRelation: {
        key: 'regimen'
      }
    }],

    parse: function(res) {
      if (!res) return;

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
      return newWeek;
    }
  });

  var API = {
    getRegimenEntity: function(regimenId, options) {
      var deferred = $.Deferred();

      options = options || { };
      if (!options.force && bootstrap.regimen && bootstrap.regimen[regimenId]) {
        // Load from bootstrap if exists
        var regimen = Entities.Regimen.findOrCreate(bootstrap.regimen[regimenId]);
        deferred.resolve(regimen);
      } else {
        // Otherwise, fetch from server
        var init = { id: regimenId };
        if (options.week) init.week = options.week;

        // Attempt to load regimen from cache
        var regimen = Entities.Regimen.find(init);
        if (regimen) {
          return deferred.resolve(regimen);
        }

        // Otherwise fetch from server
        Entities.Regimen.build(init).fetch({
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        });
      }

      return deferred.promise();
    },

    updateRegimenWeek: function(regimenId, week) {
      return API.updateRegimen(regimenId, { week: week });
    },

    updateRegimenWorkout: function(regimenId, workout) {
      return API.updateRegimen(regimenId, { workout: workout });
    },

    updateRegimen: function(regimenId, attributes) {
      var deferred = $.Deferred();

      Entities.Regimen.findOrCreate({
        id: regimenId
      }).save(attributes, {
        wait: true,
        patch: true,
        success: function() {
          deferred.resolve();
        },
        error: function() {
          deferred.reject();
        }
      });

      return deferred.promise;
    }
  };

  app.reqres.setHandler('regimen:entity', function(regimenId, week) {
    var options = { };
    if (week) {
      options.week = week;
    }

    return API.getRegimenEntity(regimenId, options);
  });

  app.reqres.setHandler('regimen:update:week', function(regimenId, week) {
    return API.updateRegimenWeek(regimenId, week);
  });

  app.reqres.setHandler('regimen:update:workout', function(regimenId, workout) {
    return API.updateRegimenWorkout(regimenId, workout);
  });

  return Entities;

});
