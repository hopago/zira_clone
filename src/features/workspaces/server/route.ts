import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { ID } from "node-appwrite";

import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { uploadImage } from "../services/upload-image";

import { DATABASE_ID, WORKSPACES_ID } from "@/config/db";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, image } = c.req.valid("json");

    let uploadedImageUrl: string | null = null;

    if (image instanceof File) {
      uploadedImageUrl = await uploadImage(storage, image);
    }

    try {
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace }, 201);
    } catch (error) {
      console.log(error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

export default app;
