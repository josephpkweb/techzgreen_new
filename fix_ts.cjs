const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/About.tsx': [{ find: /Leaf,?\s*/, replace: '' }],
  'src/pages/AdminDashboard.tsx': [{ find: /Leaf,?\s*/, replace: '' }, { find: /Settings,?\s*/, replace: '' }],
  'src/pages/Events.tsx': [{ find: /Leaf,?\s*/, replace: '' }],
  'src/pages/FeaturedProducts.tsx': [{ find: /Star,\s*/, replace: '' }, { find: /LinkIcon,\s*/, replace: '' }, { find: /Info,?\s*/, replace: '' }],
  'src/pages/Landing.tsx': [{ find: /Leaf,?\s*/, replace: '' }],
  'src/pages/PartnerDashboard.tsx': [{ find: /const \{ data: partnerId, error \} = await supabase/g, replace: 'const { data: partnerId } = await supabase' }],
  'src/pages/Rewards.tsx': [{ find: /Leaf,\s*/, replace: '' }],
  'src/pages/Shop.tsx': [{ find: /Leaf,?\s*/, replace: '' }, { find: /\/\/ ─── Image carousel for modal ───[\s\S]*?\/\/ ─── Product Detail Modal ───/g, replace: '// ─── Product Detail Modal ───' }],
  'src/pages/UserProfile.tsx': [{ find: /Leaf,\s*/, replace: '' }],
};

for (const [file, rules] of Object.entries(files)) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) continue;
  let code = fs.readFileSync(p, 'utf8');
  for (const r of rules) {
    code = code.replace(r.find, r.replace);
  }
  fs.writeFileSync(p, code);
}
console.log('Fixed TS errors');
