class IndexController < ApplicationController
  def index
    @data = {}
    Language::categories.each do |category, index|
      @data[category.pluralize] = Language.where(category: index)
    end
    @json_data = @data.to_json
  end
end
