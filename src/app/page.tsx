import { caller } from "@/trpc/server";
import { requireAuth } from "@/utils/auth";

import { LogoutButton } from "./logout-button";

const HomePage = async () => {

  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="flex flex-col justify-center items-center gap-y-6 min-w-screen min-h-screen">
      protected server component
      <p>{JSON.stringify(data, null, 2)}</p>
      <LogoutButton />
    </div>
  );
}

export default HomePage;
