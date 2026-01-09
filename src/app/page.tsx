import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";

const HomePage = async () => {

  const users = await prisma.user.findMany();
  console.log("users length: ", users.length);

  return (
    <div>
      HomePage
      <Button>Hello</Button>
    </div>
  );
}

export default HomePage;