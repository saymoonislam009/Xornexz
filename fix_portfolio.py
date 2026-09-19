import re
with open('app/portfolio/[slug]/page.tsx', 'r') as f:
    content = f.read()

# Fix generateMetadata
content = content.replace(
    "export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Metadata {\n  const project = projects.find((p) => p.slug === slug);",
    "export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {\n  const { slug } = await params;\n  const project = projects.find((p) => p.slug === slug);"
)
# Ensure CaseStudyPage is async
content = content.replace(
    "export default function CaseStudyPage(",
    "export default async function CaseStudyPage("
)
# Fix slug in CaseStudyPage
content = content.replace(
    "  const project = projects.find((p) => p.slug === (await params).slug);",
    "  const project = projects.find((p) => p.slug === slug);"
)

with open('app/portfolio/[slug]/page.tsx', 'w') as f:
    f.write(content)

with open('app/services/[slug]/page.tsx', 'r') as f:
    content2 = f.read()

content2 = content2.replace(
    "export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Metadata {\n  const service = services.find((s) => s.slug === (await params).slug);",
    "export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {\n  const { slug } = await params;\n  const service = services.find((s) => s.slug === slug);"
)
content2 = content2.replace(
    "export default function ServiceDetailPage(",
    "export default async function ServiceDetailPage("
)
content2 = content2.replace(
    "  const service = services.find((s) => s.slug === (await params).slug);",
    "  const service = services.find((s) => s.slug === slug);"
)
with open('app/services/[slug]/page.tsx', 'w') as f:
    f.write(content2)

