"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import socket from "@/socket";
import { useSession } from "next-auth/react";

import { api } from "@/lib/api";
import { useEffect } from "react";

const bidFormSchema = z.object({
  amount: z.number().min(0),
  bidderName: z.string().min(2),
});

interface BidFormProps {
  auctionId: string;
  currentBid: number;
}

export function BidForm({ auctionId, currentBid }: BidFormProps) {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof bidFormSchema>>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      amount: currentBid + 1,
      bidderName: session?.user?.name ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof bidFormSchema>) {
    try {
      await api.post(
        `/api/auctions/${auctionId}/bid`,
        values
      );

      socket.emit("place-bid", {
        auctionId,
        ...values,
      });
    } catch (error) {
      console.log(error);
    }

    form.setValue("amount", form.getValues("amount") + 1);
  }

  useEffect(() => {
    form.setValue("amount", currentBid + 1);
  }, [currentBid]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do Lance</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={currentBid + 1}
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Dar Lance
        </Button>
      </form>
    </Form>
  );
}
