const fs = require('fs');
const files = fs.readdirSync('public');
const target = files.find(f => f.includes('.svg') && f.length < 10 && f !== 'icons.svg' && f !== 'favicon.svg');
if (target) {
  fs.renameSync('public/' + target, 'public/bg-swoosh.svg');
  console.log('Renamed', target);
} else {
  console.log('Not found');
}
