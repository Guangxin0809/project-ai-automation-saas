"use client";

import z from "zod";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CredentialType } from "@/generated/prisma/enums";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential
} from "../hooks/use-credentials";

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    value: string;
    type: CredentialType;
  }
}

const credentialFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "Value is required"),
});

type CredentialFormValues = z.infer<typeof credentialFormSchema>;

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/openai.svg",
  },
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/gemini.svg",
  },
  {
    value: CredentialType.ANTHROPIC,
    label: "Anthropic",
    logo: "/anthropic.svg",
  },
];

export const CredentialForm = ({ initialData }: CredentialFormProps) => {

  const router = useRouter();
  const { modal, handleError } = useUpgradeModal();
  const createCredentialMutation = useCreateCredential();
  const updateCredentialMutation = useUpdateCredential();

  const isEdit = !!initialData?.id;

  const form = useForm<CredentialFormValues>({
    resolver: zodResolver(credentialFormSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
      type: CredentialType.OPENAI,
    },
  });

  const onSubmit = async (values: CredentialFormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredentialMutation.mutateAsync({
        id: initialData.id,
        ...values,
      });
    } else {
      await createCredentialMutation.mutateAsync(values, {
        onError: handleError,
        onSuccess: (data) => {
          router.push(`/credentials/${data.id}`);
        },
      });
    }
  }

  return (
    <>
      {modal}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Credential" : "Create Credential"}
          </CardTitle>
          <CardDescription>
            {
              isEdit
                ? "Update your API key or credential details"
                : "Add a new API key or credential to your account"
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My API key"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {credentialTypeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            <div className="flex items-cneter gap-x-2">
                              <Image
                                src={option.logo}
                                alt={option.label}
                                width={16}
                                height={16}
                              />

                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="sk-..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end items-center gap-x-4">
                <Button
                  type="submit"
                  disabled={
                    createCredentialMutation.isPending ||
                    updateCredentialMutation.isPending
                  }
                >
                  {isEdit ? "Update" : "Create"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  asChild
                >
                  <Link href="/credentials" prefetch>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export const CredentialView = ({ credentialId }: { credentialId: string }) => {

  const { data: credential } = useSuspenseCredential(credentialId);

  return (
    <CredentialForm initialData={credential} />
  );
}