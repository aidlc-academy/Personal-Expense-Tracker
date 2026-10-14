import { execSync } from 'child_process';
import path from 'path';

// Use a separate test database
process.env['DATABASE_URL'] = 'file:./prisma/test.db';
process.env['JWT_SECRET'] = 'test-secret-key-that-is-at-least-32-chars-long';
process.env['JWT_EXPIRES_IN'] = '1d';
process.env['PORT'] = '3002';
process.env['NODE_ENV'] = 'test';
process.env['BCRYPT_ROUNDS'] = '4'; // Fast for tests

// Run migrations on the test database
const serverRoot = path.resolve(__dirname, '../..');
execSync('npx prisma migrate deploy', {
  cwd: serverRoot,
  env: { ...process.env },
  stdio: 'pipe',
});
