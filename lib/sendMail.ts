import { Resend } from "resend";

type MailOptions = {
  subject: string;
  html: string;
  email: string;
};

export const sendMail = async ({ email, subject, html }: MailOptions) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject,
    html,
  });
};
