"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Une erreur est survenue.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-[4px] border border-[--color-border] bg-[--card] p-8">
      <h1 className="font-heading text-2xl italic text-[--color-text]">Espace admin</h1>
      <p className="mt-1 text-sm text-[--color-text]/70">Aura Spa — réservations</p>

      <div className="mt-6 grid gap-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
      </div>

      {error && <p className="mt-3 text-sm text-[--color-bordeaux]">{error}</p>}

      <Button
        type="submit"
        disabled={loading || password.length === 0}
        className="mt-6 w-full gap-1.5 rounded-[2px] bg-[--color-accent] text-[--color-cream] hover:bg-[color-mix(in_oklch,var(--color-accent),black_10%)]"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Se connecter"}
      </Button>
    </form>
  );
}
