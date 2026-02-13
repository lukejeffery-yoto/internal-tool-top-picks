import { neon } from "@neondatabase/serverless";

function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
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
