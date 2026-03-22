"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 ${colors[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between animate-slideUp z-50`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icons[type]}</span>
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="text-white/80 hover:text-white">
        ✕
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: ToastProps["type"] = "info") => {
    setToast({ message, type, onClose: () => setToast(null) });
    setTimeout(() => setToast(null), 5000);
  };

  return { toast, showToast };
}

// Confirmation dialog
export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scaleIn">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} variant="secondary">
            {cancelText}
          </Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
}: {
  icon: string;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  );
}
