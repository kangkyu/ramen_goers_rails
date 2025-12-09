import { Restaurant, Visit } from "@fusion/shared/types";

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Ippudo Ramen",
    address: "123 Ramen Street, Tokyo",
    cuisine: "Tonkotsu",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Menya Saimi",
    address: "456 Noodle Ave, Shibuya",
    cuisine: "Shoyu",
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Ramen Yashichi",
    address: "789 Bowl Blvd, Harajuku",
    cuisine: "Miso",
    image:
      "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Tsukemen Tetsuji",
    address: "321 Dipping St, Shinjuku",
    cuisine: "Tsukemen",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Kyushu Jangara",
    address: "654 Spicy Lane, Akihabara",
    cuisine: "Tonkotsu",
    image:
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop",
  },
];

export let visits: Visit[] = [
  {
    id: "1",
    restaurantId: "1",
    userId: "user1",
    visitDate: new Date("2024-01-15"),
    notes: "Amazing tonkotsu broth!",
  },
  {
    id: "2",
    restaurantId: "1",
    userId: "user1",
    visitDate: new Date("2024-01-20"),
    notes: "Came back for more",
  },
  {
    id: "3",
    restaurantId: "2",
    userId: "user1",
    visitDate: new Date("2024-01-22"),
    notes: "Clean shoyu flavor",
  },
  {
    id: "4",
    restaurantId: "1",
    userId: "user2",
    visitDate: new Date("2024-01-25"),
  },
  {
    id: "5",
    restaurantId: "3",
    userId: "user2",
    visitDate: new Date("2024-01-28"),
  },
];

for (let i = 6; i <= 30; i++) {
  visits.push({
    id: i.toString(),
    restaurantId: Math.floor(Math.random() * 5 + 1).toString(),
    userId: `user${Math.floor(Math.random() * 5 + 1)}`,
    visitDate: new Date(2024, 0, Math.floor(Math.random() * 28 + 1)),
  });
}

export function addVisit(v: Omit<Visit, "id">): Visit {
  const newVisit: Visit = { ...v, id: (visits.length + 1).toString() };
  visits.push(newVisit);
  return newVisit;
}
