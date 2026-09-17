import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
}

const sizePx = {
  sm: 32,
  md: 48,
  lg: 64,
}

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src="/logo_agave.jpeg"
        alt="Agave"
        width={sizePx[size]}
        height={sizePx[size]}
        className={cn("rounded-full object-cover shadow-lg", sizeClasses[size])}
        priority
      />
    </div>
  )
}
