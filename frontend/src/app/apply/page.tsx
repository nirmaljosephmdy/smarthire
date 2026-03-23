"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, CheckCircle2, User, Mail, Phone, Briefcase } from 'lucide-react';
import { getApiUrl } from '@/lib/config';

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email format."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  role: z.string().min(2, "Please select a role."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplyPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ref: string} | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormValues) => {
    if (!file) {
      toast({ title: 'Resume required', description: 'Please upload a PDF or DOCX file.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('role', data.role);
    formData.append('resume', file);

    try {
      const res = await fetch(`${getApiUrl()}/application/apply`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to submit application');
      
      const result = await res.json();
      setSuccessData({ ref: result.referenceNumber });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 -z-10 text-slate-900" />

      <AnimatePresence mode="wait">
        {!successData ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            className="w-full max-w-xl clean-card p-8 sm:p-12"
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Join Our Team</h1>
              <p className="text-slate-500">Apply below and let our AI match you to the perfect role.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-slate-700 font-semibold"><User className="w-4 h-4"/> Full Name</Label>
                <Input id="fullName" placeholder="Jane Doe" className="bg-white border-slate-200 h-12 text-slate-900 shadow-sm focus-visible:ring-primary/20" {...register('fullName')} />
                {errors.fullName && <p className="text-destructive text-sm font-medium">{errors.fullName.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 font-semibold"><Mail className="w-4 h-4"/> Email</Label>
                  <Input id="email" type="email" placeholder="jane@example.com" className="bg-white border-slate-200 h-12 text-slate-900 shadow-sm focus-visible:ring-primary/20" {...register('email')} />
                  {errors.email && <p className="text-destructive text-sm font-medium">{errors.email.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 font-semibold"><Phone className="w-4 h-4"/> Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-white border-slate-200 h-12 text-slate-900 shadow-sm focus-visible:ring-primary/20" {...register('phone')} />
                  {errors.phone && <p className="text-destructive text-sm font-medium">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold"><Briefcase className="w-4 h-4"/> Role</Label>
                <select 
                  className="bg-white border-slate-200 h-12 w-full rounded-md px-3 border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-slate-900 shadow-sm"
                  {...register('role')}
                >
                  <option value="" disabled hidden className="text-slate-500">Select a role...</option>
                  <option value="Frontend Engineer" className="text-black">Frontend Engineer</option>
                  <option value="Backend Engineer" className="text-black">Backend Engineer</option>
                  <option value="Full Stack Developer" className="text-black">Full Stack Developer</option>
                  <option value="Product Manager" className="text-black">Product Manager</option>
                  <option value="Data Scientist" className="text-black">Data Scientist</option>
                </select>
                {errors.role && <p className="text-destructive text-sm font-medium">{errors.role.message}</p>}
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-slate-700 font-semibold">Resume (PDF/DOCX)</Label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer bg-white
                    ${file ? 'border-primary bg-blue-50/50' : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50 shadow-sm'}`}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  <input
                    id="resume-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                    }}
                  />
                  <UploadCloud className={`w-10 h-10 mb-4 ${file ? 'text-primary' : 'text-slate-400'}`} />
                  <p className="text-sm font-medium text-slate-700">{file ? file.name : 'Click to upload your resume'}</p>
                  <p className="text-xs text-slate-500 mt-2">Max file size: 5MB</p>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-lg rounded-xl mt-8 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] font-semibold" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md clean-card p-10 text-center space-y-6"
          >
            <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Application Received!</h2>
            <p className="text-slate-600 font-medium">
              Thank you for applying. Our AI is currently reviewing your profile.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
              <p className="text-sm text-slate-500 font-medium">Your Reference Number:</p>
              <p className="text-2xl font-mono font-bold text-primary tracking-wider mt-1">{successData.ref}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
