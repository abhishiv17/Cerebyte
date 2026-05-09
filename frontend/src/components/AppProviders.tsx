"use client";

import { TutorProvider } from "@/components/TutorProvider";
import CommsToggle from "@/components/CommsToggle";
import ProfileSync from "@/components/ProfileSync";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TutorProvider>
      {children}
      <CommsToggle />
      <ProfileSync />
    </TutorProvider>
  );
}
