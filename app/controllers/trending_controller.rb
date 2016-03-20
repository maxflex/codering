class TrendingController < ApplicationController
  def index
    @languages = Language::trending
  end
end
