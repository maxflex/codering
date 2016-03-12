# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).on 'ready', ->
  # Vue.js + Materialize.css select fix
  # @link: http://stackoverflow.com/a/35318377/2274406
  Vue.directive 'select',
    twoWay: true
    bind: ->
      $(@el).material_select()
      self = this
      $(@el).on 'change', ->
        self.set $(self.el).val()
    update: (newValue, oldValue) ->
      $(@el).val newValue
    unbind: ->
      $(@el).material_select 'destroy'

  # Vue app
  new Vue
    el: 'body'
    methods:
      proceed: ->
        this.$http.post 'add',
          title: this.title
          website: this.website
    ready: ->
      $('select').material_select()
