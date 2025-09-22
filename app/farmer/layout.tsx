import type React from "react"
import { FarmerLayout } from "@/components/farmer-layout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FarmerLayout>{children}</FarmerLayout>
}
