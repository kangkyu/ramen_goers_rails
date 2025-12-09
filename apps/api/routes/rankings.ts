import { RequestHandler } from "express";
import { restaurants, visits } from "./store";
import { RestaurantRanking } from "@fusion/shared/types";
import { sql } from "../db";

export const getRankings: RequestHandler = async (_req, res) => {
  if (sql) {
    try {
      const result = await (sql as any).query(
        `SELECT restaurant_id, COUNT(*)::int AS total_visits, COUNT(DISTINCT user_id)::int AS unique_visitors
         FROM visits
         GROUP BY restaurant_id
         ORDER BY total_visits DESC`
      );
      const rows: Array<{ restaurant_id: string; total_visits: number; unique_visitors: number }> = result.rows;
      const mapped: RestaurantRanking[] = [];
      for (const r of rows) {
        const restaurant = restaurants.find((x) => x.id === String(r.restaurant_id));
        if (!restaurant) continue;
        mapped.push({
          restaurant,
          rank: 0,
          totalVisits: r.total_visits,
          uniqueVisitors: r.unique_visitors,
        });
      }
      const rankings = mapped.map((r, idx) => ({ ...r, rank: idx + 1 }));
      return res.json(rankings);
    } catch (_e) {
      // fall back to in-memory below
    }
  }

  const byRest = visits.reduce((acc, v) => {
    acc[v.restaurantId] ||= { visits: 0, users: new Set<string>() };
    acc[v.restaurantId].visits += 1;
    acc[v.restaurantId].users.add(v.userId);
    return acc;
  }, {} as Record<string, { visits: number; users: Set<string> }>);

  const rankings: RestaurantRanking[] = Object.entries(byRest)
    .map(([rid, data]) => {
      const restaurant = restaurants.find((r) => r.id === rid)!;
      return {
        restaurant,
        rank: 0,
        totalVisits: data.visits,
        uniqueVisitors: data.users.size,
      } as RestaurantRanking;
    })
    .sort((a, b) => b.totalVisits - a.totalVisits)
    .map((r, idx) => ({ ...r, rank: idx + 1 }));

  res.json(rankings);
};
