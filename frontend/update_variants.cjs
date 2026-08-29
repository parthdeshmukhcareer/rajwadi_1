const fs = require('fs');
const path = require('path');

const idMapPath = path.join(__dirname, '../backend/idMap.json');
const productsFilePath = path.join(__dirname, 'src/data/products.js');

const mapData = JSON.parse(fs.readFileSync(idMapPath, 'utf8'));
const { variantMap } = mapData;

// We need to parse products.js. Since it's a JS file exporting a constant, it's easier to require it, modify the object, and write it back.
// Since it's an ES module, we can read it, extract the array string, use eval, and then stringify.
let content = fs.readFileSync(productsFilePath, 'utf8');

// The file starts with `const products = [` and ends with `export default products;`
const startIndex = content.indexOf('[');
const endIndex = content.lastIndexOf('export default products;');

if (startIndex !== -1 && endIndex !== -1) {
  let arrayString = content.substring(startIndex, endIndex).trim();
  if (arrayString.endsWith(';')) {
    arrayString = arrayString.slice(0, -1);
  }
  
  // Use Function to evaluate the array string
  const productsArray = new Function(`return ${arrayString}`)();
  
  // For each product, if there is a variant map, build the variants array
  for (const p of productsArray) {
    // We already replaced the IDs with UUIDs in the previous step.
    // So p.id is now the new UUID.
    // BUT variantMap is keyed by the OLD string ID.
    // Wait, variantMap in idMap.json is keyed by OLD string ID.
    // We can find the old string ID by checking variantMap.
    
    // Find the old ID by looking through variantMap?
    // Actually, in update_products.cjs, did I replace the keys in variantMap? No.
    let oldId = null;
    for (const [key, val] of Object.entries(mapData.idMap)) {
      if (val === p.id) {
        oldId = key;
        break;
      }
    }
    
    if (oldId && variantMap[oldId]) {
      const vars = [];
      for (const [size, varId] of Object.entries(variantMap[oldId])) {
        vars.push({
          id: varId,
          size: size,
          stockOnHand: 100
        });
      }
      p.variants = vars;
    }
  }
  
  // Write back to file
  const newContent = `const products = ${JSON.stringify(productsArray, null, 2)};\n\nexport default products;\n`;
  fs.writeFileSync(productsFilePath, newContent);
  console.log('Updated products.js with variant arrays.');
} else {
  console.log('Could not parse products.js');
}
