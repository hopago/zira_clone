"use server";

import { createSessionClient } from "@/lib/appwrite";

export const isLoggedIn = async () => {
  try {
    const { account } = await createSessionClient();

    return await account.get();
  } catch (err) {
    console.log(err);
    return null;
  }
};
