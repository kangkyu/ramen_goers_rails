import { RequestHandler } from "express";
import { addVisit, visits } from "./store";
import { Visit } from "@fusion/shared/types";
import { sql } from "../db";

export const postVisit: RequestHandler = async (req, res) => {
  const { restaurantId, visitDate, notes } = req.body || {};
  if (!restaurantId) {
    return res.status(400).json({ error: "restaurantId is required" });
  }
  const authUser = (req as any).user as { id: string } | undefined;
  if (!authUser) return res.status(401).json({ error: "unauthorized" });
  const parsedDate = visitDate ? new Date(visitDate) : new Date();

  // Try Neon first
  if (sql) {
    try {
      const rows = await sql`
        INSERT INTO visits (restaurant_id, user_id, visit_date, notes)
        VALUES (${String(restaurantId)}, ${authUser.id}, ${parsedDate.toISOString()}, ${notes ?? null})
        RETURNING id, restaurant_id, user_id, visit_date, notes
      `;
      const r = rows[0] as any;
      const created: Visit = {
        id: String(r.id),
        restaurantId: String(r.restaurant_id),
        userId: String(r.user_id),
        visitDate: new Date(r.visit_date),
        notes: r.notes ?? undefined,
      };
      return res.status(201).json(created);
    } catch (e) {
      // fall through to in-memory store
    }
  }

  const visit: Omit<Visit, "id"> = {
    restaurantId: String(restaurantId),
    userId: authUser.id,
    visitDate: parsedDate,
    notes,
  };
  const created = addVisit(visit);
  res.status(201).json(created);
};

export const getVisits: RequestHandler = async (req, res) => {
  const { userId, restaurantId } = req.query;
  const authUser = (req as any).user as { id: string } | undefined;

  if (sql) {
    try {
      const conditions: string[] = [];
      const params: any[] = [];
      if (userId || authUser?.id) {
        params.push(String(userId ?? authUser!.id));
        conditions.push(`user_id = $${params.length}`);
      }
      if (restaurantId) {
        params.push(String(restaurantId));
        conditions.push(`restaurant_id = $${params.length}`);
      }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const text = `SELECT id, restaurant_id, user_id, visit_date, notes FROM visits ${where} ORDER BY visit_date DESC`;
      const result = await (sql as any).query(text, params);
      const data: Visit[] = result.rows.map((r: any) => ({
        id: String(r.id),
        restaurantId: String(r.restaurant_id),
        userId: String(r.user_id),
        visitDate: new Date(r.visit_date),
        notes: r.notes ?? undefined,
      }));
      return res.json(data);
    } catch (e) {
      // Fallback below
    }
  }

  let data = visits;
  const effectiveUserId = userId ? String(userId) : authUser?.id;
  if (effectiveUserId) data = data.filter((v) => v.userId === effectiveUserId);
  if (restaurantId) data = data.filter((v) => v.restaurantId === String(restaurantId));
  res.json(data);
};
