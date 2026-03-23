"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Database, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-[100px] -z-10 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/50 rounded-full blur-[100px] -z-10 mix-blend-multiply pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl px-6 text-center z-10 space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium mb-4 text-primary mx-auto shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>The next generation AI recruitment platform</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 pb-2 drop-shadow-sm">
          Hire Smarter with AI
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          SmartHire transforms your recruitment process. Upload a resume and let our semantic models parse, extract, and rank candidates instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/apply">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2 group">
              Apply Now 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/hr/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all">
              HR Portal
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Feature grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-6 z-10"
      >
        {[
          { icon: Sparkles, title: "Semantic Parsing", desc: "No more keyword matching. Our AI understands context and relevance." },
          { icon: Database, title: "Vector Search", desc: "Query millions of profiles in milliseconds using natural language." },
          { icon: ShieldCheck, title: "Bias-Free", desc: "Standardized scoring ensures fair and consistent candidate evaluation." }
        ].map((feat, i) => (
          <div key={i} className="clean-card p-8 rounded-3xl flex flex-col items-start text-left space-y-4 hover:-translate-y-1 transition-transform border border-slate-200 bg-white">
            <div className="p-3 bg-blue-50 text-primary rounded-2xl shadow-inner border border-blue-100">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
