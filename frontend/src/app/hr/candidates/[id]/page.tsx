"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Brain, Briefcase, GraduationCap, Languages, Award, Send } from "lucide-react";
import { getApiUrl } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function CandidateProfile() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCandidate = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/candidate/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("smarthire_token")}` }
      });
      if (res.ok) setCandidate(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await fetch(`${getApiUrl()}/candidate/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("smarthire_token")}`
        },
        body: JSON.stringify({ status })
      });
      toast({ title: "Status Updated", description: `Candidate moved to ${status}` });
      setCandidate({ ...candidate, status });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setIsUpdating(true);
    try {
      await fetch(`${getApiUrl()}/candidate/${id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("smarthire_token")}`
        },
        body: JSON.stringify({ content: note })
      });
      setNote("");
      await fetchCandidate();
      toast({ title: "Note Added" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-slate-500">Loading Candidate Profile...</div>;
  if (!candidate) return <div className="p-10 text-center text-red-400">Candidate not found</div>;

  const parseArray = (field: any) => {
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try { return JSON.parse(field) || []; } catch(e) { return []; }
    }
    return [];
  };

  const skills = parseArray(candidate.skills);
  const jobHistory = parseArray(candidate.jobHistory);
  const education = parseArray(candidate.education);
  const certifications = parseArray(candidate.certifications);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-4 group font-medium">
         <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Search
      </button>

      {/* Header */}
      <div className="clean-card p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        
        <div className="flex items-center gap-6 z-10">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 flex flex-col items-center justify-center border border-primary/20">
            <span className="text-3xl font-bold text-primary">{candidate.fitScore}</span>
            <span className="text-[10px] text-primary/70 uppercase font-bold tracking-wider">Fit Score</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{candidate.fullName}</h1>
            <div className="flex flex-wrap gap-2 items-center text-slate-500 text-sm font-medium">
              <span>{candidate.role}</span>
              <span>•</span>
              <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">{candidate.email}</a>
              <span>•</span>
              <span>{candidate.phone}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline" className="bg-slate-50 border-slate-200 px-3 py-1 text-sm text-slate-600">{candidate.experienceYears} Yrs Exp</Badge>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 pointer-events-none capitalize hover:bg-blue-50 shadow-none">{candidate.status}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 z-10 w-full md:w-auto">
          <select 
            value={candidate.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="w-full md:w-[200px] h-11 bg-white border border-slate-200 rounded-md font-medium text-slate-900 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none shadow-sm"
          >
            <option value="pending" className="text-black">Pending</option>
            <option value="processed" className="text-black">Processed</option>
            <option value="under review" className="text-black">Under Review</option>
            <option value="shortlisted" className="text-black">Shortlisted</option>
            <option value="rejected" className="text-black">Rejected</option>
            <option value="hired" className="text-black">Hired</option>
          </select>
          
          <a href={`http://localhost:3001/${candidate.resumeUrl}`} target="_blank" rel="noreferrer" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
             Download Source Resume
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="clean-card overflow-hidden">
             <div className="bg-slate-50 p-6 border-b border-slate-200">
               <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2"><Brain className="w-5 h-5 text-primary"/> AI Executive Summary</h3>
               <p className="text-slate-700 leading-relaxed font-medium">{candidate.summary}</p>
             </div>
             <CardContent className="p-6">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Extracted Skills</h3>
               <div className="flex flex-wrap gap-2">
                 {skills.map((s: string) => (
                   <Badge key={s} variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-3 py-1 text-sm font-semibold shadow-none border border-slate-200">{s}</Badge>
                 ))}
               </div>
             </CardContent>
          </Card>

          <Card className="clean-card">
             <CardHeader className="pb-4">
               <CardTitle className="flex items-center gap-2 text-slate-900"><Briefcase className="w-5 h-5 text-slate-400"/> Experience Timeline ({candidate.experienceYears} Years)</CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="space-y-4">
                 {jobHistory.length > 0 ? jobHistory.map((job: string, i: number) => (
                   <li key={i} className="pl-4 border-l-2 border-primary/30 py-1 relative">
                      <div className="absolute w-2 h-2 rounded-full bg-primary -left-[5px] top-3" />
                      <p className="text-slate-700 font-semibold">{job}</p>
                   </li>
                 )) : <p className="text-slate-500 italic">No explicit job history extracted.</p>}
               </ul>
             </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="clean-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-slate-900"><GraduationCap className="w-4 h-4 text-slate-400" /> Education</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 font-medium">
                <ul className="list-disc pl-4 space-y-1">
                  {education.length ? education.map((e:string, i:number) => <li key={i}>{e}</li>) : <li>Not specified</li>}
                </ul>
              </CardContent>
            </Card>

            <Card className="clean-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-slate-900"><Award className="w-4 h-4 text-slate-400" /> Certifications</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 font-medium">
                <ul className="list-disc pl-4 space-y-1">
                 {certifications.length ? certifications.map((e:string, i:number) => <li key={i}>{e}</li>) : <li>Not specified</li>}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Private Notes */}
        <div className="space-y-6">
          <Card className="clean-card h-full flex flex-col">
             <CardHeader className="border-b border-slate-200 bg-slate-50">
               <CardTitle className="text-base text-slate-900">HR Private Notes</CardTitle>
             </CardHeader>
             <CardContent className="p-0 flex-1 flex flex-col">
               <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                 {candidate.notes?.length > 0 ? candidate.notes.map((n: any) => (
                   <div key={n.id} className="bg-white border border-slate-200 shadow-sm rounded-xl p-3">
                     <p className="text-sm text-slate-700 font-medium">{n.content}</p>
                     <p className="text-xs text-slate-500 mt-2 text-right">{new Date(n.createdAt).toLocaleString()}</p>
                   </div>
                 )) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10 opacity-70">
                     <p className="text-sm font-medium">No notes added yet.</p>
                   </div>
                 )}
               </div>
               <div className="p-4 border-t border-slate-200 bg-slate-50 mt-auto">
                 <div className="relative">
                   <textarea
                     className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-3 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none"
                     placeholder="Type a new note..."
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                   />
                   <Button 
                     size="icon" 
                     className="absolute bottom-2 right-2 h-8 w-8 rounded-lg shadow-md"
                     onClick={addNote}
                     disabled={isUpdating || !note.trim()}
                   >
                     <Send className="w-4 h-4" />
                   </Button>
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
