"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials!" };
  }

  const existingToken = await getVerificationTokenByEmail(email);
  const nextRequestAllowedAtHasPassed =
    new Date(existingToken?.nextRequestAllowedAt || 0) < new Date();

  if (existingToken && !nextRequestAllowedAtHasPassed) {
    return {
      success: "Verify your email to continue.",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    try {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return { success: "Confirmation email sent!" };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
