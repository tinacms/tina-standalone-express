import { LocalAuthProvider, defineConfig } from "tinacms";
import {ClerkAuthProvider} from 'tinacms-clerk/dist/tinacms'
import Clerk from "@clerk/clerk-js";

const clerkPubKey = process.env.TINA_PUBLIC_CLERK_PUBLIC_KEY!;


/**
 * For premium Clerk users, you can use restrictions
 * https://clerk.com/docs/authentication/allowlist
 */


const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export default defineConfig({
  contentApiUrlOverride: isLocal
    ? "http://localhost:3000/api/tina/gql"
    : "https://my-hosted-server.com/graphql", // ensure this value is provided depending on your hosting solution 
  authProvider: isLocal ? new LocalAuthProvider() : new ClerkAuthProvider({
    clerk: new Clerk(clerkPubKey),
    allowedList: ['logan@tina.io']
  }),
  build: {
    outputFolder: "admin",
    publicFolder: "site",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "pages",
        label: "Pages",
        path: "site",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
