const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'src', 'data', 'abdulBariData.ts');
const dataContent = fs.readFileSync(dataFilePath, 'utf8');

const match = dataContent.match(/export const ABDUL_BARI_PROBLEMS: DSAProblem\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find ABDUL_BARI_PROBLEMS array in abdulBariData.ts');
  process.exit(1);
}

const problems = JSON.parse(match[1]);
console.log(`Loaded ${problems.length} problems.`);

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// 1. Generate full CSV with ID, Title, Video URL, Category, and current platform links for reference & editing
const fullHeaders = ['ID', 'Title', 'Video URL', 'Category', 'LeetCode', 'HackerRank', 'CodeChef'];
const fullRows = [fullHeaders.join(',')];

for (const item of problems) {
  const leetCodeStr = (item.leetCode || []).join('\n');
  const hackerRankStr = (item.hackerRank || []).join('\n');
  const codeChefStr = (item.codeChef || []).join('\n');
  
  fullRows.push([
    escapeCsv(item.id),
    escapeCsv(item.title),
    escapeCsv(item.videoUrl),
    escapeCsv(item.category),
    escapeCsv(leetCodeStr),
    escapeCsv(hackerRankStr),
    escapeCsv(codeChefStr)
  ].join(','));
}

const fullCsvPath = path.join(__dirname, 'Abdul_Bari_93_Videos.csv');
fs.writeFileSync(fullCsvPath, fullRows.join('\n'), 'utf8');
console.log(`Created: ${fullCsvPath}`);

// 2. Also generate a clean lightweight 2-column CSV (Title and Video URL) strictly as requested
const simpleHeaders = ['Title', 'Video URL'];
const simpleRows = [simpleHeaders.join(',')];

for (const item of problems) {
  simpleRows.push([
    escapeCsv(item.title),
    escapeCsv(item.videoUrl)
  ].join(','));
}

const simpleCsvPath = path.join(__dirname, 'Abdul_Bari_Videos_Links_Only.csv');
fs.writeFileSync(simpleCsvPath, simpleRows.join('\n'), 'utf8');
console.log(`Created: ${simpleCsvPath}`);
