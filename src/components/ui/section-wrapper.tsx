import type { ComponentPropsWithoutRef } from "react";

type SectionWrapperProps = ComponentPropsWithoutRef<"section"> & {
  width?: "default" | "narrow" | "wide";
};

const widthClasses: Record<NonNullable<SectionWrapperProps["width"]>, string> = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-[var(--container-max)]",
};

export function SectionWrapper({ className = "", width = "default", ...props }: SectionWrapperProps) {
  return <section className={`mx-auto w-full ${widthClasses[width]} ${className}`} {...props} />;
}
