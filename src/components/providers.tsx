"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/contexts/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <AuthProvider>{children}</AuthProvider>
    </LazyMotion>
  );
}
