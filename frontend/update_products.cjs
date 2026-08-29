const fs = require('fs');
const path = require('path');

const idMapPath = path.join(__dirname, '../backend/idMap.json');
const productsFilePath = path.join(__dirname, 'src/data/products.js');

const mapData = JSON.parse(fs.readFileSync(idMapPath, 'utf8'));
let productsContent = fs.readFileSync(productsFilePath, 'utf8');

const { idMap, variantMap } = mapData;

// Replace product IDs
for (const [oldId, newId] of Object.entries(idMap)) {
  const regex = new RegExp(`id:\\s*["']${oldId}["']`, 'g');
  productsContent = productsContent.replace(regex, `id: "${newId}"`);
  
  // also replace any occurrences in the file as a string
  const strRegex = new RegExp(`["']${oldId}["']`, 'g');
  productsContent = productsContent.replace(strRegex, `"${newId}"`);
}

// Write the file back
fs.writeFileSync(productsFilePath, productsContent);
console.log('Updated products.js with new UUIDs.');
