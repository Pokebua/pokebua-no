"use client";

import { useCallback, useEffect, useRef } from "react";
import useToast from "@/hooks/useToast";
import Toast from "@/components/toast/Toast";

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  const viewportRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    function rememberFocus(event) {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        target !== document.body &&
        !viewportRef.current?.contains(target)
      ) {
        previousFocusRef.current = target;
      }
    }

    const activeElement = document.activeElement;

    if (
      activeElement instanceof HTMLElement &&
      activeElement !== document.body &&
      !viewportRef.current?.contains(activeElement)
    ) {
      previousFocusRef.current = activeElement;
    }

    document.addEventListener("focusin", rememberFocus);

    return () => {
      document.removeEventListener("focusin", rememberFocus);
    };
  }, []);

  const handleDismiss = useCallback(
    (id) => {
      const viewport = viewportRef.current;

      const toastElements = Array.from(
        viewport?.querySelectorAll("[data-toast-id]") ?? [],
      );

      const index = toastElements.findIndex(
        (element) => element.dataset.toastId === id,
      );

      const currentToast = toastElements[index];

      if (currentToast?.contains(document.activeElement)) {
        const adjacentToast =
          toastElements[index + 1] ?? toastElements[index - 1];

        const adjacentButton = adjacentToast?.querySelector(
          "[data-toast-dismiss]",
        );

        if (adjacentButton) {
          adjacentButton.focus();
        } else {
          const previousElement = previousFocusRef.current;

          if (
            previousElement?.isConnected &&
            previousElement.getClientRects().length > 0
          ) {
            previousElement.focus({ preventScroll: true });
          }

          // Fall back if the previous control was removed or cannot focus.
          if (currentToast.contains(document.activeElement)) {
            document
              .getElementById("main-content")
              ?.focus({ preventScroll: true });
          }
        }
      }

      dismissToast(id);
    },
    [dismissToast],
  );

  return (
    <section
      ref={viewportRef}
      aria-label="Varsler"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:left-auto sm:w-104"
    >
      <ul className="pointer-events-auto max-h-[70dvh] space-y-3 overflow-y-auto p-1">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={handleDismiss} />
        ))}
      </ul>
    </section>
  );
}
