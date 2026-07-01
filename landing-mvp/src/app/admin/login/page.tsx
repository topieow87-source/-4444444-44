"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label, IconInput } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { Mail, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка входа");

      toast.success("Добро пожаловать!");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-noise-grid px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <div className="bg-white rounded-3xl shadow-lifted border border-slate-100 p-8">
          <h1 className="font-display text-xl font-bold text-slate-900 text-center">
            Вход в админ-панель
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 text-center">
            Управление каталогом, заявками и настройками
          </p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <IconInput
                id="email"
                type="email"
                icon={<Mail size={16} />}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <IconInput
                id="password"
                type="password"
                icon={<Lock size={16} />}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
