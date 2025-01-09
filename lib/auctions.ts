import { Bid } from "@prisma/client";
import { db } from "./db";

export async function saveBidOnDatabase(auctionId: string, bid: Bid) {
  await db.bid.create({
    data: {
      amount: bid.amount,
      bidderName: bid.bidderName,
      auctionId,
    },
  });
}
