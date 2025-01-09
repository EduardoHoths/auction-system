import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
  try {
    await axios.post(`${API_URL}/confirm-email`, {
      email,
      confirmLink,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
  try {
    await axios.post(`${API_URL}/reset-password`, {
      email,
      resetLink,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    await axios.post(`${API_URL}/two-factor-token`, {
      email,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};
