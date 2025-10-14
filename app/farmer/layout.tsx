import type React from "react"
import { FarmerLayout } from "@/components/farmer-layout"
import { AppLayout } from "@/components/layouts/app-layout"


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout type="farmer">{children}</AppLayout>
}
