import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: "Iv1.d3b4d36de7dc29f9",
      clientSecret: "531c8ca94fbde937bdd44c0691eca9567e38c4cf",
    }),
    Providers.Auth0({
      clientId: "c2YWbuWKVe2ON2W1RTulpdHZBbxqoFa5",
      clientSecret:
        "xQD-IQBTKrq-b0n6R2wQQSLmqlpb3NrfmnlfxCaxBK2EIkVybUi5-OiKoxYvhrKd",
      domain: "dev-rhzfcgdntvzo3nzx.us.auth0.com",
    }),
  ],
});
