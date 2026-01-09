import { requireUnauth } from "@/utils/auth";
import { RegisterForm } from "@/features/auth/components/register-form";

const SignupPage = async () => {

  await requireUnauth();

  return <RegisterForm />;
}

export default SignupPage