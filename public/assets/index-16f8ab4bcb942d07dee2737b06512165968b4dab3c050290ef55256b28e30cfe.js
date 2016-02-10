(function() {
  $(document).on('ready page:change', function() {
    $('select').material_select();
    return new Vue({
      el: 'body',
      methods: {
        testy: function() {
          return 'agash';
        }
      },
      data: {
        t: 'testy'
      }
    });
  });

}).call(this);
