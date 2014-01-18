require([
  'fastclick',
  'app'
], function(fastclick, app) {

  fastclick.attach(document.body);

  // Initialize application
  app.start();

  // Pass document link clicks through Backbone.history
  $(document).on('click', 'a[href]:not([data-bypass])', function(e) {
    var href = { prop: $(this).prop('href'), attr: $(this).attr('href') },
      root = location.protocol + '//' + location.host + '/';

    if (href.prop.slice(0, root.length) === root) {
      e.preventDefault();
      Backbone.history.navigate(href.attr, true);
    }
  });

});
