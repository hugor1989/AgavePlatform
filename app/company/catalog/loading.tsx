import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CompanyLayout } from "@/components/company-layout"
import { AppLayout } from "@/components/layouts/app-layout"

export default function CompanyCatalogLoading() {
  return (
    <AppLayout type="company">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Year Filter Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-16" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar Skeleton */}
        <Skeleton className="h-12 w-full" />

        {/* Tabs Skeleton */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Huertas Skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="md:w-64 h-48 md:h-64" />
                  <div className="flex-1 p-6">
                    <Skeleton className="h-6 w-64 mb-2" />
                    <Skeleton className="h-4 w-48 mb-3" />
                    <div className="flex gap-6 mb-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-5 w-56 mb-3" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-28" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
