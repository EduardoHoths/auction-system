"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { Dashboard } from "@/components/dashboard";
import React from "react";

const page = () => {
  return (
    <div>
      <h1>Page Protected</h1>

      <Dashboard />

      <LogoutButton>Logout</LogoutButton>
    </div>
  );
};

export default page;
