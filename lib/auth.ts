import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import pool from "@/lib/db"
import { sendVerificationEmail, sendResetEmail } from "@/lib/email"

const extraOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
  ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim())
  : []

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!, ...extraOrigins],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetEmail(user.email, url)
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, token }) => {
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/verificar-email?token=${token}`
      await sendVerificationEmail(user.email, url)
    },
  },

  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        input: true,
      },
      lastName: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  plugins: [admin()],
})

export type Session = typeof auth.$Infer.Session
