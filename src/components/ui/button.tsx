import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type SharedButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & SharedButtonProps;

export type LinkButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  SharedButtonProps & {
    href: ComponentPropsWithoutRef<typeof Link>["href"];
  };

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:opacity-55";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-110",
  secondary: "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)]",
  ghost: "border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

function getButtonClass({ variant = "primary", size = "md", fullWidth = false, className = "" }: SharedButtonProps & { className?: string }) {
  return `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`;
}

export function Button({ variant, size, fullWidth, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={getButtonClass({ variant, size, fullWidth, className })} {...props} />;
}

export function LinkButton({ variant, size, fullWidth, className, href, ...props }: LinkButtonProps) {
  return <Link href={href} className={getButtonClass({ variant, size, fullWidth, className })} {...props} />;
}
