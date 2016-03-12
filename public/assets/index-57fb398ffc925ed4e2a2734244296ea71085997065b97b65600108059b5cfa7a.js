(function() {
  $(document).on('ready', function() {
    Vue.directive('select', {
      twoWay: true,
      bind: function() {
        var self;
        $(this.el).material_select();
        self = this;
        return $(this.el).on('change', function() {
          return self.set($(self.el).val());
        });
      },
      update: function(newValue, oldValue) {
        return $(this.el).val(newValue);
      },
      unbind: function() {
        return $(this.el).material_select('destroy');
      }
    });
    return new Vue({
      el: 'body',
      methods: {
        proceed: function() {
          return window.location = this.language_left + "-vs-" + this.language_right;
        }
      },
      ready: function() {
        return $('select').material_select();
      }
    });
  });

}).call(this);
