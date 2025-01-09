"use client";

import { useForm } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { useEffect, useState, useTransition } from "react";
import { reset } from "@/actions/reset";

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [countdown, setCountdown] = useState<number>(0);

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (countdown <= 0) return;

    const timerId = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [countdown]);

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    startTransition(() => {
      reset(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);

        if (data.nextRequestAllowedAt) {
          setCountdown(
            Math.floor(
              (new Date(data.nextRequestAllowedAt).getTime() - Date.now()) /
                1000
            )
          );
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || countdown > 0}
          >
            {countdown ? `Resend in ${countdown} seconds` : "Send reset email"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
