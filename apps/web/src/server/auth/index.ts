import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [ /* … */ ],
  secret: process.env.NEXTAUTH_SECRET,
  // etc
}

export default NextAuth(authOptions)
