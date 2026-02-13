import { getAllRegionProducts, getAllRegionTopPicksHandles, regions } from "@/lib/data";
import { TopPicksProvider } from "@/context/TopPicksContext";
import { ManagementPanel } from "@/components/management/ManagementPanel";
import { PhonePreview } from "@/components/preview/PhonePreview";

export default async function Home() {
  const [productsByRegion, topPicksHandlesByRegion] = await Promise.all([
    getAllRegionProducts(),
    getAllRegionTopPicksHandles(),
  ]);

  // Serialize Sets to arrays for client component props
  const topPicksByRegion = Object.fromEntries(
    Object.entries(topPicksHandlesByRegion).map(([k, v]) => [k, [...v]])
  ) as Record<string, string[]>;

  return (
    <TopPicksProvider regionList={regions} productsByRegion={productsByRegion} topPicksByRegion={topPicksByRegion}>
      <div className="flex h-screen">
        <div className="flex-1 overflow-y-auto border-r border-gray-200">
          <ManagementPanel />
        </div>
        <div className="hidden w-[420px] shrink-0 items-center justify-center bg-gray-100 lg:flex">
          <PhonePreview />
        </div>
      </div>
    </TopPicksProvider>
  );
}
