class Restaurant < ApplicationRecord
  has_many :visits, dependent: :destroy
  has_many :users, through: :visits
  has_many :likes, dependent: :destroy
  has_many :liking_users, through: :likes, source: :user

  validates :name, presence: true
  validates :address, presence: true

  scope :by_visits, -> {
    joins(:visits)
      .group("restaurants.id")
      .select("restaurants.*, COUNT(visits.id) as visit_count, COUNT(DISTINCT visits.user_id) as unique_visitors")
      .order("visit_count DESC")
  }

  def total_visits
    visits.count
  end

  def unique_visitors
    visits.select(:user_id).distinct.count
  end

  def like_count
    likes.count
  end
end
