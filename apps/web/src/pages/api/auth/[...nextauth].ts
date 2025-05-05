import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export default NextAuth({
  // Use Supabase tables to store users & sessions
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE!,
  }),
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) {
          throw new Error("Email and password required");
        }
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
          email: creds.email,
          password: creds.password,
        });
        if (error || !data.session) {
          throw new Error(error?.message ?? "Invalid credentials");
        }
        return { id: data.user.id, email: data.user.email! };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

// // apps/web/src/pages/api/auth/[...nextauth].ts
// import NextAuth from "next-auth";
// import { authConfig } from "@/server/auth/config";
// export default NextAuth(authConfig);
