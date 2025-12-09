import { RequestHandler } from "express";
import { restaurants } from "./store";

export const getRestaurants: RequestHandler = (_req, res) => {
  res.json(restaurants);
};
