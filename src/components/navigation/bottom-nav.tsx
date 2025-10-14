"use client";

import { m } from "framer-motion";
import { MessageCircle, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/chat",
    label: "Chats",
    icon: MessageCircle,
  },
  {
    href: "/characters",
    label: "Characters",
    icon: Users,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOutUser } = useAuth();

  const handleSignOut = async () => {
    await signOutUser();
    router.replace("/");
  };

  return (
    <m.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed bottom-5 left-1/2 z-30 w-[92%] max-w-lg -translate-x-1/2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl shadow-[0_22px_40px_-32px_rgba(15,118,110,0.65)]"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 rounded-full px-3 py-2 text-xs font-medium transition-all",
                isActive ? "bg-white/10 text-white shadow-inner" : "text-slate-300",
              )}
            >
              <Link href={item.href}>
                <span className="flex items-center justify-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Link>
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-11 rounded-full text-slate-300 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </m.nav>
  );
}
