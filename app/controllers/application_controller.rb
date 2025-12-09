class ApplicationController < ActionController::Base
  helper_method :current_user, :logged_in?
  
  private
  
  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end
  
  def logged_in?
    current_user.present?
  end
  
  def require_login
    unless logged_in?
      redirect_to login_path, alert: "You must be logged in"
    end
  end
  
  def require_logout
    if logged_in?
      redirect_to home_path, alert: "You are already logged in"
    end
  end
end
