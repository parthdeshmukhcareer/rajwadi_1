import { z } from 'zod';
import { db } from '../src/db/index.js';
import { users } from '../src/db/schema/index.js';
import { PasswordUtil } from '../src/utils/password.util.js';

const argsSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

async function main() {
  console.log('--- Rajwadi Admin Creation ---');
  
  const email = process.argv[2];
  const password = process.argv[3];
  const firstName = process.argv[4] || 'Admin';
  const lastName = process.argv[5] || 'User';

  if (!email || !password) {
    console.error('Usage: npm run admin:create <email> <password> [firstName] [lastName]');
    process.exit(1);
  }

  const result = argsSchema.safeParse({ email, password, firstName, lastName });
  if (!result.success) {
    console.error('Invalid arguments:', result.error.issues);
    process.exit(1);
  }

  const data = result.data;

  try {
    const passwordHash = await PasswordUtil.hash(data.password);
    
    await db.insert(users).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      passwordHash,
      role: 'ADMIN',
    });

    console.log(`Successfully created ADMIN user: ${data.email}`);
  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    process.exit(0);
  }
}

main();
