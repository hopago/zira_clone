"use server";

import { getMember } from "@/features/members/utils";

import { DATABASE_ID, PROJECTS_ID } from "@/config/db";

import { createSessionClient } from "@/lib/appwrite";

import { Project } from "./types";

interface GetProjectProp {
  projectId: string;
}

export const getProject = async ({ projectId }: GetProjectProp) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      workspaceId: project.workspaceId,
      userId: user.$id,
      databases,
    });
    if (!member) throw new Error("허가되지 않은 액세스입니다");

    return { data: project };
  } catch (err) {
    console.log(err);
    return null;
  }
};
