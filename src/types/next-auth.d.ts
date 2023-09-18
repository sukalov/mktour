import NextAuth from "next-auth"

declare module "next-auth" {

  interface Session {
    user: {
        sub: ReactNode
        id: string,
        username: string,
    }
    accessToken: string
  }
}