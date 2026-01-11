class LikesController < ApplicationController
  before_action :require_login
  before_action :set_restaurant

  def create
    @like = current_user.likes.build(restaurant: @restaurant)

    if @like.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to @restaurant, notice: "Liked!" }
      end
    else
      respond_to do |format|
        format.turbo_stream { render action: "create", status: :unprocessable_entity }
        format.html { redirect_to @restaurant, alert: "Already liked" }
      end
    end
  end

  def destroy
    @like = current_user.likes.find_by(restaurant: @restaurant)
    @like&.destroy

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to @restaurant, notice: "Unliked" }
    end
  end

  private

  def set_restaurant
    @restaurant = Restaurant.find(params[:restaurant_id])
  end
end
