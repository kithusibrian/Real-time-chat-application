import { Client, Databases } from "appwrite";

export const PROJECT_ID = "6527d556a46d063a69ca";
export const DATABASE_ID = "6527e2009243a1b04c14";
export const COLLECTION_ID_MESSAGES = "6527e213deb3af37b1f3";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6527d556a46d063a69ca");

export const databases = new Databases(client);

export default client;
