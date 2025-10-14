import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { AppLayout } from "@/components/layouts/app-layout"

export default function AdminJimasTerminadasLoading() {
  return (
    <AppLayout type="admin">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-[200px]" />
        </div>

        {/* Huerta Cards Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="md:w-64 h-48 md:h-auto" />
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-64" />
                      <div className="text-right">
                        <Skeleton className="h-8 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div key={j} className="text-center">
                            <Skeleton className="h-6 w-8 mx-auto mb-1" />
                            <Skeleton className="h-4 w-16 mx-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-8 w-24" />
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
