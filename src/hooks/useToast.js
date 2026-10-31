"use client";

import { useContext } from "react";
import { ToastContext } from "@/components/toast/ToastProvider";

export default function useToast() {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
