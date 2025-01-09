import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const auction = await db.auction.findUnique({
      where: {
        id,
      },
      include: {
        bids: true,
      },
    });

    return NextResponse.json(auction);
  } catch (error) {
    console.log(error);
  }
}
