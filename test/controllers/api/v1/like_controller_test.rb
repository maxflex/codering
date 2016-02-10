require 'test_helper'

class Api::V1::LikeControllerTest < ActionController::TestCase
  test "should get like" do
    get :like
    assert_response :success
  end

end
