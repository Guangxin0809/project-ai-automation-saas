import { requireAuth } from "@/utils/auth";
import { CredentialForm } from "@/features/credentials/components/credential";

const CredentialCreationPage = async () => {

  await requireAuth();

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="flex flex-col gap-y-8 w-full max-w-3xl h-full mx-auto">
        <CredentialForm />
      </div>
    </div>
  );
}

export default CredentialCreationPage;