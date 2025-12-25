import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'discord') {
        try {
          // Check if user is in the guild
          const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });
          
          if (!guildsResponse.ok) {
            return false;
          }
          
          const guilds = await guildsResponse.json();
          const guildId = process.env.DISCORD_GUILD_ID;
          
          if (guildId && !guilds.some((g: { id: string }) => g.id === guildId)) {
            return '/auth/not-member';
          }
          
          // Create or update user in database
          await prisma.user.upsert({
            where: { discordId: account.providerAccountId },
            update: {
              username: user.name || '',
              email: user.email,
              avatar: user.image,
            },
            create: {
              discordId: account.providerAccountId,
              username: user.name || '',
              email: user.email,
              avatar: user.image,
            },
          });
          
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.discordId = account.providerAccountId;
        token.accessToken = account.access_token;
        
        // Get user role from database
        const dbUser = await prisma.user.findUnique({
          where: { discordId: account.providerAccountId },
          select: { id: true, role: true },
        });
        
        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.discordId = token.discordId as string;
        session.user.userId = token.userId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};
