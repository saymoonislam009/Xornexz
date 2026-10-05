const fs = require('fs');
let c = fs.readFileSync('app/portfolio/[slug]/page.tsx', 'utf8');

const importStr = "import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';\n";
if (!c.includes("import { buildMetadata")) {
  c = importStr + c;
} else if (!c.includes("buildBreadcrumbSchema")) {
  c = c.replace(/import \{ buildMetadata \} from '@\/lib\/seo';/, "import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';");
}

const newGenMeta = `export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found | Xornexz' };
  return buildMetadata({
    title: \`\${project.title} | Xornexz Portfolio\`,
    description:
      project.tagline ||
      project.description ||
      \`See how Xornexz built \${project.title} — a case study.\`,
    path: \`/portfolio/\${slug}\`,
    keywords: [
      project.title.toLowerCase(),
      project.category?.toLowerCase() || 'software',
      'case study',
      'xornexz portfolio',
    ],
  });
}`;

c = c.replace(/export async function generateMetadata.*?\}\n\n/s, newGenMeta + '\n\n');
fs.writeFileSync('app/portfolio/[slug]/page.tsx', c);
