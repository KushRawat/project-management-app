import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { pathname } = useRouter();
  const noLayout = pathname.startsWith("/auth/");

  return (
    <SessionProvider session={session} basePath="/api/auth">
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  );
}

export default api.withTRPC(MyApp);


// import '@/styles/globals.css';
// import { SessionProvider } from 'next-auth/react';
// // import { withTRPC } from '@/utils/trpc';
// import Layout from '@/components/Layout';
// import type { AppProps } from 'next/app';

// function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
//   return (
//     <SessionProvider session={session}>
//       {/* Wrap every page in your Layout */}
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
//     </SessionProvider>
//   );
// }

// export default withTRPC(MyApp);
