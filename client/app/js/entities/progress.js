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

  var API = {
    createProgress: function(regimenId, exerciseId, week, increment) {
      var deferred = $.Deferred();

      new Entities.Progress().save({
        _regimen: regimenId,
        _exercise: exerciseId,
        week: week,
        increment: increment
      });

      return deferred.promise;
    }
  };

  app.reqres.setHandler('progress:create', function(regimenId, exerciseId, week, increment) {
    return API.createProgress(regimenId, exerciseId, week, increment);
  });

  return Entities;

});
