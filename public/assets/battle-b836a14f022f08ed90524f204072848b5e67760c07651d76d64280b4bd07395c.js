(function() {
  $(document).on('ready page:change', function() {
    Vue.config.debug = true;
    Vue.component('language', {
      props: ['language'],
      template: '#language-template',
      methods: {
        animate: function() {
          var anim, img, scale;
          img = $('.bg-image');
          scale = 1.0;
          return anim = setInterval(function() {
            img.css('transform', "scale(" + scale + ")");
            scale += 0.002;
            if (scale > 2) {
              return clearInterval(anim);
            }
          }, 5);
        },
        like: function() {
          return this.$http.post('api/v1/like', {
            id: this.language.id
          }).then(function(response) {
            this.language.likes_count += response.data ? 1 : -1;
            return this.$els.likesCount.textContent = this.language.likes_count;
          }).error(function(response) {
            return $('#must-log-in').openModal();
          });
        }
      },
      created: function() {
        return this.language = JSON.parse(this.language);
      },
      ready: function() {
        return this.animate();
      }
    });
    return new Vue({
      el: 'body'
    });
  });

}).call(this);
