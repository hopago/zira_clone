"use server";

import { cookies } from "next/headers";

import { Account, Client } from "node-appwrite";

import { AUTH_COOKIE } from "../constants/cookie";

export const isLoggedIn = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);
    if (!session) return null;

    client.setSession(session.value);

    const account = new Account(client);

    return await account.get();
  } catch (err) {
    console.log(err);
    return null;
  }
};