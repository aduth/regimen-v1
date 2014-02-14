define([
  'app',
  'backbone',
  'constants',
  'backbone.relational'
], function(app, Backbone, constants) {

  var Entities = app.module('Entities');

  Entities.Progress = Backbone.RelationalModel.extend({
    urlRoot: constants.url.api + '/progress/'
  });

  Entities.Progresses = Backbone.Collection.extend({
    url: constants.url.api + '/progress/',
    model: Entities.Progress
  });

  var API = {
    createProgress: function(regimenId, exerciseId, workout, week, progress, increment) {
      var deferred = $.Deferred();

      new Entities.Progress().save({
        _regimen: regimenId,
        _exercise: exerciseId,
        week: week,
        workout: workout,
        progress: progress,
        increment: increment
      });

      return deferred.promise;
    },

    getProgressEntities: function(regimenId, week) {
      var deferred = $.Deferred(),
        params = {
          _regimen: regimenId,
          week: week
        };

      new Entities.Progresses().fetch({
        data: $.param(params),
        success: function(progresses) {
          deferred.resolve(progresses);
        },
        error: function() {
          deferred.reject();
        }
      });

      return deferred.promise();
    }
  };

  app.reqres.setHandler('progress:create', function(regimenId, exerciseId, workout, week, progress, increment) {
    return API.createProgress(regimenId, exerciseId, workout, week, progress, increment);
  });

  app.reqres.setHandler('progress:entities', function(regimenId, week) {
    return API.getProgressEntities(regimenId, week);
  });

  return Entities;

});
