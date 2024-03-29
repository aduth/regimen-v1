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
      'click .failure': 'trackFailure',
      'click .state': 'activatePrevious'
    },

    trackSuccess: function(e) {
      this.activate(e.target);
    },

    trackFailure: function(e) {
      this.activate(e.target);
    },

    activate: function(target, options) {
      options = options || { };
      var $target = $(target);

      // Take no action if already activated
      if ($target.hasClass('activated')) return;

      // Activate targetted option
      $target
        .addClass('activated')
        .siblings()
          .removeClass('activated');

      // Disable set row
      this.$el.addClass('disabled');

      // Enable next set row
      this.$el.next(':not(:has(.activated))').removeClass('disabled');

      // Emit event
      if (!options.silent) {
        var increment = $target.hasClass('success') ? 1 : 0;
        this.trigger('activated', increment);
      }
    }
  });

  Set.List.CollectionView = Marionette.CollectionView.extend({
    itemView: Set.List.ItemView,

    tagName: 'ol',

    className: 'instructions',

    initialize: function() {
      this.on('render', this.disableAllButFirst, this);
      this.on('itemview:activated', this.activatePrevious, this);
      this.on('itemview:activated', this.logProgress, this);
      this.on('progress', this.restoreProgress, this);

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

    logProgress: function(childView, increment) {
      // Generate progress array using activated state
      var progress = this.children.map(function(childView) {
        if (childView.$el.find('.success.activated').length) {
          return 1;
        }
        return 0;
      });

      // If all sets complete, pass so that workout can increment when all exercises complete
      var complete = childView.cid === this.children.last().cid;

      this.trigger('save', progress, increment, complete);
    },

    restoreProgress: function(progress) {
      this.children.each(function(itemView, i) {
        // Find element based on progress state (success / failure)
        var selector = progress.get('progress')[i] === 1 ? '.success' : '.failure',
          $state = itemView.$el.find(selector);

        // Silently activate (silent to prevent re-save)
        itemView.activate($state, { silent: true });
      });
    },

    activatePrevious: function(activatedChildView) {
      this.children.each(function(childView) {
        // Break iteration if reached activated child
        if (childView.cid === activatedChildView.cid) return false;

        // Assume success if previous child not yet activated
        if (childView.$el.is(':not(:has(.activated))')) {
          var $childSuccess = childView.$el.find('.success');
          childView.activate($childSuccess, { silent: true });
        }
      });
    }
  });

  return Set;

});
