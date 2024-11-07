import { IMAGES_BUCKET_ID } from "@/config/db";

import { ID, Storage } from "node-appwrite";

export async function uploadImage(
  storage: Storage,
  image: File
): Promise<string | null> {
  try {
    const file = await storage.createFile(
      IMAGES_BUCKET_ID,
      ID.unique() + "." + image.name.split(".").pop(),
      image
    );
    const arrayBuffer = await storage.getFilePreview(
      IMAGES_BUCKET_ID,
      file.$id
    );

    const mimeType = image.type;

    return `data:${mimeType};base64,${Buffer.from(arrayBuffer).toString(
      "base64"
    )}`;
  } catch (error) {
    console.log(error);
    return null;
  }
}
