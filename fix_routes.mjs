import fs from 'fs';
import path from 'path';

const projectRoot = '/Users/saymoonshafin/Downloads/Xornexz';

function addAuthCheck(filePath, roles) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath} - not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("requireRole(")) {
    console.log(`Skipping ${filePath} - already has requireRole`);
    return;
  }

  // Add import
  const importStatement = `import { requireRole, isAuthError } from '@/lib/requireRole'\n`;
  if (!content.includes(`import { requireRole, isAuthError }`)) {
    content = importStatement + content;
  }

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  for (const method of methods) {
    const regex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`, 'g');
    if (regex.test(content)) {
      const role = roles[method] || 'ADMIN';
      const authCheck = `\n  const auth = await requireRole('${role}')\n  if (isAuthError(auth)) return auth\n`;
      content = content.replace(new RegExp(`(export\\s+async\\s+function\\s+${method}\\s*\\([^\\)]*\\)\\s*\\{)`, 'g'), `$1${authCheck}`);
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

const config = [
  {
    file: 'app/api/admin/blog/route.ts',
    roles: { GET: 'VIEWER', POST: 'EDITOR', PUT: 'EDITOR', PATCH: 'EDITOR', DELETE: 'EDITOR' }
  },
  {
    file: 'app/api/admin/blog/[id]/route.ts',
    roles: { GET: 'VIEWER', POST: 'EDITOR', PUT: 'EDITOR', PATCH: 'EDITOR', DELETE: 'EDITOR' }
  },
  {
    file: 'app/api/admin/dashboard/stats/route.ts',
    roles: { GET: 'VIEWER' }
  },
  {
    file: 'app/api/admin/leads/route.ts',
    roles: { GET: 'VIEWER', POST: 'EDITOR', PUT: 'EDITOR', PATCH: 'EDITOR', DELETE: 'EDITOR' }
  },
  {
    file: 'app/api/admin/leads/[id]/route.ts',
    roles: { GET: 'VIEWER', POST: 'EDITOR', PUT: 'EDITOR', PATCH: 'EDITOR', DELETE: 'EDITOR' }
  },
  {
    file: 'app/api/admin/media/route.ts',
    roles: { GET: 'VIEWER', POST: 'EDITOR', PUT: 'EDITOR', PATCH: 'EDITOR', DELETE: 'EDITOR' }
  },
  {
    file: 'app/api/admin/projects/route.ts',
    roles: { GET: 'VIEWER', POST: 'EDITOR', PUT: 'EDITOR', PATCH: 'EDITOR', DELETE: 'EDITOR' }
  },
  {
    file: 'app/api/admin/projects/[id]/route.ts',
    roles: { GET: 'VIEWER', POST: 'EDITOR', PUT: 'EDITOR', PATCH: 'EDITOR', DELETE: 'EDITOR' }
  },
  {
    file: 'app/api/admin/settings/route.ts',
    roles: { GET: 'VIEWER', POST: 'ADMIN', PUT: 'ADMIN', PATCH: 'ADMIN', DELETE: 'ADMIN' }
  },
  {
    file: 'app/api/admin/users/route.ts',
    roles: { GET: 'SUPER_ADMIN', POST: 'SUPER_ADMIN', PUT: 'SUPER_ADMIN', PATCH: 'SUPER_ADMIN', DELETE: 'SUPER_ADMIN' }
  }
];

config.forEach(c => addAuthCheck(path.join(projectRoot, c.file), c.roles));

