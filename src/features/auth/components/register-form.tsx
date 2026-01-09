"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

const registerSchema = z.object({
  email: z.email("Please enter an invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(16, "Password can't exceed 16 characters"),
  confirmPassword: z.string(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {

  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSignup = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", { message: "Two passwords don't match" });
      return;
    }

    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push('/')
        },
        onError: (ctx: any) => {
          toast.error(ctx.error.message)
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>get started</CardTitle>
          <CardDescription>Create your account to start</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-y-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Image
                      src="/github.svg"
                      alt="Github"
                      width={20}
                      height={20}
                    />
                    Continue with Github
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                    Continue with Google
                  </Button>
                </div>

                <div className="grid gap-6">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="hello@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Sign up
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
