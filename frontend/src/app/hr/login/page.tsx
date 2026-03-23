"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/lib/config";

export default function HRLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("admin@smarthire.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) throw new Error("Invalid credentials");
      
      const data = await res.json();
      localStorage.setItem("smarthire_token", data.access_token);
      localStorage.setItem("smarthire_user", JSON.stringify(data.user));
      
      toast({ title: "Welcome back", description: "Successfully logged in." });
      router.push("/hr/dashboard");
    } catch (e: any) {
      toast({ title: "Login Failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 clean-card"
      >
        <div className="mb-8 text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 shadow-sm">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">HR Portal</h1>
          <p className="text-slate-500 text-sm">Sign in to manage candidates and settings.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold font-sans">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-white border-slate-200 text-slate-900 shadow-sm h-11 placeholder:text-slate-400 focus-visible:ring-primary/20" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-700 font-semibold font-sans">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-white border-slate-200 text-slate-900 shadow-sm h-11 placeholder:text-slate-400 focus-visible:ring-primary/20" 
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 mt-6 text-sm font-semibold shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
          
          <p className="text-xs text-center text-slate-500 pt-4">Demo accounts: admin@smarthire.com / admin123</p>
        </form>
      </motion.div>
    </div>
  );
}
