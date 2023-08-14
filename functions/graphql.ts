import { databaseClient } from "../tina/__generated__/databaseClient";
import { Clerk } from "@clerk/backend";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import express from "express";

/**
 * For premium Clerk users, you can use restrictions
 * https://clerk.com/docs/authentication/allowlist
 */
export const isUserAllowed = (emailAddress: string) => {
  const allowList = [process.env.TINA_PUBLIC_PERMITTED_EMAIL];
  if (allowList.includes(emailAddress)) {
    return true;
  }
  return false;
};

const app = express();
const port = 3000;

const secretKey = process.env.CLERK_SECRET;
const clerk = Clerk({
  secretKey,
});

const isAuthorized = async (authHeader: string) => {
  if (process.env.TINA_PUBLIC_IS_LOCAL === "true") {
    return true;
  }

  const requestState = await clerk.authenticateRequest({
    headerToken: authHeader,
  });
  if (requestState.status === "signed-in") {
    const user = await clerk.users.getUser(requestState.toAuth().userId);
    const primaryEmail = user.emailAddresses.find(
      ({ id }) => id === user.primaryEmailAddressId
    );
    if (primaryEmail && isUserAllowed(primaryEmail.emailAddress)) {
      return true;
    }
  }
  return false;
};

app.use(cors());
app.use(express.json());

app.post("/graphql", async (req, res) => {
  if (!isAuthorized(req.headers["authorization"])) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Not authorized" }),
    };
  }
  const { query, variables } = req.body;
  const result = await databaseClient.request({
    query,
    variables,
  });
  res.status(200).json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
