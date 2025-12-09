import {
  Restaurant,
  Visit,
  UserRestaurantStats,
  RestaurantRanking,
} from "@fusion/shared/types";

// Mock data for development
export const mockRestaurants: Restaurant[] = [
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

// Mock visit data - in a real app this would come from a database
let mockVisits: Visit[] = [
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

// Generate more mock visits for realistic rankings
for (let i = 6; i <= 50; i++) {
  mockVisits.push({
    id: i.toString(),
    restaurantId: Math.floor(Math.random() * 5 + 1).toString(),
    userId: `user${Math.floor(Math.random() * 10 + 1)}`,
    visitDate: new Date(2024, 0, Math.floor(Math.random() * 30 + 1)),
  });
}

// Local storage helpers to persist visits between sessions
function loadVisitsFromStorage(): Visit[] | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("mockVisits");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Array<
      Omit<Visit, "visitDate"> & { visitDate: string }
    >;
    return parsed.map((v) => ({ ...v, visitDate: new Date(v.visitDate) }));
  } catch {
    return null;
  }
}

function saveVisitsToStorage(visits: Visit[]) {
  try {
    if (typeof window === "undefined") return;
    const serialized = JSON.stringify(
      visits.map((v) => ({ ...v, visitDate: v.visitDate.toISOString() })),
    );
    window.localStorage.setItem("mockVisits", serialized);
  } catch {
    // ignore persistence errors
  }
}

// Initialize visits from storage if available
const stored = loadVisitsFromStorage();
if (stored && Array.isArray(stored) && stored.length) {
  mockVisits = stored;
}

export class DataService {
  static async getCurrentUser() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.status === 204) return null;
      if (!res.ok) return null;
      return (await res.json()) as { id: string; email?: string; name?: string };
    } catch {
      return null;
    }
  }

  static async login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return (await res.json()) as { id: string; email?: string; name?: string };
  }

  static async register(name: string, email: string, password: string) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Register failed");
    return (await res.json()) as { id: string; email?: string; name?: string };
  }

  static async logout() {
    await fetch("/api/auth/logout", { method: "POST" });
  }

  static async getRestaurants(): Promise<Restaurant[]> {
    try {
      const res = await fetch("/api/restaurants");
      if (!res.ok) throw new Error("failed");
      const data: Restaurant[] = await res.json();
      return data;
    } catch {
      return mockRestaurants;
    }
  }

  static async getUserVisits(): Promise<UserRestaurantStats[]> {
    try {
      const [visitsRes, restaurants] = await Promise.all([
        fetch(`/api/visits`),
        this.getRestaurants(),
      ]);
      if (!visitsRes.ok) throw new Error("failed");
      const raw: Array<Omit<Visit, "visitDate"> & { visitDate: string }> =
        await visitsRes.json();
      const userVisits: Visit[] = raw.map((v) => ({
        ...v,
        visitDate: new Date(v.visitDate),
      }));
      const byRest = userVisits.reduce((acc, v) => {
        (acc[v.restaurantId] ||= []).push(v);
        return acc;
      }, {} as Record<string, Visit[]>);
      const stats: UserRestaurantStats[] = Object.entries(byRest)
        .map(([rid, list]) => {
          const rest = restaurants.find((r) => r.id === rid);
          if (!rest) return null;
          const times = list.map((v) => v.visitDate.getTime());
          return {
            restaurant: rest,
            visitCount: list.length,
            lastVisit: new Date(Math.max(...times)),
            firstVisit: new Date(Math.min(...times)),
          } as UserRestaurantStats;
        })
        .filter(Boolean) as UserRestaurantStats[];
      return stats.sort((a, b) => b.visitCount - a.visitCount);
    } catch {
      return [];
    }
  }

  static async getTopRankings(): Promise<RestaurantRanking[]> {
    try {
      const res = await fetch("/api/rankings");
      if (!res.ok) throw new Error("failed");
      const data: RestaurantRanking[] = await res.json();
      return data;
    } catch {
      const visitsByRestaurant = mockVisits.reduce(
        (acc, visit) => {
          if (!acc[visit.restaurantId]) {
            acc[visit.restaurantId] = { visits: [], uniqueUsers: new Set() };
          }
          acc[visit.restaurantId].visits.push(visit);
          acc[visit.restaurantId].uniqueUsers.add(visit.userId);
          return acc;
        },
        {} as Record<string, { visits: Visit[]; uniqueUsers: Set<string> }>,
      );

      const rankings: RestaurantRanking[] = [];

      for (const [restaurantId, data] of Object.entries(visitsByRestaurant)) {
        const restaurant = mockRestaurants.find((r) => r.id === restaurantId);
        if (restaurant) {
          rankings.push({
            restaurant,
            rank: 0,
            totalVisits: data.visits.length,
            uniqueVisitors: data.uniqueUsers.size,
          });
        }
      }

      rankings.sort((a, b) => b.totalVisits - a.totalVisits);
      rankings.forEach((ranking, index) => {
        ranking.rank = index + 1;
      });

      return rankings.slice(0, 10);
    }
  }

  static async checkInToRestaurant(
    restaurantId: string,
    notes?: string,
    visitDate?: Date,
  ): Promise<Visit> {
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          notes,
          visitDate: visitDate ? visitDate.toISOString() : undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const created: Omit<Visit, "visitDate"> & { visitDate: string } =
        await res.json();
      return { ...created, visitDate: new Date(created.visitDate) } as Visit;
    } catch {
      const fallback: Visit = {
        id: (mockVisits.length + 1).toString(),
        restaurantId,
        userId: "guest",
        visitDate: visitDate ?? new Date(),
        notes,
      };
      mockVisits.push(fallback);
      saveVisitsToStorage(mockVisits);
      return fallback;
    }
  }
}
