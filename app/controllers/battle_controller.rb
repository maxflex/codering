class BattleController < ApplicationController
  def index
    to_json_data = {
      methods: ['rgba', 'lighten_color', 'likes_count']
    }

    @language_left  = Language.find_by_name(params[:language_1])
    @language_right = Language.find_by_name(params[:language_2])

    if @language_left.nil? || @language_right.nil?
      redirect_to root_path
    end

    @language_left_json = @language_left.to_json(to_json_data)
    @language_right_json = @language_right.to_json(to_json_data)
  end

  def single
    to_json_data = {
      methods: ['rgba', 'lighten_color', 'likes_count']
    }

    @language = Language.find_by(short: params[:language], category: Language::categories[params[:category]])

    if @language.nil?
      redirect_to root_path
    end

    @language_json = @language.to_json(to_json_data)
  end
end
