import { GetServerSideProps } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import React, { useState } from "react";

interface SignInProps {
  csrfToken: string;
}

export default function SignIn({ csrfToken }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 shadow-md rounded-md space-y-6 w-full max-w-sm"
      >
        <div className="flex justify-center">
          <img src="/logo.svg" alt="App Logo" className="h-12" />
        </div>

        <h1 className="text-2xl font-semibold text-center">Sign In</h1>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SignInProps> = async (
  ctx
) => ({
  props: { csrfToken: (await getCsrfToken(ctx)) ?? "" },
});
