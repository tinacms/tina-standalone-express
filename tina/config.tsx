import React from "react";
import { LocalAuthProvider, defineConfig } from "tinacms";
import {
  TinaUserCollection,
  UsernamePasswordAuthJSProvider,
} from "tinacms-authjs/dist/tinacms";

import { SessionProvider } from "next-auth/react";
/**
 * For premium Clerk users, you can use restrictions
 * https://clerk.com/docs/authentication/allowlist
 */

class Foo extends UsernamePasswordAuthJSProvider {
  getSessionProvider() {
    return (props) => {
      console.log(process.env.NEXTAUTH_URL);
      return (
        <SessionProvider {...props} basePath="h">
          {props.children}
        </SessionProvider>
      );
    };
  }
}

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const config = defineConfig({
  env: {
    NEXTAUTH_URL: "http://localhost:3000/api/tina/auth",
  },
  contentApiUrlOverride: "http://localhost:3000/api/tina/gql", // ensure this value is provided depending on your hosting solution
  authProvider: isLocal ? new LocalAuthProvider() : new Foo(),
  build: {
    outputFolder: "admin",
    publicFolder: "_site",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      TinaUserCollection,
      {
        name: "pages",
        label: "Pages",
        path: "site",
        ui: {
          defaultItem: {
            layout: "layout",
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
            name: "layout",
            label: "Layout",
            options: [
              "layout",
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

export default config;
