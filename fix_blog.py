with open('app/blog/[slug]/page.tsx', 'r') as f:
    content = f.read()
import re
content = re.sub(
    r"const { slug } = await params;\n  // Handle Next\.js 15 params promise\n  const resolvedParams = await params;\n  const slug = typeof resolvedParams\.slug === 'string' \? resolvedParams\.slug : resolvedParams;",
    "const { slug } = await params;",
    content
)
with open('app/blog/[slug]/page.tsx', 'w') as f:
    f.write(content)
