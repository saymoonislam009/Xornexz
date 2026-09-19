import fs from 'fs';

const pages = [
  'app/careers/[slug]/page.tsx',
  'app/portfolio/[slug]/page.tsx',
  'app/services/[slug]/page.tsx'
];

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('"use client"')) {
    if (!content.includes("import { use } from 'react'")) {
      content = content.replace('"use client";\n', '"use client";\nimport { use } from "react";\n');
    }
    content = content.replace(/params\.slug/g, 'slug');
    content = content.replace(/function [A-Za-z]+\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{/, (match) => {
      return match + '\n  const { slug } = use(params);';
    });
  } else {
    // server component
    content = content.replace(/params\.slug/g, '(await params).slug');
  }
  fs.writeFileSync(file, content);
});
