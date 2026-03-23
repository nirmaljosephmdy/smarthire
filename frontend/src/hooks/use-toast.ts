import { useState, useEffect } from 'react';

let memoryState: any[] = [];
let listeners: any[] = [];

export function useToast() {
  const [toasts, setToasts] = useState<any[]>(memoryState);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const toast = ({ title, description, variant }: any) => {
    const id = Math.random().toString();
    const newToast = { id, title, description, variant };
    memoryState = [...memoryState, newToast];
    listeners.forEach((l) => l(memoryState));

    setTimeout(() => {
      memoryState = memoryState.filter((t) => t.id !== id);
      listeners.forEach((l) => l(memoryState));
    }, 4000);
  };

  return { toast, toasts };
}
