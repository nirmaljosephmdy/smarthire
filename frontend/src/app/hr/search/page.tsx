"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Filter, ChevronRight, ChevronLeft, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getApiUrl } from "@/lib/config";

const PAGE_SIZE = 10;

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state
  const [role, setRole] = useState("");
  const [minExp, setMinExp] = useState("");
  const [minFit, setMinFit] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, currentPage]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    setHasSearched(true);
    setCurrentPage(1); // reset to page 1 on new search

    try {
      const filters: any = {};
      if (role) filters.role = role;
      if (minExp) filters.minExperience = parseInt(minExp);
      if (minFit) filters.minFitScore = parseInt(minFit);

      const res = await fetch(`${getApiUrl()}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("smarthire_token")}`
        },
        body: JSON.stringify({ query, filters })
      });

      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startItem = results.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, results.length);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto pt-10 pb-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          <Sparkles className="w-4 h-4" />
          Powered by Vector Embeddings
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Semantic Candidate Search</h1>
        <p className="text-slate-500">Describe your ideal candidate in natural language. Our AI will rank profiles based on semantic relevance, not just keywords.</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative z-10">
        <div className="relative flex items-center shadow-sm rounded-2xl bg-white border border-slate-200 p-2 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="w-6 h-6 text-slate-400 ml-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'Senior React developer with 5+ years experience'"
            className="border-0 bg-transparent h-14 text-lg focus-visible:ring-0 shadow-none px-4 text-slate-900"
          />
          <Button type="button" variant="ghost" className="h-10 w-10 p-0 mr-2 text-slate-500 hover:text-slate-900 rounded-full bg-slate-50 hover:bg-slate-100" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4" />
          </Button>
          <Button type="submit" disabled={loading} className="h-12 px-6 rounded-xl shrink-0 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]">
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-4 p-4 clean-card grid grid-cols-3 gap-4 overflow-hidden"
            >
              <div className="space-y-1 block">
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold ml-1">Role Exact Match</label>
                <Input value={role} onChange={e => setRole(e.target.value)} placeholder="Frontend Engineer" className="bg-slate-50 border-slate-200 text-slate-900" />
              </div>
              <div className="space-y-1 block">
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold ml-1">Min Experience (Yrs)</label>
                <Input type="number" value={minExp} onChange={e => setMinExp(e.target.value)} placeholder="3" className="bg-slate-50 border-slate-200 text-slate-900" />
              </div>
              <div className="space-y-1 block">
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold ml-1">Min Fit Score</label>
                <Input type="number" value={minFit} onChange={e => setMinFit(e.target.value)} placeholder="80" className="bg-slate-50 border-slate-200 text-slate-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {hasSearched && (
        <div className="pt-8 space-y-4">
          {/* Results header */}
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h3 className="text-lg font-medium text-slate-900">Search Results</h3>
            <span className="text-sm text-slate-500">
              {results.length === 0
                ? "0 Candidates found"
                : `Showing ${startItem}–${endItem} of ${results.length} candidates`}
            </span>
          </div>

          {results.length === 0 && !loading && (
            <div className="text-center py-20 text-slate-500">
              <User className="w-12 h-12 mx-auto mb-4 opacity-20 text-slate-400" />
              <p>No candidates match your semantic query.</p>
            </div>
          )}

          {/* Candidate cards */}
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="wait">
              {paginatedResults.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/hr/candidates/${c.id}`}>
                    <div className="clean-card p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold text-lg ring-1 ring-primary/20">
                          {c.fitScore}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors">{c.fullName}</h4>
                          <p className="text-sm text-slate-500">{c.role} • {c.experienceYears} Years Experience</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {c.skills.slice(0, 5).map((s: string) => (
                              <Badge key={s} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">{s}</Badge>
                            ))}
                            {c.skills.length > 5 && (
                              <Badge variant="outline" className="bg-slate-50 text-slate-500">+{c.skills.length - 5}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-slate-700 border-slate-200 bg-white hover:bg-slate-50"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              {/* Page number pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 select-none">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => goToPage(item as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                          currentPage === item
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

              <Button
                variant="outline"
                className="flex items-center gap-2 text-slate-700 border-slate-200 bg-white hover:bg-slate-50"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
