"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, UserIcon, Loader2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/scroll-reveal";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

type FormState = {
  error?: string;
  success?: boolean;
  fieldErrors?: FieldErrors;
} | undefined;

async function signupAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Client-side validation
  const fieldErrors: FieldErrors = {};
  if (!name || name.length < 2) {
    fieldErrors.name = "Name must be at least 2 characters";
  }
  if (!email || !email.includes("@")) {
    fieldErrors.email = "Please enter a valid email";
  }
  if (!password || password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters";
  }
  if (!password || !/[A-Za-z]/.test(password)) {
    fieldErrors.password = fieldErrors.password || "Password must contain at least one letter";
  }
  if (!password || !/[0-9]/.test(password)) {
    fieldErrors.password = fieldErrors.password || "Password must contain at least one number";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Something went wrong" };
    }

    // Auto sign in after signup
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Account created. Please sign in." };
    }

    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/account");
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <FadeIn>
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
            <ShoppingBag className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Join SM CO. and start shopping
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <form action={formAction} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground/90"
              >
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {state?.fieldErrors?.name && (
                <p className="text-xs text-destructive mt-1">{state.fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground/90"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {state?.fieldErrors?.email && (
                <p className="text-xs text-destructive mt-1">{state.fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground/90"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {state?.fieldErrors?.password && (
                <p className="text-xs text-destructive mt-1">{state.fieldErrors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                At least 8 characters with a letter and a number
              </p>
            </div>

            {/* Error */}
            {state?.error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2.5 text-sm text-destructive">
                {state.error}
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full h-10" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
    </FadeIn>
  );
}
