import type { Metadata } from "next";
import DivinationHorns from "@/app/components/DivinationHorns";
import { getGateConfig, getSessionStatus } from "@/app/divination/actions";

export const metadata: Metadata = {
  title: "Divination — ZenCloudMedia",
  description:
    "Virtual Hmong ritual horn divination. Throw a split pair of buffalo horns and receive the spirits' answer.",
};

export default async function DivinationPage({
  searchParams,
}: {
  searchParams: Promise<{ gate?: string }>;
}) {
  const [gateConfig, sessionStatus, params] = await Promise.all([
    getGateConfig(),
    getSessionStatus(),
    searchParams,
  ]);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16 overflow-x-hidden">
      <DivinationHorns
        gateConfig={gateConfig}
        sessionStatus={sessionStatus}
        forceGate={params.gate === "1"}
      />
    </main>
  );
}
