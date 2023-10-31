import express from "express";
import { TinaNodeBackend, LocalBackendAuthentication } from '@tinacms/datalayer'
import { ClerkBackendAuthentication } from 'tinacms-clerk'
import cors from "cors";
import dotenv from "dotenv";

import { databaseClient } from "../tina/__generated__/databaseClient";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

const secretKey = process.env.CLERK_SECRET!;


app.use(cors());
app.use(express.json());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'


const handler = TinaNodeBackend({
   authentication: 
    isLocal ? LocalBackendAuthentication() : 
     ClerkBackendAuthentication({
       secretKey,
     }),
   databaseClient,
})


app.post("/api/tina/*", async (req, res) => {
  // Modify request if needed
  handler(req, res)
});

app.listen(port, () => {
    console.log(`express backend listing on port ${port}`);
});
