import type { Metadata } from "next";
import DivinationHorns from "@/app/components/DivinationHorns";
import { getGateConfig, getSessionStatus } from "@/app/divination/actions";

export const metadata: Metadata = {
  title: "Divination — ZenCloudMedia",
  description:
    "Virtual Hmong ritual horn divination. Throw a split pair of buffalo horns and receive the spirits' answer.",
};

export default async function DivinationPage() {
  const [gateConfig, sessionStatus] = await Promise.all([
    getGateConfig(),
    getSessionStatus(),
  ]);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <DivinationHorns gateConfig={gateConfig} sessionStatus={sessionStatus} />
    </main>
  );
}
