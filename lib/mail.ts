import { api, baseURL } from "./api";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${baseURL}/auth/new-verification?token=${token}`;
  try {
    await api.post(`/api/auth/confirm-email`, {
      email,
      confirmLink,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${baseURL}/auth/new-password?token=${token}`;
  try {
    await api.post(`/api/auth/reset-password`, {
      email,
      resetLink,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    await api.post(`/api/auth/two-factor-token`, {
      email,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};
