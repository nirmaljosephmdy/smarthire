"use client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function Toaster() {
  const { toasts } = useToast();
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t: any) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            key={t.id} 
            className={`p-4 rounded-xl shadow-2xl border min-w-[300px] pointer-events-auto backdrop-blur-md ${
              t.variant === 'destructive' 
                ? 'bg-destructive/90 text-white border-red-500/50' 
                : 'bg-card/90 text-card-foreground border-white/10'
            }`}
          >
            {t.title && <h4 className="font-semibold">{t.title}</h4>}
            {t.description && <p className="text-sm opacity-90 mt-1">{t.description}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
