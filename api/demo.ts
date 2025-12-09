import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DemoResponse } from "../packages/shared/api";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const response: DemoResponse = {
    message: "Demo endpoint working!",
  };
  res.json(response);
}
