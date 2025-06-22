import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Index() {
  // this component never actually renders —
  // the redirect happens server‐side below.
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  return {
    redirect: {
      destination: session ? "/dashboard" : "/auth/signin",
      permanent: false,
    },
  };
};
