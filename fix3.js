import fs from 'fs';

const fixFile = (file) => {
  let c = fs.readFileSync(file, 'utf8');
  // cleanup duplicate slugs
  c = c.replace(/const \{ slug \} = await params;\n  const slug = .*\n/g, 'const { slug } = await params;\n');
  c = c.replace(/const \{ slug \} = use\(params\);\n  const \{ slug \} = use\(params\);/g, 'const { slug } = use(params);');
  
  // make default export async if not use client
  if (!c.includes('"use client"')) {
    c = c.replace(/export default function/g, 'export default async function');
  }
  
  // fix (await params).slug back to slug
  c = c.replace(/\(await params\)\.slug/g, 'slug');
  
  // fix nextProj
  c = c.replace(/project\.nextProject as string/g, '(project as any).nextProject');
  
  fs.writeFileSync(file, c);
};

['app/blog/[slug]/page.tsx', 'app/careers/[slug]/page.tsx', 'app/portfolio/[slug]/page.tsx', 'app/services/[slug]/page.tsx'].forEach(fixFile);
