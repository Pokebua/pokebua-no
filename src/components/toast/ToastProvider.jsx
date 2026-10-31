"use client";

import { createContext, useCallback, useId, useRef, useState } from "react";

export const ToastContext = createContext(null);

const MAX_VISIBLE_TOASTS = 3;
const TOAST_TYPES = ["success", "info", "error"];

export default function ToastProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const providerId = useId();
  const nextIdRef = useRef(0);

  const showToast = useCallback(
    ({ type = "info", message }) => {
      if (typeof message !== "string" || !message.trim()) {
        throw new Error("A toast must contain a message.");
      }

      if (!TOAST_TYPES.includes(type)) {
        throw new Error(`Unsupported toast type: ${type}`);
      }

      nextIdRef.current += 1;

      const id = `${providerId}-toast-${nextIdRef.current}`;

      setNotifications((current) => [
        ...current,
        {
          id,
          type,
          message: message.trim(),
        },
      ]);

      return id;
    },
    [providerId],
  );

  const dismissToast = useCallback((id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }, []);

  const visibleToasts = notifications.slice(0, MAX_VISIBLE_TOASTS);

  return (
    <ToastContext.Provider
      value={{
        toasts: visibleToasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}
