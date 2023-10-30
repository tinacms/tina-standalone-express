import express from "express";
import { TinaNodeBackend, LocalBackendAuthentication } from '@tinacms/datalayer'
import { ClerkBackendAuthentication } from 'tinacms-clerk'
import cors from "cors";
import dotenv from "dotenv";

import { databaseClient } from "../tina/__generated__/databaseClient";

dotenv.config();


/**
 * For premium Clerk users, you can use restrictions
 * https://clerk.com/docs/authentication/allowlist
 */

const app = express();
const port = 3000;

const secretKey = process.env.CLERK_SECRET!;


app.use(cors());
app.use(express.json());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

const handler = TinaNodeBackend({
  authentication: isLocal
    ? LocalBackendAuthentication()
    : ClerkBackendAuthentication({
      secretKey,
      allowList: ['logan@tina.io']
    }),
  databaseClient,
})

app.post("/api/tina/*", async (req, res) => {
  return await handler(req, res)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
