class RankingsController < ApplicationController
  def index
    @rankings = Restaurant.by_visits.map.with_index do |restaurant, index|
      OpenStruct.new(
        rank: index + 1,
        restaurant: restaurant,
        total_visits: restaurant.visit_count || 0,
        unique_visitors: restaurant.unique_visitors
      )
    end
  end
end
