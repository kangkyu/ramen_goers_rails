Restaurant.destroy_all

restaurants = [
  {
    name: "Ippudo Ramen",
    address: "123 Ramen Street, Tokyo",
    cuisine: "Tonkotsu",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop"
  },
  {
    name: "Menya Saimi",
    address: "456 Noodle Ave, Shibuya",
    cuisine: "Shoyu",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop"
  },
  {
    name: "Ramen Yashichi",
    address: "789 Bowl Blvd, Harajuku",
    cuisine: "Miso",
    image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop"
  },
  {
    name: "Tsukemen Tetsuji",
    address: "321 Dipping St, Shinjuku",
    cuisine: "Tsukemen",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop"
  },
  {
    name: "Kyushu Jangara",
    address: "654 Spicy Lane, Akihabara",
    cuisine: "Tonkotsu",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop"
  }
]

created_restaurants = restaurants.map { |attrs| Restaurant.create!(attrs) }

puts "Created #{created_restaurants.count} restaurants"
