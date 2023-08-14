> Note this repo assumes basic knowledge of using the
> [MongoDB adapter](https://tina.io/docs/self-hosted/database-adapter/mongodb) and
> [ClerkJS](https://tina.io/docs/self-hosted/authentication-provider/clerk-auth) for auth with Tina.

# Getting started

## Copy the `.env.sample` and provide the appropriate values

```
cp .env.sample .env
```

For the `GITHUB_PERSONAL_ACCESS_TOKEN`, ensure you have access to write content to the repo.

## Run the Tina dev server along with your app

```
npm run dev
```

This will ensure that the `tina/config` is watched for changes, and it will host the database server, which is only
used if `TINA_PUBLIC_IS_LOCAL` is true.

## Run the Express function

You'll also need to run the separate express server function, you can do this in another terminal with `npm run express-dev`.

## Test it out

Visit the admin at `http://localhost:5173/admin/index.html` and login to Clerk, be sure to use the same email address that you supplied
as `TINA_PUBLIC_PERMITTED_EMAIL` in the .env file.

## Testing auth

Set `TINA_PUBLIC_IS_LOCAL` to "false" to test your Clerk auth integration locally

# Going to production

Depending on how you plan to host your express server, steps will vary. But the main thing you'll need to ensure is that you
have all of the approproate environment variables loaded, and that the `contentApiUrlOverride` value reflects the location of your
GraphQL endpoint.
