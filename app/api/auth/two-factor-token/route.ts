import { sendMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { message: "Email and token are required" },
        { status: 400 }
      );
    }

    sendMail({
      email,
      subject: "2FA code",
      html: `<p>Your 2FA code: ${token}</p>`,
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
