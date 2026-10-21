import { execSync } from 'node:child_process';

process.env.DATABASE_URL ||= 'file:./dev.db';

try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });
} catch {
  process.exit(1);
}

await import('./server.js');