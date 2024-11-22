"use server";

import { Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config/db";

import { Workspace } from "../types";
import { createSessionClient } from "@/lib/appwrite";

interface GetWorkspaceProps {
  id: string;
}

interface GetWorkspaceInfoProps {
  id: string;
}

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);
    if (members.total === 0) return { data: { documents: [], total: 0 } };

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return { data: workspaces };
  } catch (err) {
    return { data: { documents: [], total: 0 } };
  }
};

export const getWorkspace = async ({ id }: GetWorkspaceProps) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({
      workspaceId: id,
      userId: user.$id,
      databases,
    });
    if (!member) return null;

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      id
    );

    return { data: workspace };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getWorkspaceInfo = async ({ id }: GetWorkspaceInfoProps) => {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      id
    );

    return { data: { name: workspace.name } };
  } catch (err) {
    console.log(err);
    return null;
  }
};
