class UsersController < ApplicationController
  # before_action :authenticate_user!
  before_action :signin_test_user

  def show
    @episode = Episode.new
  end

  protected

  def signin_test_user
    user = User.find_by(email: "test@test.com") || User.create(email: "test@test.com", password: "password", name: "demo_user")
    sign_in(:user, user)
  end

end
