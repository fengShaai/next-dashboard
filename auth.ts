import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import type { User } from '@/app/lib/definitions';

const prisma = new PrismaClient();

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return {
        ...user,
        name: user.name ?? '', // Ensure `name` is always a string
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) {
          return {
            id: user.id.toString(), // Convert `id` to string
            name: user.name,
            email: user.email
          };
        }
        return null;
      },
    }),
  ],
});
