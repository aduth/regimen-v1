define([
  'app',
  'backbone',
  'bootstrap',
  'constants'
], function(app, Backbone, bootstrap, constants) {

  var Entities = app.module('Entities');

  Entities.User = Backbone.Model.extend({
    urlRoot: constants.url.api + '/user/'
  });

  Entities.AuthUser = Entities.User.extend({
    urlRoot: '/auth/user/'
  });

  var API = {
    getCurrentUser: function(options) {
      var deferred = $.Deferred();

      options = options || { };
      if (!options.force && bootstrap.user) {
        // Load from bootstrap if exists
        deferred.resolve(new Entities.User(bootstrap.user));
      } else {
        new Entities.AuthUser().fetch({
          success: function(data) {
            if (res) {
              deferred.resolve(data);
            } else {
              deferred.reject();
            }
          },
          error: function() {
            deferred.reject();
          }
        });
      }

      return deferred.promise();
    },

    updateLastRegimen: function(username, regimenId) {
      var deferred = $.Deferred();

      new Entities.User({ id: username }).save({
        lastRegimen: regimenId
      }, {
        patch: true,
        success: function() {
          deferred.resolve();
        },
        error: function() {
          deferred.reject();
        }
      });

      return deferred.promise();
    }
  };

  app.reqres.setHandler('user:current', function() {
    return API.getCurrentUser();
  });

  app.reqres.setHandler('user:change:lastRegimen', function(regimenId) {
    var deferred = $.Deferred();

    $.when(API.getCurrentUser()).done(function(user) {
      deferred.then(API.updateLastRegimen(user.get('username'), regimenId));
    });

    return deferred.promise();
  });

  return Entities;

});
