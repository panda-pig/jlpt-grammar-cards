"use client";

import { NotificationBar } from "./NotificationBar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import type { ReactNode } from "react";

export function MainLayout({ 
  children, 
  hideNotification = false 
}: { 
  children: ReactNode;
  hideNotification?: boolean;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!hideNotification && <NotificationBar />}
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
