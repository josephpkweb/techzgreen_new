import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const env = fs.readFileSync(path.resolve('.env'), 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const anonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
const supabase = createClient(url, anonKey);

async function diagnose() {
  // 1. Raw count - how many rows exist
  const { count, error: ce } = await supabase
    .from('user_vouchers')
    .select('*', { count: 'exact', head: true });
  console.log("Row count:", count, "Error:", ce?.message);

  // 2. Check if used_at column exists by fetching specific columns
  const { data: cols, error: colErr } = await supabase
    .from('user_vouchers')
    .select('id, used_at')
    .limit(1);
  console.log("used_at col exists? Error:", colErr?.message, "Data:", cols);

  // 3. Check vouchers table - do they have partner_id populated?
  const { data: vouchers } = await supabase
    .from('vouchers')
    .select('id, partner_id, title');
  console.log("Vouchers:", vouchers);
}

diagnose();
