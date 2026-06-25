import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // For now, simple mock auth or check DB
        // In a real app, hash and check passwords
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (user) {
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }

        // Mock auto-signup for prototype convenience
        const newUser = {
          id: crypto.randomUUID(),
          name: (credentials.email as string).split("@")[0],
          email: credentials.email as string,
          role: "free" as const,
        };
        await db.insert(users).values(newUser);
        return newUser;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // @ts-ignore
        session.user.role = token.role || "free";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
