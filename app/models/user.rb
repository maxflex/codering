class User < ActiveRecord::Base
  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth["provider"]
      user.uid = auth["uid"]
      user.name = auth["info"]["name"]
      user.login = auth['info']['nickname']
      user.avatar = auth['info']['image']
      user.email = auth['info']['email']
      user.website = auth['info']['urls']['Blog']
      user.location = auth['extra']['raw_info']['location']
    end
  end
end
