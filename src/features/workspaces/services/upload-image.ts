import { IMAGES_BUCKET_ID } from "@/config/db";

import { ID, Storage } from "node-appwrite";

export async function uploadImage(
  storage: Storage,
  image: File
): Promise<string | null> {
  try {
    const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
    const arrayBuffer = await storage.getFilePreview(
      IMAGES_BUCKET_ID,
      file.$id
    );

    return `data:image/png;base64,${btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    )}`;
  } catch (error) {
    return null;
  }
}
