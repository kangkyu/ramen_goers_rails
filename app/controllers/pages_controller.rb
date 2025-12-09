class PagesController < ApplicationController
  def home
    @restaurants = Restaurant.all
    @top_rankings = Restaurant.by_visits.limit(3)
  end
end
