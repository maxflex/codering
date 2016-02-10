# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).on 'ready page:change', ->
  # Materialize select
  $('select').material_select()

  # Vue app
  new Vue
    el: 'body'
    data:
      language_left: null
      language_right: null
    methods:
      proceed: ->
        console.log 'here'
