import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getPickVersions } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ region: string }> }
) {
  const { region } = await params;
  await ensureSchema();
  const versions = await getPickVersions(region.toUpperCase());
  return NextResponse.json({ region: region.toUpperCase(), versions });
}
