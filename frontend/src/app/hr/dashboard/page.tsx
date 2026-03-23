"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FileUser, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiUrl } from "@/lib/config";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/admin/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("smarthire_token")}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Applications", value: stats?.totalApplications, icon: Users, color: "text-blue-500" },
    { title: "Processed by AI", value: stats?.processed, icon: FileUser, color: "text-purple-500" },
    { title: "Pending Queue", value: stats?.pending, icon: Clock, color: "text-amber-500" },
    { title: "Total Hired", value: stats?.hires, icon: CheckCircle, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h1>
          <p className="text-slate-500 mt-1">Metrics and pipeline health at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="clean-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 ${card.color}`}>
                  <card.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {loading ? <span className="text-slate-300 animate-pulse">000</span> : (card.value || 0)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
