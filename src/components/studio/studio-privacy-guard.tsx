"use client";
import { useEffect } from "react";
export function StudioPrivacyGuard() {
  useEffect(() => {
    // A browser back/forward snapshot must not reveal the previous session.
    const hide = () => {
      const el = document.getElementById("studio-content");
      if (el) el.style.visibility = "hidden";
    };
    const show = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    return () => {
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
    };
  }, []);
  return null;
}
