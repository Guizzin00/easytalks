const fs = require('fs');
if (fs.existsSync('public/Ativo 21.svg')) {
  fs.renameSync('public/Ativo 21.svg', 'public/ativo21.svg');
}
