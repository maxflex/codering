$(document).on 'ready page:load', ->
  # Language component
  Vue.component 'language',
    props: ['language']
    template: '#language-template'
    methods:
      # Animate background images
      animate: ->
        img = $('.bg-image')
        scale = 1.0
        anim = setInterval ->
            img.css 'transform', "scale(#{scale})"
            scale += 0.002
            clearInterval(anim) if scale > 2
        , 5
      like: ->
        this.$http.post 'api/v1/like', {id: this.language.id}
          .then (response) ->
            # response.data
            # true = like added; false = like removed
            this.language.likes_count += if response.data then 1 else -1
            this.$els.likesCount.textContent = this.language.likes_count
          .error (response) ->
             $('#must-log-in').openModal()

    created: ->
      this.language = JSON.parse(this.language)
    ready: ->
      this.animate()

  # Vue app
  new Vue
    el: 'body'
