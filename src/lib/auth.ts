import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar, checkout, portal } from "@polar-sh/better-auth"; 

import prisma from "./prisma";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({ 
      client: polarClient, 
      createCustomerOnSignUp: true, 
      use: [ 
        checkout({ 
          products: [ 
            { 
              productId: "a2397660-6fe3-4eb3-ad62-e61f1c09517b",
              slug: "Nodebase-Pro",
            },
          ], 
          successUrl: "/success?checkout_id={CHECKOUT_ID}", 
          authenticatedUsersOnly: true,
        }), 
        portal(), 
      ], 
  }) 
  ],
});