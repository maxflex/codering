module Api::V1
  class ApiController < ApplicationController
    before_action :check_auth
    skip_before_action :verify_authenticity_token

    private

      def check_auth
        if session[:user_id].nil?
          render json: {message: 'Not authorized'}, status: :unauthorized
        end
      end

  end
end
