import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { ClientGreeting } from "./client-greeting";

const HomePage = async () => {

  prefetch(
    trpc.hello.queryOptions({
      text: "guangxin"
    }),
  );

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientGreeting />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default HomePage;
