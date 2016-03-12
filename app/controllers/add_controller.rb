class AddController < ApplicationController
  def index
  end

  def create
    NewLanguage.notify(params[:language]).deliver_now
    respond_to do |format|
      format.html {
        redirect_to root_path,
        notice: 'New language request was sent'
      }
    end
  end
end
