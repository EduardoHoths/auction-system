import React from "react";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import ReactQueryProvider from "@/components/providers/react-query-provider";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth();
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500 to-blue-800">
      <SessionProvider session={session}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </SessionProvider>
    </div>
  );
};

export default ProtectedLayout;
