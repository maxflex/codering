class CommandController < ApplicationController
  require 'open-uri'
  require 'json'

  # пересчитать звездочки для всех языков
  def recalc_stars
    Language.all.each do |language|
      content = open("https://api.github.com/repos/#{language.github}").read
      data = JSON.parse(content)
      language.stars = data['stargazers_count']
      language.save
    end
    render text: 'stars recalculated'
  end
end
