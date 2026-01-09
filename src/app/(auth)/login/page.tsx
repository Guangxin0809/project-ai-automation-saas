import { requireUnauth } from "@/utils/auth";
import { LoginForm } from "@/features/auth/components/login-form";

const LoginPage = async () => {

  await requireUnauth();

  return <LoginForm />;
}

export default LoginPage;