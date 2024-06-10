import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: 'Ov23liabPMW12pnbfWjZ',
      clientSecret: '2414110e747ab1cb0f32e3bc3d0a800bd24b5a20',
    }),
  ],
  secret : 'jwtst11!!'
};
export default NextAuth(authOptions);  