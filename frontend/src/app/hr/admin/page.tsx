"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, ShieldAlert, Zap, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AuditLog {
  id: string;
  action: string;
  entityType: string | null;
  details: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("smarthire_token");
      const res = await fetch(`${getApiUrl()}/audit/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to fetch audit logs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const actionColor: Record<string, string> = {
    LOGIN: "text-emerald-600",
    STATUS_UPDATE: "text-blue-600",
    NOTE_ADDED: "text-violet-600",
    SEMANTIC_SEARCH: "text-amber-600",
    APPLICATION_RECEIVED: "text-sky-600",
    AI_PROCESSING_COMPLETE: "text-pink-600",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Settings</h1>
        <p className="text-slate-500 mt-1">Manage platform configuration and view system audit logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Database className="w-5 h-5 text-primary" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Database (SQLite)</span>
              <Badge variant="default" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 shadow-none">Operational</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Vector Embeddings (In-DB)</span>
              <Badge variant="default" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 shadow-none">Operational</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Job Queue (Synchronous)</span>
              <Badge variant="default" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 shadow-none">Operational</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 font-medium">AI Microservice (Python)</span>
              <Badge variant="default" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 shadow-none">Operational</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <ShieldAlert className="w-5 h-5 text-primary" /> Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">Role-based access control and JWT settings are managed via environment variables.</p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <Zap className="text-amber-500 w-5 h-5" />
              <span className="text-sm font-medium text-amber-900">Audit logging is globally enforced</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 mt-8">
          <h2 className="text-xl font-bold text-slate-900">Recent Audit Logs</h2>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
        <div className="clean-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Action</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Entity</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Details</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Loading logs...</td></tr>
              )}
              {!loading && logs.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No audit logs yet.</td></tr>
              )}
              {!loading && logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className={`px-6 py-4 font-mono font-semibold ${actionColor[log.action] ?? "text-primary"}`}>{log.action}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{log.entityType || "SYSTEM"}</td>
                  <td className="px-6 py-4 text-slate-600">{log.details || "—"}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
