"use client";

import { useEffect, useRef, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoClose,
  IoInformationCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";

const toastTypes = {
  success: {
    label: "Bekreftelse",
    Icon: IoCheckmarkCircleOutline,
  },
  info: {
    label: "Informasjon",
    Icon: IoInformationCircleOutline,
  },
  error: {
    label: "Feil",
    Icon: IoWarningOutline,
  },
};

const AUTO_DISMISS_MS = 5000;

export default function Toast({ toast, onDismiss }) {
  const toastRef = useRef(null);
  const [announcement, setAnnouncement] = useState("");

  const { id, type, message } = toast;
  const { label, Icon } = toastTypes[type];

  // Populate the live region after it has mounted.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncement(`${label}: ${message}`);
    }, 100);

    return () => window.clearTimeout(timer);
  }, [label, message]);

  useEffect(() => {
    if (type === "error") return;

    const element = toastRef.current;
    if (!element) return;

    let remaining = AUTO_DISMISS_MS;
    let startedAt = 0;
    let timer = null;

    let hovered = element.matches(":hover");
    let focused = element.contains(document.activeElement);

    function pauseTimer() {
      if (timer === null) return;

      window.clearTimeout(timer);
      timer = null;

      remaining = Math.max(0, remaining - (performance.now() - startedAt));
    }

    function resumeTimer() {
      if (timer !== null || hovered || focused || document.hidden) {
        return;
      }

      startedAt = performance.now();

      timer = window.setTimeout(() => {
        timer = null;
        onDismiss(id);
      }, remaining);
    }

    function handlePointerEnter(event) {
      if (event.pointerType === "touch") return;

      hovered = true;
      pauseTimer();
    }

    function handlePointerLeave(event) {
      if (event.pointerType === "touch") return;

      hovered = false;
      resumeTimer();
    }

    function handleFocusIn() {
      focused = true;
      pauseTimer();
    }

    function handleFocusOut(event) {
      if (element.contains(event.relatedTarget)) return;

      focused = false;
      resumeTimer();
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    }

    element.addEventListener("pointerenter", handlePointerEnter);
    element.addEventListener("pointerleave", handlePointerLeave);
    element.addEventListener("focusin", handleFocusIn);
    element.addEventListener("focusout", handleFocusOut);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resumeTimer();

    return () => {
      pauseTimer();

      element.removeEventListener("pointerenter", handlePointerEnter);
      element.removeEventListener("pointerleave", handlePointerLeave);
      element.removeEventListener("focusin", handleFocusIn);
      element.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [id, type, onDismiss]);

  return (
    <li
      ref={toastRef}
      data-toast-id={id}
      className="pointer-events-auto rounded-lg border border-[#f7b900] bg-[#001016] p-4 text-white shadow-xl"
    >
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden="true"
          className="mt-1 size-6 shrink-0 text-[#f7b900]"
        />

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#f7b900]">{label}</p>

          <p className="mt-1 wrap-break-word text-sm leading-relaxed">
            {message}
          </p>
        </div>

        <button
          type="button"
          data-toast-dismiss
          aria-label={`Lukk varsel: ${message}`}
          onClick={() => onDismiss(id)}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-[#f7b900] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900]"
        >
          <IoClose aria-hidden="true" className="size-6" />
        </button>
      </div>

      <span
        role={type === "error" ? "alert" : "status"}
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </span>
    </li>
  );
}
