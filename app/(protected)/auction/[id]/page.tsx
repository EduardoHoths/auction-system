"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { BidForm } from "@/components/bid-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Auction } from "@/types/auction";

import socket from "@/socket";

export default function AuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const queryClient = useQueryClient();
  const { id } = React.use(params);

  const { data: auction } = useQuery<Auction>({
    queryKey: ["auction", id],
    queryFn: async () => {
      const response = await fetch(`/api/auctions/${id}`);
      return response.json();
    },
  });

  useEffect(() => {
    socket.on("bid-placed", (bid) => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
    });

    return () => {
      socket.off("bid-placed");
    };
  }, [queryClient, id]);

  if (!auction) return null;

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{auction.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              Preço Referência: R$ {auction.referencePrice}
            </p>
            <p className="text-xl font-bold mt-2">
              Lance Atual: R$ {auction.currentBid || auction.referencePrice}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Lances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {auction.bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex justify-between items-center p-2 bg-muted rounded-lg"
                >
                  <span>{bid.bidderName}</span>
                  <span className="font-medium">R$ {bid.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dar Lance</CardTitle>
          </CardHeader>
          <CardContent>
            <BidForm
              auctionId={auction.id}
              currentBid={auction.currentBid || auction.referencePrice}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
