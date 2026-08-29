const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'assets', 'collection');
const productsFile = path.join(__dirname, 'src', 'data', 'products.js');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg'));

// Rename files to remove spaces
const newImageNames = [];
files.forEach((file, index) => {
  const ext = path.extname(file);
  const newName = `collection-img-${String(index + 1).padStart(2, '0')}${ext}`;
  fs.renameSync(path.join(dir, file), path.join(dir, newName));
  newImageNames.push(`/assets/collection/${newName}`);
});

console.log('Renamed files:', newImageNames);

let code = fs.readFileSync(productsFile, 'utf8');
let idx = 0;

// Replace main image
code = code.replace(/image: \".*?\",/g, (match) => {
  const replacement = `image: "${newImageNames[idx % newImageNames.length]}",`;
  idx++;
  return replacement;
});

// Replace images array
code = code.replace(/images: \[.*?\],/g, (match) => {
  return `images: ["${newImageNames[0]}"],`;
});

fs.writeFileSync(productsFile, code);
console.log('Updated products.js successfully');
