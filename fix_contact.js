const fs = require('fs');
let c = fs.readFileSync('app/contact/page.tsx', 'utf8');
c = c.replace(/import \{ buildMetadata \} from '@\/lib\/seo';\s*export const metadata[\s\S]*?\}\);\s*/, '');
fs.writeFileSync('app/contact/page.tsx', c);
