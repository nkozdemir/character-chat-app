"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { MessageCircle, Users, LogOut, UserCircle2 } from "lucide-react";
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
  const { user, signOutUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!profileOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [profileOpen]);

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOutUser();
    router.replace("/");
  };

  return (
    <m.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed left-1/2 z-30 w-[92%] max-w-lg -translate-x-1/2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl shadow-[0_22px_40px_-32px_rgba(15,118,110,0.65)]"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
      }}
    >
      <div className="relative flex items-center justify-between gap-2 text-xs">
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
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProfileOpen((current) => !current)}
            className={cn(
              "w-12 rounded-full text-slate-300 hover:text-white p-0",
              profileOpen ? "bg-white/10 text-white" : "",
            )}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <UserCircle2 className="h-4 w-4" />
          </Button>
          <AnimatePresence>
            {profileOpen ? (
              <m.div
                ref={profileCardRef}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-12 right-0 z-50 w-60 rounded-2xl border border-white/15 bg-slate-900/95 p-4 text-left shadow-[0_32px_80px_-48px_rgba(15,118,110,0.75)] backdrop-blur-xl"
              >
                <div className="space-y-3 text-sm text-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Signed in as
                    </p>
                    <p className="mt-1 font-semibold">
                      {user?.displayName || user?.email || "Unknown user"}
                    </p>
                    {user?.email && user?.displayName ? (
                      <p className="text-xs text-slate-400">{user.email}</p>
                    ) : null}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center rounded-full text-xs font-semibold"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </m.nav>
  );
}
