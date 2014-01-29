define([
  'app',
  'backbone',
  'handlebars',
  'wweval'
], function(app, Backbone, Handlebars, wweval) {

  var Entities = app.module('Entities');

  Entities.Set = Backbone.RelationalModel.extend({
    initialize: function() {
      this.on('change:weight', this.precompileWeightTemplate);
    },

    updateVariables: function() {
      var model = this.toJSON();
      model.workout = model.exercise.workout;
      model.program = model.workout.program;
      model.regimen = model.program.regimen;

      var template = this.weightTemplate(model);
      wweval(template, function(calculatedValue) {
        var calculatedType = this.get('exercise').get('calculated_type'),
          processedValue = this.processCalculatedValue(calculatedValue, calculatedType);

        this.set('weight_calc', processedValue);
      }.bind(this));
    },

    precompileWeightTemplate: function() {
      var weightTemplateText = this.get('weight');
      this.weightTemplate = Handlebars.compile(weightTemplateText);
    },

    processCalculatedValue: function(calculatedValue, type) {
      switch(type) {
        case 'plate':
          // [TODO]: Remove magic numbers (to user configuration or app constant)
          return Math.round(calculatedValue / 5) * 5;
        default:
          return calculatedValue;
      }
    }
  });

  Entities.Sets = Backbone.Collection.extend({
    model: Entities.Set,

    initialize: function(models, options) {
      this.exercise = options.exercise;
    }
  });

  return Entities;

});
