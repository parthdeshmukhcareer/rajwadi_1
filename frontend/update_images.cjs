const fs = require('fs');
let code = fs.readFileSync('src/data/products.js', 'utf8');

const images = [
  '/our collections/RHL01633.jpg',
  '/our collections/RHL01635.jpg',
  '/our collections/RHL01652.jpg',
  '/our collections/RHL01693.jpg',
  '/our collections/RHL01703.jpg',
  '/our collections/RHL01708.jpg',
  '/our collections/RHL01730.jpg',
  '/our collections/RHL01765.jpg',
  '/our collections/RHL01788.jpg',
  '/our collections/RHL01800.jpg',
  '/our collections/RHL01811.jpg',
  '/our collections/RHL01820.jpg',
  '/our collections/RHL01822.jpg',
  '/our collections/RHL01843.jpg',
  '/our collections/RHL01848.jpg',
  '/our collections/RHL01865.jpg',
  '/our collections/RHL01872.jpg',
  '/our collections/RHL01883.jpg',
];

let idx = 0;
// Replace the main image
code = code.replace(/image: \".*?\",/g, (match) => {
  const replacement = `image: "${images[idx % images.length]}",`;
  idx++;
  return replacement;
});

// Since the first product also has an 'images' array, let's fix it too just in case.
code = code.replace(/images: \[.*?\],/g, (match) => {
  return `images: ["${images[0]}"],`;
});

// also fix if the user used `// reuse saree.png` etc.
code = code.replace(/image: \"\/assets\/collection\/.*?\".*/g, (match) => {
  const replacement = `image: "${images[idx % images.length]}",`;
  idx++;
  return replacement;
});

fs.writeFileSync('src/data/products.js', code);
console.log('Updated products.js successfully');
