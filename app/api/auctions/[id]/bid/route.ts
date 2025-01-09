import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { amount, bidderName } = await req.json();

    console.log(amount, bidderName, id);

    const bid = await db.bid.create({
      data: {
        amount,
        bidderName,
        auctionId: id,
      },
    });

    await db.auction.update({
      where: {
        id,
      },
      data: {
        currentBid: amount,
      },
    });

    return NextResponse.json(bid);
  } catch (error) {
    console.log(error);
  }
}
