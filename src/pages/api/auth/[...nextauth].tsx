import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: "Iv1.d3b4d36de7dc29f9",
      clientSecret: "531c8ca94fbde937bdd44c0691eca9567e38c4cf",
    }),
    Providers.Auth0({
      clientId: "sQ6OnNSi0dTLDBSMHUUHedxrbWtxjzwk",
      clientSecret:
        "Igk98BT8t-B7JDRwAffPF-rrIrsDIQgSoSymbEooE5R7w7DwrEOcK3YEHSZyCmZJ",
      domain: "cursodsousa.us.auth0.com",
    }),
  ],
});
