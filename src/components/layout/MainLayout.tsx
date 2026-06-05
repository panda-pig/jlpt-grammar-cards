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
    <>
      {/* Dot-grain texture overlay — sits above all content, blends multiplicatively */}
      <div className="page-grain" aria-hidden="true" />

      <div className="flex flex-col min-h-screen">
        {!hideNotification && <NotificationBar />}
        <Header />
        <main className="flex-1 pb-[72px] xl:pb-0">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </>
  );
}
