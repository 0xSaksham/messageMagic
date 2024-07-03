import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          //expected that user is recieved
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          // if user is not recieved
          if (!user) {
            throw new Error("No user found with this email address");
          }

          //   if user is not verified
          if (!user.isVerified) {
            throw new Error(" Please Verify your Email address before login");
          }

          // everything correct!!
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          //   Password validation and login
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error(" Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user comes from jwt

      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    }, // making token powerful but increases payload size, reduces db queries, can reduce db query bill
    async session({ session, token }) {
      //nextjs uses session based data transfer that we did using tokens above
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in", //this page will be made by next auth (how cool is that!)
    // can add more here to let next auth handle everything
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // adapters are available for Drizzle ORM and Prisma ORM
};
