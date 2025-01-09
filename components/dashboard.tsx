"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Auction } from "@/types/auction";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");

  const { data: auctions } = useQuery<Auction[]>({
    queryKey: ["auctions", activeTab],
    queryFn: async () => {
      const response = await fetch(`/api/auctions?status=${activeTab}`);
      return response.json();
    },
  });

  console.log(auctions);

  return (
    <div className="container mx-auto p-6">
      <Tabs
        defaultValue="open"
        onValueChange={(value) => setActiveTab(value as "open" | "closed")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="open">Abertos</TabsTrigger>
          <TabsTrigger value="closed">Encerrados</TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auctions?.map((auction) => (
              <Link href={`/auction/${auction.id}`} key={auction.id}>
                <Card className="hover:bg-accent transition-colors">
                  <CardHeader>
                    <CardTitle>{auction.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Preço Referência: R$ {auction.referencePrice}
                    </p>
                    <p className="text-sm font-medium mt-2">
                      Lance Atual: R${" "}
                      {auction.currentBid || auction.referencePrice}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="closed" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {auctions?.map((auction) => (
              <Link href={`/auction/${auction.id}`} key={auction.id}>
                <Card className="hover:bg-accent transition-colors">
                  <CardHeader>
                    <CardTitle>{auction.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Preço Referência: R$ {auction.referencePrice}
                    </p>
                    <p className="text-sm font-medium mt-2">
                      Lance Atual: R${" "}
                      {auction.currentBid || auction.referencePrice}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
