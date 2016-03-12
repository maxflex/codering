class IndexController < ApplicationController
  def index
    @data = {}
    # @languages = Language.all.to_json
    Language::categories.each do |category, index|
      @data[category.pluralize] = Language.where(category: index)
    end
    @data = @data.to_json
  end
end
