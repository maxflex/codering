(function() {
  $(document).on('ready', function() {
    return new Vue({
      el: '.vue-app',
      props: ['data'],
      data: {
        overlay: false,
        categories: null,
        selected_language: null,
        languages: [],
        LANGUAGE_LEFT: 0,
        LANGUAGE_RIGHT: 1
      },
      methods: {
        select_language: function(language) {
          this.selected_language = language;
          return this.overlay = true;
        },
        select: function(language) {
          this.languages.$set(this.selected_language, language);
          return this.overlay = false;
        },
        proceed: function() {
          return window.location = this.languages[this.LANGUAGE_LEFT].short + "-vs-" + this.languages[this.LANGUAGE_RIGHT].short;
        },
        img_src: function(language) {
          return "images/nodes/" + language.category + "/" + language.short + ".png";
        },
        already_selected: function(language) {
          var other_language;
          other_language = this.selected_language === this.LANGUAGE_LEFT ? this.LANGUAGE_RIGHT : this.LANGUAGE_LEFT;
          return this.languages[other_language] === language;
        }
      },
      computed: {
        same_categories: function() {
          return this.languages[this.LANGUAGE_LEFT].category === this.languages[this.LANGUAGE_RIGHT].category;
        }
      },
      created: function() {
        this.data = JSON.parse(this.data);
        this.categories = Object.keys(this.data);
        this.languages[this.LANGUAGE_LEFT] = this.data['languages'][0];
        return this.languages[this.LANGUAGE_RIGHT] = this.data['languages'][1];
      }
    });
  });

}).call(this);
