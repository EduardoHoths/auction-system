import { sendMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, confirmLink } = await req.json();

    if (!email || !confirmLink) {
      return NextResponse.json(
        { message: "Email and confirm link are required" },
        { status: 400 }
      );
    }

    await sendMail({
      email,
      subject: "Confirm your email",
      html: `
      <p>Click <a href="${confirmLink}">here</a> to confirm email.</p>
      `,
    });

    return NextResponse.json(
      { message: "Email enviado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}
