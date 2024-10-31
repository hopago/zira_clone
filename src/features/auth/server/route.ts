import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";

import { ID } from "node-appwrite";

import { loginSchema, registerSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { AUTH_COOKIE } from "../constants/cookie";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true, statusCode: 204 });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { username, email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    const user = await account.create(ID.unique(), email, password, username);
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true, statusCode: 201, data: user });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    await account.deleteSession("current");
    deleteCookie(c, AUTH_COOKIE);

    return c.json({ success: 204 });
  });

export default app;
