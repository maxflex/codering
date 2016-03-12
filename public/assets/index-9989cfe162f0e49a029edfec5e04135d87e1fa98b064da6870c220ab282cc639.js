(function() {
  $(document).on('ready page:change', function() {
    $('select').material_select();
    return new Vue({
      el: 'body',
      data: {
        language_left: null,
        language_right: null
      },
      methods: {
        proceed: function() {
          return console.log('here');
        }
      }
    });
  });

}).call(this);
