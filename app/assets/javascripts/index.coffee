# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).on 'ready', ->
  new Vue
    el: '.vue-app'
    props: ['data']
    data:
      overlay: false
      categories: null
      selected_language: null
      languages: [] # vs languages
      LANGUAGE_LEFT: 0
      LANGUAGE_RIGHT: 1
    methods:
      select_language: (language) ->
        this.selected_language = language
        this.overlay = true
      select: (language) ->
        this.languages.$set this.selected_language, language
        this.overlay = false
      proceed: ->
          window.location = "#{this.languages[this.LANGUAGE_LEFT].short}-vs-#{this.languages[this.LANGUAGE_RIGHT].short}"
      img_src: (language) ->
        "images/nodes/#{language.category}/#{language.short}.png"
      already_selected: (language) ->
        other_language = if this.selected_language is this.LANGUAGE_LEFT then this.LANGUAGE_RIGHT else this.LANGUAGE_LEFT
        this.languages[other_language] is language
    computed:
      same_categories: ->
        this.languages[this.LANGUAGE_LEFT].category is this.languages[this.LANGUAGE_RIGHT].category
    created: ->
      this.data = JSON.parse(this.data)
      this.categories = Object.keys(this.data)
      # select initial languages
      this.languages[this.LANGUAGE_LEFT] = this.data['languages'][0]
      this.languages[this.LANGUAGE_RIGHT] = this.data['languages'][1]



# Vue.js + Materialize.css select fix
# @link: http://stackoverflow.com/a/35318377/2274406
# Vue.directive 'select',
#   twoWay: true
#   bind: ->
#     $(@el).material_select()
#     self = this
#     $(@el).on 'change', ->
#       self.set $(self.el).val()
#   update: (newValue, oldValue) ->
#     $(@el).val newValue
#   unbind: ->
#     $(@el).material_select 'destroy'

# Vue app
