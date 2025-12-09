class VisitsController < ApplicationController
  before_action :require_login
  
  def index
    @visit_stats = current_user.visits.includes(:restaurant).group_by(&:restaurant).map do |restaurant, visits|
      {
        restaurant: restaurant,
        visit_count: visits.count,
        first_visit: visits.min_by(&:visit_date).visit_date,
        last_visit: visits.max_by(&:visit_date).visit_date
      }
    end.sort_by { |stat| -stat[:visit_count] }
  end
  
  def create
    @visit = current_user.visits.build(visit_params)
    @restaurant = @visit.restaurant
    
    if @visit.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to @restaurant, notice: "Checked in successfully" }
      end
    else
      respond_to do |format|
        format.turbo_stream { render action: "create", status: :unprocessable_entity }
        format.html { redirect_to @restaurant, alert: "Failed to check in" }
      end
    end
  end
  
  def destroy
    @visit = current_user.visits.find(params[:id])
    @visit.destroy
    redirect_to my_visits_path, notice: "Visit deleted"
  end
  
  private
  
  def visit_params
    params.require(:visit).permit(:restaurant_id, :visit_date, :notes)
  end
end
