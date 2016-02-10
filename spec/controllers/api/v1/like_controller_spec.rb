require 'rails_helper'

RSpec.describe Api::V1::LikeController, type: :controller do
  context '#like' do
    before(:each) do
      @like_params = {id: 1}
      session[:user_id] = 1
    end

    it 'likes language' do
      post :like, @like_params
      puts response.body.colorize :red
    end
  end
end
