const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modified = 0;
walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Split by <select and process each part to ensure we only target select tags
    const parts = content.split('<select');
    for (let i = 1; i < parts.length; i++) {
        // Find the closing bracket of the opening select tag
        const endOfOpenTag = parts[i].indexOf('>');
        if (endOfOpenTag !== -1) {
            let selectTag = parts[i].substring(0, endOfOpenTag);
            
            // Replace bg-transparent with bg-white dark:bg-gray-900
            selectTag = selectTag.replace(/bg-transparent/g, 'bg-white dark:bg-gray-900');
            // Replace dark:bg-black/20 with dark:bg-gray-900
            selectTag = selectTag.replace(/dark:bg-black\/20/g, 'bg-white dark:bg-gray-900');
            // Check if it already has dark:bg-gray-900, if not and no bg logic is present, add it to className
            if (!selectTag.includes('dark:bg-gray-900') && selectTag.includes('className=')) {
                 selectTag = selectTag.replace(/className=["']([^"']*)["']/, (match, p1) => {
                     return `className="${p1} bg-white dark:bg-gray-900"`;
                 });
                 selectTag = selectTag.replace(/className=\{([^}]*)\}/, (match, p1) => {
                     // Very basic replacement for dynamic classes if it's a simple string or template literal
                     if (p1.includes('`')) {
                         return `className={\`${p1.replace(/`/g, '')} bg-white dark:bg-gray-900\`}`;
                     }
                     // If it's a variable like `inp`, we might need to modify the variable itself, but let's just append it using template literals
                     return `className={\`\$\{${p1}\} bg-white dark:bg-gray-900\`}`;
                 });
            }
            
            parts[i] = selectTag + parts[i].substring(endOfOpenTag);
        }
    }
    
    content = parts.join('<select');
    
    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      modified++;
      console.log(`Updated ${filePath}`);
    }
  }
});

console.log(`Modified ${modified} files.`);
