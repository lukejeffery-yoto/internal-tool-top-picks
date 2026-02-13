import { neon } from "@neondatabase/serverless";
import { PickVersion } from "./types";

function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

function parseProductIds(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return [];
}

export async function ensureSchema() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS top_picks (
      id SERIAL PRIMARY KEY,
      region_code TEXT NOT NULL,
      product_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(region_code, product_id)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_top_picks_region
    ON top_picks(region_code, position)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS pick_versions (
      id SERIAL PRIMARY KEY,
      region_code TEXT NOT NULL,
      product_ids TEXT NOT NULL,
      note TEXT DEFAULT '',
      published_by TEXT DEFAULT '',
      published_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Migrate column from JSONB to TEXT if table was created with old schema
  await sql`
    ALTER TABLE pick_versions
    ALTER COLUMN product_ids TYPE TEXT USING product_ids::text
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_pick_versions_region
    ON pick_versions(region_code, published_at DESC)
  `;
}

export async function getPicksForRegion(
  regionCode: string
): Promise<string[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT product_id FROM top_picks
    WHERE region_code = ${regionCode}
    ORDER BY position ASC
  `;
  return rows.map((r) => r.product_id);
}

export async function savePicksForRegion(
  regionCode: string,
  productIds: string[]
) {
  const sql = getDb();
  // Delete existing picks for this region
  await sql`DELETE FROM top_picks WHERE region_code = ${regionCode}`;
  // Insert new picks with position
  for (let i = 0; i < productIds.length; i++) {
    await sql`
      INSERT INTO top_picks (region_code, product_id, position)
      VALUES (${regionCode}, ${productIds[i]}, ${i})
    `;
  }
}

export async function publishPicks(
  regionCode: string,
  productIds: string[],
  note: string = "",
  publishedBy: string = ""
): Promise<PickVersion> {
  const sql = getDb();
  const productIdsJson = JSON.stringify(productIds);
  const rows = await sql`
    INSERT INTO pick_versions (region_code, product_ids, note, published_by)
    VALUES (${regionCode}, ${productIdsJson}, ${note}, ${publishedBy})
    RETURNING id, region_code, product_ids, note, published_by, published_at
  `;
  const row = rows[0];
  return {
    id: row.id,
    regionCode: row.region_code,
    productIds: parseProductIds(row.product_ids),
    note: row.note,
    publishedBy: row.published_by,
    publishedAt: row.published_at,
  };
}

export async function getPickVersions(
  regionCode: string,
  limit: number = 50
): Promise<PickVersion[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, region_code, product_ids, note, published_by, published_at
    FROM pick_versions
    WHERE region_code = ${regionCode}
    ORDER BY published_at DESC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    id: row.id,
    regionCode: row.region_code,
    productIds: parseProductIds(row.product_ids),
    note: row.note,
    publishedBy: row.published_by,
    publishedAt: row.published_at,
  }));
}

export async function getLatestPublishedPicks(
  regionCode: string
): Promise<PickVersion | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT id, region_code, product_ids, note, published_by, published_at
    FROM pick_versions
    WHERE region_code = ${regionCode}
    ORDER BY published_at DESC
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    regionCode: row.region_code,
    productIds: parseProductIds(row.product_ids),
    note: row.note,
    publishedBy: row.published_by,
    publishedAt: row.published_at,
  };
}
