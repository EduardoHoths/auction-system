import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = new URL(req.url).searchParams.get("status");

    const auctions = await db.auction.findMany({
      where: {
        status: status || "OPEN",
      },
    });

    return NextResponse.json(auctions);
  } catch (error) {
    console.log(error);
  }
}
