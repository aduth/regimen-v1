define([
  'marionette',
  'app',
  'hbs!modules/set/list/templates/item'
], function(Marionette, app, tmplSetItem) {

  var Set = app.module('Set');

  Set.List = { };

  Set.List.ItemView = Marionette.ItemView.extend({
    template: tmplSetItem,

    tagName: 'li',

    className: 'instruction',

    events: {
      'click .success': 'trackSuccess',
      'click .failure': 'trackFailure'
    },

    trackSuccess: function(e) {
      this.activate(e);
    },

    trackFailure: function(e) {
      this.activate(e);
    },

    activate: function(e) {
      this.trigger('activated');

      // Activate targetted option
      $(e.target)
        .addClass('activated')
        .siblings()
          .removeClass('activated');

      // Disable set row
      this.$el.addClass('disabled');

      // Enable next set row
      this.$el.next(':not(:has(.activated))').removeClass('disabled');

      // Automatically pre-select success for any unselected previous rows
      this.$el.prevAll(':not(:has(.activated))').find('.success').trigger('click');
    }
  });

  Set.List.CollectionView = Marionette.CollectionView.extend({
    itemView: Set.List.ItemView,

    tagName: 'ol',

    className: 'instructions',

    initialize: function() {
      this.on('render', this.disableAllButFirst, this);
      this.on('itemview:activated', this.checkIfExerciseComplete, this);

      this.calculateSets();
    },

    disableAllButFirst: function() {
      this.children.each(function(itemView) {
        itemView.$el.addClass('disabled');
      });

      this.children.first().$el.removeClass('disabled');
    },

    calculateSets: function() {
      var calculatedProgress = $.Deferred(),
        calculated = 0,
        sets = this.collection;

      // Calculate weight for each set
      sets.each(function(set) {
        set.getCalculatedWeight(function(calculatedValue) {
          var set = this;
          set.set({ weight_calc: calculatedValue }, { silent: true });
          if (++calculated === sets.length) {
            calculatedProgress.resolve();
          }
        });
      });

      // When calculation complete, re-render
      $.when(calculatedProgress).done(function() {
        this.render();
      }.bind(this));
    },

    checkIfExerciseComplete: function(childView) {
      // If last set complete, emit event
      if (childView.cid === this.children.last().cid) {
        this.trigger('completed', this);
      }
    }
  });

  return Set;

});
