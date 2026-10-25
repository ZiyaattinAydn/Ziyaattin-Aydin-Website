"use client";
import { useEffect } from "react";
export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const unload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const navigate = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest("a");
      if (
        a?.href &&
        a.target !== "_blank" &&
        a.href !== window.location.href &&
        !window.confirm(
          "Kaydedilmeyen değişikliklerin var. Bu sayfadan ayrılmak istiyor musun?",
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const submit = (e: SubmitEvent) => {
      if (
        !(e.target as HTMLFormElement)?.hasAttribute("data-unsaved-editor") &&
        !window.confirm(
          "Kaydedilmeyen değişikliklerin var. Bu işleme devam etmek istiyor musun?",
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", navigate, true);
    document.addEventListener("submit", submit, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", navigate, true);
      document.removeEventListener("submit", submit, true);
    };
  }, [dirty]);
}
