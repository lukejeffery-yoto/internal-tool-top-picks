import { getAllRegionProducts, regions } from "@/lib/data";
import { TopPicksProvider } from "@/context/TopPicksContext";
import { ManagementPanel } from "@/components/management/ManagementPanel";
import { PhonePreview } from "@/components/preview/PhonePreview";

export default async function Home() {
  const productsByRegion = await getAllRegionProducts();

  return (
    <TopPicksProvider regionList={regions} productsByRegion={productsByRegion}>
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
