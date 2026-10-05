const fs = require('fs');
let c = fs.readFileSync('lib/seo.ts', 'utf8');
const search = "description: 'A premium technology studio that builds what\\\'s next.',";
const replace = 'description: "A premium technology studio that builds what\'s next.",';
c = c.replace(search, replace);
fs.writeFileSync('lib/seo.ts', c);
