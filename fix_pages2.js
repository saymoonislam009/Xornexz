import fs from 'fs';

const pages = [
  'app/blog/[slug]/page.tsx',
  'app/careers/[slug]/page.tsx',
  'app/portfolio/[slug]/page.tsx',
  'app/services/[slug]/page.tsx'
];

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Fix signature
  content = content.replace(/\{ params \}: \{ params: \{ slug: string \} \}/g, '{ params }: { params: Promise<{ slug: string }> }');
  content = content.replace(/\{ params \}: \{ params: Promise<\{ slug: string \}> \| \{ slug: string \} \}/g, '{ params }: { params: Promise<{ slug: string }> }');
  
  // Fix usage
  if (content.includes('"use client"')) {
    if (!content.includes('import { use } from "react"')) {
      content = content.replace('"use client";\n', '"use client";\nimport { use } from "react";\n');
    }
    content = content.replace(/params\.slug/g, 'slug');
    content = content.replace(/(export default function [A-Za-z]+\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{)/g, "$1\n  const { slug } = use(params);");
  } else {
    // server component
    content = content.replace(/params\.slug/g, 'slug');
    content = content.replace(/(export default (?:async )?function [A-Za-z]+\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{)/g, "$1\n  const { slug } = await params;");
    
    // Also metadata function
    content = content.replace(/(export async function generateMetadata\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{)/g, "$1\n  const { slug } = await params;");
  }

  // In portfolio, there's `project.nextProject` and `nextProj.coverColor`
  // Actually nextProject is another project slug?
  content = content.replace(/project\.nextProject/g, 'project.nextProject as string');
  content = content.replace(/nextProj\.coverColor/g, '(nextProj as any).coverGradient');
  
  // Icon className
  content = content.replace(/<Icon className=/g, '<Icon />{/* className=');
  
  fs.writeFileSync(file, content);
});
