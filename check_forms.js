const fs = require('fs');
const glob = require('glob');

glob('src/**/*.tsx', (err, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('onSubmit={')) {
      const formMatches = content.match(/onSubmit=\{([^}]+)\}/g);
      if (formMatches) {
        formMatches.forEach(match => {
          const funcName = match.match(/onSubmit=\{([^}]+)\}/)[1];
          // Check if funcName has preventDefault in the file
          if (!content.includes('preventDefault') && !funcName.includes('preventDefault')) {
             console.log(`File ${file} has form without preventDefault in ${funcName}`);
          }
        });
      }
    }
  });
});
