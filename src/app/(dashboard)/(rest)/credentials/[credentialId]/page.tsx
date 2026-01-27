import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/utils/auth";
import { HydrateClient } from "@/trpc/server";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { CredentialView } from "@/features/credentials/components/credential";
import {
  CredentialsError,
  CredentialsLoading
} from "@/features/credentials/components/credentials";

type Props = {
  params: Promise<{
    credentialId: string
  }>
}

const CredentialPage = async ({ params }: Props) => {

  await requireAuth();

  const { credentialId } = await params;
  prefetchCredential(credentialId);

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="flex flex-col gap-y-8 w-full max-w-3xl h-full mx-auto">
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialsError />}>
            <Suspense fallback={<CredentialsLoading />}>
              <CredentialView credentialId={credentialId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
}

export default CredentialPage;