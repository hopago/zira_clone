import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { z } from "zod";

import { ID, Query } from "node-appwrite";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { uploadImage } from "../services/upload-image";
import { generateInviteCode } from "@/lib/utils";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config/db";

import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { Workspace } from "../types";

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

      let uploadedImageUrl: string | undefined;

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
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const workspaceId = c.req.param("workspaceId");
      const { name, image } = c.req.valid("form");
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN)
        return c.json({ error: "Unauthorized" }, 401);

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        uploadedImageUrl = await uploadImage(storage, image);
      }

      try {
        const workspace = await databases.updateDocument(
          DATABASE_ID,
          WORKSPACES_ID,
          workspaceId,
          {
            name,
            imageUrl: uploadedImageUrl,
          }
        );

        return c.json({ data: workspace });
      } catch (err) {
        console.log(err);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const workspaceId = c.req.param("workspaceId");

    // TODO: Delete members, projects, and tasks

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member || member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized" }, 401);

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .put("/:workspaceId/invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const workspaceId = c.req.param("workspaceId");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member || member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized" }, 401);

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(13),
      }
    );

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const workspaceId = c.req.param("workspaceId");
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (member) return c.json({ error: "Already joined user" }, 400);

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code)
        return c.json({ error: "Invalid invite code" }, 400);

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    }
  );

export default app;
