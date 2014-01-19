define([
  'app',
  'backbone'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.User = Backbone.Model.extend({
    urlRoot: '/auth/user/'
  });

  var API = {
    getCurrentUser: function() {
      var deferred = $.Deferred();

      new Entities.User().fetch({
        success: function(data, res) {
          if (res) {
            deferred.resolve(data);
          } else {
            deferred.resolve(undefined);
          }
        },
        error: function() {
          deferred.resolve(undefined);
        }
      });

      return deferred.promise();
    },

    getUserEntity: function(userId, options) {
      var deferred = $.Deferred();

      new Entities.User({ id: userId }).fetch({
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.resolve(undefined);
        }
      });

      return deferred.promise();
    }
  };

  app.reqres.setHandler('user:current', function() {
    return API.getCurrentUser();
  });

  app.reqres.setHandler('user:entity', function(userId) {
    return API.getUserEntity(userId);
  });

  return Entities;

});
