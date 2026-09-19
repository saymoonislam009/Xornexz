import fs from 'fs';

const fixFile = (file) => {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/const project = projects\.find\(\(p\) => p\.slug === slug\);/g, 'const { slug } = await params;\n  const project = projects.find((p) => p.slug === slug);');
  c = c.replace(/const service = services\.find\(\(s\) => s\.slug === slug\);/g, 'const { slug } = await params;\n  const service = services.find((s) => s.slug === slug);');
  
  // Cleanup duplicates from previous replaces
  c = c.replace(/const \{ slug \} = await params;\n\s+const \{ slug \} = await params;/g, 'const { slug } = await params;');
  
  fs.writeFileSync(file, c);
};

['app/portfolio/[slug]/page.tsx', 'app/services/[slug]/page.tsx'].forEach(fixFile);
