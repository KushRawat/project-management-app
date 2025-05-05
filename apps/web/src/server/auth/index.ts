import NextAuth from "next-auth";
import { cache } from "react";
import { authConfig } from "./config";

// NextAuth returns an `auth` handler plus helpers if you need them.
// We wrap it in a cache so it’s stable across HMR.
const { auth: _auth, handlers, signIn, signOut } = NextAuth(authConfig);
export const auth = cache(_auth);

// (optional) re-export helpers if you use them elsewhere
export { handlers, signIn, signOut };
