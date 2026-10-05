const fs = require('fs');
let c = fs.readFileSync('lib/seo.ts', 'utf8');
const search = /export function buildWebsiteSchema\(\) \{[\s\S]*?\};\n\}/;
const replace = `export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Xornexz',
    url: BASE_URL,
    description: "A premium technology studio that builds what's next.",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: \`\${BASE_URL}/blog?q={search_term_string}\`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}`;
c = c.replace(search, replace);
fs.writeFileSync('lib/seo.ts', c);
