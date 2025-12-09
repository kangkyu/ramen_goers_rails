class Visit < ApplicationRecord
  belongs_to :user
  belongs_to :restaurant

  validates :user_id, presence: true
  validates :restaurant_id, presence: true
  validates :visit_date, presence: true

  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user) { where(user_id: user.id) }
end
