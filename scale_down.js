const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src');

const replacements = [
  { from: /border-4/g, to: 'border-2' },
  { from: /border-b-4/g, to: 'border-b-2' },
  { from: /border-t-4/g, to: 'border-t-2' },
  { from: /border-r-4/g, to: 'border-r-2' },
  { from: /border-l-4/g, to: 'border-l-2' },
  { from: /w-72/g, to: 'w-60' },
  { from: /p-6/g, to: 'p-4' },
  { from: /p-8/g, to: 'p-6' },
  { from: /p-12/g, to: 'p-8' },
  { from: /p-3/g, to: 'p-2' },
  { from: /px-6/g, to: 'px-4' },
  { from: /py-6/g, to: 'py-4' },
  { from: /gap-8/g, to: 'gap-6' },
  { from: /mb-12/g, to: 'mb-8' },
  { from: /mb-8/g, to: 'mb-6' },
  { from: /text-6xl/g, to: 'text-4xl' },
  { from: /text-5xl/g, to: 'text-3xl' },
  { from: /text-4xl/g, to: 'text-2xl' },
  { from: /text-3xl/g, to: 'text-xl' },
  { from: /text-2xl/g, to: 'text-lg' },
  { from: /text-xl/g, to: 'text-base' },
  { from: /w-10 h-10/g, to: 'w-8 h-8' },
  { from: /w-16 h-16/g, to: 'w-12 h-12' },
  { from: /w-24 h-24/g, to: 'w-16 h-16' }
];

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir(directoryPath);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
