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
  contentApiUrlOverride: '/api/tina/gql', // ensure this value is provided depending on your hosting solution 
  authProvider: isLocal ? new LocalAuthProvider() : new ClerkAuthProvider({
    clerk: new Clerk(clerkPubKey),
    allowedList: ['logan@forestry.io']
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
        ui: {
          defaultItem: {
            layout: 'layout',
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: 'layout',
            label: 'Layout',
            options: [
              'layout',
              // add more layouts here
            ],
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
