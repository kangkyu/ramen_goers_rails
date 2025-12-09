export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine?: string;
  image?: string;
}

export interface Visit {
  id: string;
  restaurantId: string;
  userId: string;
  visitDate: Date;
  notes?: string;
}

export interface UserRestaurantStats {
  restaurant: Restaurant;
  visitCount: number;
  lastVisit: Date;
  firstVisit: Date;
}

export interface RestaurantRanking {
  restaurant: Restaurant;
  rank: number;
  totalVisits: number;
  uniqueVisitors: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}
