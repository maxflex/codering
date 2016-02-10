module Api::V1
  class LikeController < ApiController
    def like
      like = Like.find_or_initialize_by(user_id: @current_user.id, language_id: params[:id])
      like.persisted? ? like.destroy : like.save

      # false = like removed, true = like added
      render json: like.persisted?
    end
  end
end
