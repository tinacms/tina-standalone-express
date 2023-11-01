import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { MongodbLevel } from "mongodb-level";
import { GitHubProvider } from "tinacms-gitprovider-github";
import dotenv from "dotenv";

dotenv.config();

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

console.log("isLocal", isLocal);

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        branch: process.env.GITHUB_BRANCH!,
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
      }),
      databaseAdapter: new MongodbLevel<string, Record<string, unknown>>({
        collectionName: process.env.GITHUB_BRANCH!,
        dbName: "tinacms-test-oct-31",
        mongoUri: process.env.MONGODB_URI!,
      }),
    });
