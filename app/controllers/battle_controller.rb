class BattleController < ApplicationController
  def index
    # @data = {
    #   language_left: Language.find_by_name(params[:language_1]),
    #   language_right: Language.find_by_name(params[:language_2])
    # }.to_json(include: 'likes')
    # logger.info @data.colorize :red
    to_json_data = {
      methods: ['rgba', 'lighten_color', 'likes_count'],
    }

    @language_left  = Language.find_by_name(params[:language_1]).to_json(to_json_data)
    @language_right = Language.find_by_name(params[:language_2]).to_json(to_json_data)

    logger.info JSON.parse(@language_right).to_yaml.colorize :yellow
  end
end
