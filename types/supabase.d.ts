import type { User as AuthUser } from "@supabase/auth-js";

declare module "@supabase/supabase-js" {
  export type EmailOtpType =
    | "signup"
    | "invite"
    | "magiclink"
    | "recovery"
    | "email_change"
    | "email";

  export type User = AuthUser;

  interface SupabaseAuthClient {
    getClaims(): Promise<{
      data: {
        claims: Record<string, unknown> & {
          sub?: string;
          email?: string;
          user_metadata?: Record<string, unknown>;
        };
      } | null;
      error: Error | null;
    }>;
  }
}

declare module "@supabase/auth-js" {
  interface GoTrueClient {
    getClaims(): Promise<{
      data: {
        claims: Record<string, unknown> & {
          sub?: string;
          email?: string;
          user_metadata?: Record<string, unknown>;
        };
      } | null;
      error: Error | null;
    }>;
  }
}
