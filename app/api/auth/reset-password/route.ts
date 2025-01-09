import { sendMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, resetLink } = await req.json();

    if (!email || !resetLink) {
      return NextResponse.json(
        { message: "Email and reset link are required" },
        { status: 400 }
      );
    }

    sendMail({
      email,
      subject: "Reset your password",
      html: `
      <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 }
    );
  }
}
