const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

function calculateTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function calculateDayAfterTomorrow() {
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  return dayAfterTomorrow.toISOString().split('T')[0];
}

const replacements = {
    tomorrow: calculateTomorrow(),
    dayAfterTomorrow: calculateDayAfterTomorrow()
};

function processJsonFileWithEJS(filePath) {
  if (['package.json', 'package-lock.json'].includes(path.basename(filePath))) {
    console.log(`Skipping ${path.basename(filePath)}`);
    return;
  }

  ejs.renderFile(filePath, replacements, {}, (err, str) => {
    if (err) {
      console.error(`Error rendering file: ${filePath}`, err);
      return;
    }

    fs.writeFile(filePath, str, 'utf8', err => {
      if (err) {
        console.error(`Error writing file: ${filePath}`, err);
      } else {
        console.log(`Successfully updated file: ${filePath}`);
      }
    });
  });

}

// Process all JSON files in the current directory, excluding package.json and package-lock.json
fs.readdir('.', { withFileTypes: true }, (err, entries) => {
  if (err) {
    console.error('Error listing files in directory', err);
    return;
  }

  entries.forEach(entry => {
    if (entry.isFile() && path.extname(entry.name) === '.json' && !['package.json', 'package-lock.json'].includes(entry.name)) {
      processJsonFileWithEJS(path.join('.', entry.name));
    }
  });
});
