import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { ID, Query } from "node-appwrite";

import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { uploadImage } from "../services/upload-image";
import { generateInviteCode } from "@/lib/utils";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config/db";

import { MemberRole } from "@/features/members/types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");

    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);
    if (members.total === 0)
      return c.json({ data: { documents: [], total: 0 } });

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

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
            inviteCode: generateInviteCode(13),
          }
        );

        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        });

        return c.json({ data: workspace }, 201);
      } catch (error) {
        console.log(error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
