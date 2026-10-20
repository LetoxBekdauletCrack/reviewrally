"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@bistrobelle.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate / invoke NextAuth credentials sign-in
    try {
      if (email && password) {
        // Successful login redirect to dashboard
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        setError("Please enter valid credentials.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/80 shadow-2xl bg-card/90 backdrop-blur-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-primary/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Sign In to ReviewRally
          </CardTitle>
          <CardDescription className="text-xs">
            Multi-Tenant Reputation Management & AI Response Engine
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span>Work Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@restaurant.com"
                className="w-full h-9 rounded-lg bg-card border border-border/80 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                  <span>Password</span>
                </label>
                <span className="text-[10px] text-muted-foreground">Demo: password123</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-9 rounded-lg bg-card border border-border/80 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Multi-tenant row-level security isolates restaurant workspaces.</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button type="submit" disabled={loading} className="w-full gap-2 text-xs h-9">
              {loading ? (
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
              <span>Authenticate & Enter Workspace</span>
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              Need a new business workspace?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
