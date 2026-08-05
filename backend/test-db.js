const { PrismaClient } = require('@prisma/client');
async function test() {
  console.log("Testing DIRECT_URL (5432)...");
  let prisma1 = new PrismaClient({
    datasources: { db: { url: 'postgresql://postgres.vbfzbdywootdgxnhxkfc:laherparesh12345@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres' } }
  });
  try {
    const c1 = await prisma1.user.count();
    console.log("DIRECT_URL works:", c1);
  } catch (e) {
    console.error("DIRECT_URL error:", e.message);
  } finally { await prisma1.$disconnect(); }

  console.log("Testing POOLER_URL with postgres (6543)...");
  let prisma2 = new PrismaClient({
    datasources: { db: { url: 'postgresql://postgres:laherparesh12345@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true' } }
  });
  try {
    const c2 = await prisma2.user.count();
    console.log("POOLER_URL with postgres works:", c2);
  } catch (e) {
    console.error("POOLER_URL with postgres error:", e.message);
  } finally { await prisma2.$disconnect(); }
}
test();
