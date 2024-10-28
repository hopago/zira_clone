import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/users/:userId", (c) => {
  const userId = c.req.param("userId");

  return c.json({ userId });
});

export const GET = handle(app);
