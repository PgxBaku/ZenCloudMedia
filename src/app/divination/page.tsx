import type { Metadata } from "next";
import DivinationHorns from "@/app/components/DivinationHorns";

export const metadata: Metadata = {
  title: "Divination — ZenCloudMedia",
  description:
    "Virtual Hmong ritual horn divination. Throw a split pair of buffalo horns and receive the spirits' answer.",
};

export default function DivinationPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <DivinationHorns />
    </main>
  );
}
