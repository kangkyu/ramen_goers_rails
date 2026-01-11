class Like < ApplicationRecord
  belongs_to :user
  belongs_to :restaurant

  validates :restaurant, uniqueness: { scope: :user }
end
