class SessionsController < ApplicationController
  before_action :require_logout, only: [:new, :login]

  def new
    @user = User.new
  end

  def create
    @user = User.new(sign_up_params)

    if @user.save
      session[:user_id] = @user.id
      redirect_to home_path, notice: "Account created successfully"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def login
    # Render login form
  end

  def authenticate
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to home_path, notice: "Logged in successfully"
    else
      redirect_to login_path, alert: "Invalid email or password"
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to home_path, notice: "Logged out successfully"
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
