const fs = require('fs');
const path = require('path');

console.log('=== RUNNING ARH DSA VERIFICATION SUITE ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Check build files
assert(fs.existsSync('dist/index.html'), 'dist/index.html exists');
if (fs.existsSync('dist/assets')) {
  const distFiles = fs.readdirSync('dist/assets');
  assert(distFiles.some(f => f.endsWith('.js')), 'Production JS bundle generated in dist/assets');
  assert(distFiles.some(f => f.endsWith('.css')), 'Production CSS bundle generated in dist/assets');
} else {
  assert(false, 'dist/assets directory exists (run build first)');
}

// 2. Check logo and CSV assets
assert(fs.existsSync('public/arh-logo.png'), 'public/arh-logo.png exists');
assert(fs.existsSync('public/Links_DSA___Abdul_Bari.csv'), 'Original CSV preserved in public/');
assert(fs.existsSync('Links_DSA___Abdul_Bari.csv'), 'Original CSV preserved in root');

// 3. Inspect abdulBariData.ts
const dataFile = fs.readFileSync('src/data/abdulBariData.ts', 'utf8');
const problemsMatch = dataFile.match(/"id":\s*(\d+)/g);
assert(problemsMatch && problemsMatch.length === 93, `Exactly 93 problems found in abdulBariData.ts (found ${problemsMatch ? problemsMatch.length : 0})`);

// 4. Verify topic categories
const categoriesFile = fs.readFileSync('src/data/topicCategories.ts', 'utf8');
assert(categoriesFile.includes('Dynamic Programming'), 'Dynamic Programming category present');
assert(categoriesFile.includes('Divide & Conquer'), 'Divide & Conquer category present');
assert(categoriesFile.includes('Fundamentals'), 'Fundamentals category present');
assert(categoriesFile.includes('Greedy'), 'Greedy category present');
assert(categoriesFile.includes('Sorting'), 'Sorting category present');
assert(categoriesFile.includes('Graphs'), 'Graphs category present');
assert(categoriesFile.includes('Binary Search'), 'Binary Search category present');

// 5. Test data integrity
const dataArray = JSON.parse(dataFile.match(/export const ABDUL_BARI_PROBLEMS: DSAProblem\[\] = (\[[\s\S]*?\]);/)[1]);
assert(dataArray.length === 93, 'Data array length matches 93');
assert(dataArray.every((p, idx) => p.id === idx + 1), 'Problem IDs are strictly contiguous from 1 to 93');
const uniqueUrls = new Set(dataArray.map(p => p.videoUrl));
assert(uniqueUrls.size === 93, 'All 93 video URLs are unique with 0 duplicate videos');

console.log(`\nVerification complete: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
}
