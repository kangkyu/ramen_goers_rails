class User < ApplicationRecord
  has_secure_password

  has_many :visits, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_restaurants, through: :likes, source: :restaurant

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :password, presence: true, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  def likes?(restaurant)
    likes.exists?(restaurant: restaurant)
  end
end
