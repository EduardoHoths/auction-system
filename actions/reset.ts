"use server";

import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email",
    };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    // This is a generic error message, because we don't want to reveal the existence of the email.
    return {
      success: "Reset email sent!",
    };
  }

  const existingToken = await getPasswordResetTokenByEmail(email);
  const nextRequestAllowedAtHasPassed =
    new Date(existingToken?.nextRequestAllowedAt || 0) < new Date();

  if (existingToken && !nextRequestAllowedAtHasPassed) {
    return {
      error: "Too many requests. Please try again later.",
      nextRequestAllowedAt: new Date(existingToken.nextRequestAllowedAt),
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    success: "Reset email sent!",
  };
};
