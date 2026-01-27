"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { useEntitySearch } from "@/hooks/use-entity-search";
import { Credential, CredentialType } from "@/generated/prisma/client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView
} from "@/components/common/entity-components";

import { useCredentialsParams } from "../hooks/use-credential-params";
import {
  useRemvoeCredential,
  useSuspenseCredentials
} from "../hooks/use-credentials";

export const CredentialsList = () => {

  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialsItem credential={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
}

export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => (
  <EntityContainer
    header={<CredentialsHeader />}
    search={<CredentialsSearch />}
    pagination={<CredentialsPagination />}
  >
    {children}
  </EntityContainer>
);

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => (
  <EntityHeader
    title="Credentials"
    description="Create and manage your credentials"
    newButtonLabel="New Credential"
    newButtonHref="/credentials/new"
    disabled={disabled}
  />
);

export const CredentialsSearch = () => {

  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });

  return (
    <EntitySearch
      value={searchValue}
      placeholder="Search credentials"
      onChange={onSearchChange}
    />
  );
}

export const CredentialsPagination = () => {

  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={page => setParams({ ...params, page })}
    />
  );
}

export const CredentialsLoading = () => (
  <LoadingView message="Loading credentials..." />
);

export const CredentialsError = () => (
  <ErrorView message="Error loading credentials" />
);

export const CredentialsEmpty = () => {

  const router = useRouter();

  const handleCreateCredential = () => {
    router.push("/credentials/new");
  }

  return (
    <EmptyView
      message="You haven't create any credentials yet. Get started by creating your first credential."
      onNew={handleCreateCredential}
    />
  );
}

const credentialLogos: Record<CredentialType, string> = {
  ANTHROPIC: "/anthropic.svg",
  GEMINI: "/gemini.svg",
  OPENAI: "/openai.svg",
}

export const CredentialsItem = ({ credential }: { credential: Credential }) => {

  const logo = credentialLogos[credential.type] ?? "/openai.svg";
  const removeCredentialMutation = useRemvoeCredential();

  const handleRemoveCredential = () => {
    removeCredentialMutation.mutate({ id: credential.id });
  }

  return (
    <EntityItem
      href={`/credentials/${credential.id}`}
      title={credential.name}
      subtitle={
        <>
          Update {formatDistanceToNow(credential.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(credential.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="flex justify-center items-center">
          <Image
            src={logo}
            alt={credential.type}
            width={20}
            height={20}
          />
        </div>
      }
      isRemoving={removeCredentialMutation.isPending}
      onRemove={handleRemoveCredential}
    />
  );
}