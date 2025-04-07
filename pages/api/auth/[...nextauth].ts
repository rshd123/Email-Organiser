import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { Account} from "next-auth";


declare module "next-auth" {
  interface Session{
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            scope:
              "https://www.googleapis.com/auth/gmail.readonly openid email profile",
          },
        },
      }),
    ],
    callbacks:{
      async jwt({
        token,
        account,
      }: {
        token: JWT;
        account?: Account | null;
      }) {
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
    
      async session({
        session,
        token,
      }: {
        session: Session;
        token: JWT;
      }) {
        session.accessToken = token.accessToken;
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
  
  export default NextAuth(authOptions);