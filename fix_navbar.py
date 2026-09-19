import re

with open('components/layout/Navbar.tsx', 'r') as f:
    content = f.read()

# find the early return
early_return = '  if (pathname?.startsWith("/admin")) return null\n\n'
if early_return in content:
    content = content.replace(early_return, '')
    
    # insert it after the useEffects
    target = '  return (\n'
    if target in content:
        content = content.replace(target, early_return + target)

with open('components/layout/Navbar.tsx', 'w') as f:
    f.write(content)
