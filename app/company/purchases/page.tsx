"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Search,
  MapPin,
  FileText,
  Calendar,
  Clock,
  Scissors,
  ImageIcon,
  Eye,
  Camera,
  ExternalLink,
  Share2,
  CheckCircle2,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { AppLayout } from "@/components/layouts/app-layout";
import { saleService, OrchardSale } from "@/services/saleService";
import { orchardService } from "@/services/orchardService";
import { jimaTripService, JimaTrip } from "@/services/jimaTripService";
import { toast } from "sonner";

export default function CompanyPurchasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState<OrchardSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<OrchardSale | null>(null);

  // Dialogs
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showPhotoIdDialog, setShowPhotoIdDialog] = useState(false);
  const [showGuiasDialog, setShowGuiasDialog] = useState(false);

  // Carrusel y lightbox
  const [activeImageIndex, setActiveImageIndex] = useState<
    Record<number, number>
  >({});
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Programar jimas
  const [jimaDialogOpen, setJimaDialogOpen] = useState(false);
  const [jimaSale, setJimaSale] = useState<OrchardSale | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [numTrips, setNumTrips] = useState("");
  const [isSavingJima, setIsSavingJima] = useState(false);
  const [scheduledTrips, setScheduledTrips] = useState<JimaTrip[]>([]);

  // Guías y pesadas
  const [guiasTrips, setGuiasTrips] = useState<JimaTrip[]>([]);
  const [loadingGuias, setLoadingGuias] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");

  // Edición de viajes
  const [editingTripGroup, setEditingTripGroup] = useState<string | null>(null);
  const [editingGroupNewDate, setEditingGroupNewDate] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    saleService
      .getAll()
      .then(setSales)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sales.filter(
    (s) =>
      s.orchard?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.farmer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.id).includes(searchTerm),
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent, saleId: number) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
      setActiveImageIndex((prev) => ({
        ...prev,
        [saleId]: (prev[saleId] || 0) === 0 ? 1 : 0,
      }));
    }
    touchStartX.current = null;
  };

  const handleViewPhoto = (photoPath: string | null) => {
    const url = orchardService.getPhotoUrl(photoPath) || "/placeholder.svg";
    setSelectedPhoto(url);
    setIsPhotoDialogOpen(true);
  };

  const handleOpenLocation = (url: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const finalUrl =
      isIOS && url.includes("google.com/maps")
        ? url.replace("https://www.google.com/maps", "https://maps.apple.com")
        : url;
    window.open(finalUrl, "_blank");
  };

  const handleShareLocation = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const openJimaDialog = async (sale: OrchardSale) => {
    setJimaSale(sale);
    setSelectedDate(undefined);
    setNumTrips("");
    setJimaDialogOpen(true);
    try {
      const trips = await jimaTripService.getBySale(sale.id);
      setScheduledTrips(trips);
    } catch {
      setScheduledTrips([]);
    }
  };

  const openGuiasDialog = async (sale: OrchardSale) => {
    setSelectedSale(sale);
    setShowGuiasDialog(true);
    setLoadingGuias(true);
    try {
      const trips = await jimaTripService.getBySale(sale.id);
      setGuiasTrips(trips);
    } catch {
      setGuiasTrips([]);
    } finally {
      setLoadingGuias(false);
    }
  };

  const handleSaveJima = async () => {
    if (!jimaSale || !selectedDate || !numTrips) return;
    setIsSavingJima(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const newTrips = await jimaTripService.schedule(
        jimaSale.id,
        dateStr,
        parseInt(numTrips),
      );
      setScheduledTrips((prev) => [...prev, ...newTrips]);
      setSelectedDate(undefined);
      setNumTrips("");
      toast.success(
        `${newTrips.length} viaje(s) programado(s) para el ${dateStr}`,
      );
    } catch {
      toast.error("No se pudo programar la jima. Intenta de nuevo.");
    } finally {
      setIsSavingJima(false);
    }
  };

  const handleSaveGroupDate = async (trips: JimaTrip[]) => {
    if (!editingGroupNewDate) return;
    setIsSavingEdit(true);
    try {
      const updated = await Promise.all(
        trips.map((t) => jimaTripService.updateDate(t.id, editingGroupNewDate)),
      );
      const updatedIds = new Set(updated.map((t) => t.id));
      setScheduledTrips((prev) => [
        ...prev.filter((t) => !updatedIds.has(t.id)),
        ...updated,
      ]);
      setEditingTripGroup(null);
      toast.success("Fecha actualizada.");
    } catch {
      toast.error("No se pudo actualizar la fecha.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    try {
      await jimaTripService.deleteTrip(tripId);
      setScheduledTrips((prev) => prev.filter((t) => t.id !== tripId));
      toast.success("Viaje eliminado.");
    } catch {
      toast.error("No se pudo eliminar el viaje.");
    }
  };

  const tripsByDate = scheduledTrips.reduce<Record<string, JimaTrip[]>>(
    (acc, t) => {
      const d = t.scheduled_date;
      if (!acc[d]) acc[d] = [];
      acc[d].push(t);
      return acc;
    },
    {},
  );

  if (loading)
    return (
      <AppLayout type="company">
        <p className="p-4">Cargando compras...</p>
      </AppLayout>
    );

  return (
    <AppLayout type="company">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Compras</h1>
          <p className="text-gray-600">
            Huertas que has adquirido a través de la plataforma
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por huerta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500">No tienes compras registradas aún.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sale) => (
              <Card
                key={sale.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-orange-50 border-orange-200"
              >
                <div className="relative group">
                  {sale.orchard?.extra_photo && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => ({
                            ...prev,
                            [sale.id]: (prev[sale.id] || 0) === 0 ? 1 : 0,
                          }));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => ({
                            ...prev,
                            [sale.id]: (prev[sale.id] || 0) === 0 ? 1 : 0,
                          }));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  <div
                    className="relative w-full h-48 overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={(e) => handleTouchEnd(e, sale.id)}
                  >
                    <button
                      onClick={() =>
                        handleViewPhoto(
                          (activeImageIndex[sale.id] || 0) === 0
                            ? (sale.orchard?.cover_photo ?? null)
                            : (sale.orchard?.extra_photo ?? null),
                        )
                      }
                      className="block w-full h-full"
                    >
                      <Image
                        src={
                          orchardService.getPhotoUrl(
                            (activeImageIndex[sale.id] || 0) === 0
                              ? (sale.orchard?.cover_photo ?? null)
                              : (sale.orchard?.extra_photo ?? null),
                          ) || "/agave-field-plantation.png"
                        }
                        alt={sale.orchard?.name ?? "Huerta"}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    </button>
                  </div>

                  {sale.orchard?.extra_photo && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${(activeImageIndex[sale.id] || 0) === 0 ? "bg-white" : "bg-white/50"}`}
                      />
                      <div
                        className={`w-2 h-2 rounded-full ${(activeImageIndex[sale.id] || 0) === 1 ? "bg-white" : "bg-white/50"}`}
                      />
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-black/70 text-white"
                    >
                      <Camera className="w-3 h-3 mr-1" />
                      {sale.orchard?.extra_photo ? "2" : "1"} foto
                      {sale.orchard?.extra_photo ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-600 text-white">Comprada</Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {sale.orchard?.name ?? `Huerta #${sale.orchard_id}`}
                    </h3>
                    <p className="text-sm text-gray-500">Compra #{sale.id}</p>
                  </div>

                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <Image
                      src="/agave-icon.svg"
                      alt="Agave"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {sale.orchard?.agave_type?.name ?? "—"}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500 mb-1">
                      Cantidad de Plantas
                    </p>
                    <span className="text-2xl font-bold text-blue-600">
                      {(sale.orchard?.plant_quantity ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="text-sm font-medium text-gray-900">
                          {sale.orchard?.state ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Municipio</p>
                        <p className="text-sm font-medium text-gray-900">
                          {sale.orchard?.municipality ?? "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Año</p>
                        <p className="text-sm font-medium text-gray-900">
                          {sale.orchard?.year ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Edad</p>
                        <p className="text-sm font-medium text-gray-900">
                          {sale.orchard?.age ?? "—"} años
                        </p>
                      </div>
                    </div>
                  </div>

                  {sale.orchard?.location_url && (
                    <div
                      onClick={() =>
                        handleOpenLocation(sale.orchard!.location_url!)
                      }
                      className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:bg-green-100 active:scale-[0.98] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-green-200 shrink-0">
                          <MapPin className="h-5 w-5 text-green-700" />
                        </div>
                        <p className="text-sm font-medium text-green-800">
                          Ver ubicación
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareLocation(sale.orchard!.location_url!);
                        }}
                        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-green-200 transition"
                        aria-label="Compartir ubicación"
                      >
                        <Share2 className="h-4 w-4 text-green-700" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedSale(sale);
                        setShowPhotoIdDialog(true);
                      }}
                      disabled={!sale.orchard?.photo_id}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Ver Foto ID
                    </Button>

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Huerta
                    </Button>

                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={() => openJimaDialog(sale)}
                    >
                      <Scissors className="w-4 h-4 mr-2" />
                      Programar Jimas
                    </Button>

                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      onClick={() => {
                        setSelectedSale(sale);
                        setShowOfferDialog(true);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Detalle Oferta
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-gray-300"
                      onClick={() => openGuiasDialog(sale)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Ver Fotos de Guías y Pesadas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Dialog Foto ID ── */}
        <Dialog open={showPhotoIdDialog} onOpenChange={setShowPhotoIdDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Foto ID — {selectedSale?.orchard?.name}</DialogTitle>
            </DialogHeader>
            {selectedSale?.orchard?.photo_id ? (
              <div className="flex justify-center">
                <Image
                  src={
                    orchardService.getPhotoUrl(selectedSale.orchard.photo_id) ||
                    "/placeholder.svg"
                  }
                  alt="Foto ID"
                  width={500}
                  height={400}
                  className="rounded-lg object-contain max-h-[60vh] w-auto"
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                Sin foto ID disponible.
              </p>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Lightbox foto ── */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Foto de la Huerta</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <div className="overflow-auto max-h-[70vh] p-2">
                <img
                  src={selectedPhoto || "/placeholder.svg"}
                  alt="Foto"
                  className="max-w-none object-contain rounded-lg cursor-zoom-in"
                  style={{ width: "100%", height: "auto" }}
                  onClick={(e) => {
                    const img = e.currentTarget;
                    if (img.style.width === "100%") {
                      img.style.width = "200%";
                      img.style.cursor = "zoom-out";
                    } else {
                      img.style.width = "100%";
                      img.style.cursor = "zoom-in";
                    }
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Dialog Detalle Oferta ── */}
        <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Detalle de Oferta — {selectedSale?.orchard?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedSale?.offer && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de compra:</span>
                    <span className="font-medium">
                      {formatDate(selectedSale.sold_at)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cm de Jima</Label>
                  <Input
                    type="number"
                    readOnly
                    value={selectedSale.offer.jima_cm}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meses financiado</Label>
                  <Input
                    type="number"
                    readOnly
                    value={selectedSale.offer.financing_months}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de mes de jima</Label>
                  <Input
                    type="date"
                    readOnly
                    value={selectedSale.offer.harvest_date}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Se jimará a partir de * kilos para arriba * por viaje
                  </Label>
                  <Input
                    type="number"
                    readOnly
                    value={selectedSale.offer.min_kilos}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cómo serían los pagos de viajes jimados *</Label>
                  <textarea
                    readOnly
                    value={selectedSale.offer.payment_terms}
                    rows={2}
                    className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    El Agave sería puesto en fábrica o la fábrica se encargaría
                    de toda la logística *
                  </Label>
                  <textarea
                    readOnly
                    value={selectedSale.offer.logistics}
                    rows={2}
                    className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50"
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Dialog Guías y Pesadas ── */}
        <Dialog open={showGuiasDialog} onOpenChange={setShowGuiasDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Guías y Pesadas — {selectedSale?.orchard?.name}
              </DialogTitle>
            </DialogHeader>
            {loadingGuias ? (
              <p className="text-gray-500 py-4 text-center">Cargando...</p>
            ) : guiasTrips.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">
                No hay viajes registrados aún.
              </p>
            ) : (
              <div className="space-y-3">
                {guiasTrips
                  .sort((a, b) => a.trip_number - b.trip_number)
                  .map((trip) => {
                    const dateLabel = trip.scheduled_date
                      ? new Date(
                          trip.scheduled_date.slice(0, 10) + "T12:00:00",
                        ).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Sin fecha";
                    return (
                      <div
                        key={trip.id}
                        className="border border-gray-200 rounded-lg px-4 py-3 space-y-2"
                      >
                        {/* Encabezado del viaje */}
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-teal-700">
                              #{trip.trip_number}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            Viaje {trip.trip_number} — {dateLabel}
                          </p>
                        </div>

                        {/* Guía */}
                        <div className="flex items-center justify-between pl-11">
                          <div className="flex items-center gap-1">
                            <CheckCircle2
                              className={`w-3 h-3 ${trip.guide_path ? "text-teal-500" : "text-gray-300"}`}
                            />
                            <span
                              className={`text-xs ${trip.guide_path ? "text-teal-600" : "text-gray-400"}`}
                            >
                              {trip.guide_path ? "Guía adjunta" : "Sin guía"}
                            </span>
                          </div>
                          {trip.guide_path && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-teal-300 text-teal-700 hover:bg-teal-50 flex-shrink-0"
                              onClick={async () => {
                                const url = await jimaTripService.getGuideUrl(
                                  trip.id,
                                );
                                setPreviewUrl(url);
                                setPreviewTitle(
                                  "Guía — Viaje " + trip.trip_number,
                                );
                                setPreviewOpen(true);
                              }}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Ver guía
                            </Button>
                          )}
                        </div>

                        {/* Pesada */}
                        <div className="flex items-center justify-between pl-11">
                          <div className="flex items-center gap-1">
                            <CheckCircle2
                              className={`w-3 h-3 ${trip.weigh_path ? "text-blue-500" : "text-gray-300"}`}
                            />
                            <span
                              className={`text-xs ${trip.weigh_path ? "text-blue-600" : "text-gray-400"}`}
                            >
                              {trip.weigh_path
                                ? "Pesada adjunta"
                                : "Sin pesada"}
                            </span>
                          </div>
                          {trip.weigh_path && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-300 text-blue-700 hover:bg-blue-50 flex-shrink-0"
                              onClick={async () => {
                                const url = await jimaTripService.getWeighUrl(
                                  trip.id,
                                );
                                setPreviewUrl(url);
                                setPreviewTitle(
                                  "Pesada — Viaje " + trip.trip_number,
                                );
                                setPreviewOpen(true);
                              }}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Ver pesada
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Dialog Programar Jimas ── */}
        <Dialog open={jimaDialogOpen} onOpenChange={setJimaDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Programar Jimas — {jimaSale?.orchard?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col md:flex-row gap-6 mt-2">
              <div className="flex-shrink-0">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selecciona un día
                </p>
                <div className="border border-gray-200 rounded-lg p-2 bg-white">
                  <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-5">
                <div
                  className={`space-y-3 transition-opacity ${selectedDate ? "opacity-100" : "opacity-40 pointer-events-none"}`}
                >
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                    <p className="text-sm text-teal-700 font-medium">
                      {selectedDate
                        ? selectedDate.toLocaleDateString("es-MX", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Selecciona una fecha en el calendario"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Número de viajes *</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      placeholder="Ej. 3"
                      value={numTrips}
                      onChange={(e) => setNumTrips(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Se creará un registro individual por cada viaje.
                    </p>
                  </div>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={!selectedDate || !numTrips || isSavingJima}
                    onClick={handleSaveJima}
                  >
                    {isSavingJima ? "Guardando..." : "Guardar Programación"}
                  </Button>
                </div>

                {Object.keys(tripsByDate).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Viajes programados
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {Object.entries(tripsByDate)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([date, trips]) => {
                          const groupHasPhotos = trips.some(
                            (t) => t.guide_path || t.weigh_path,
                          );
                          const isEditingThis = editingTripGroup === date;
                          const [y, m, d] = date
                            .substring(0, 10)
                            .split("-")
                            .map(Number);
                          const formattedDate = new Date(
                            y,
                            m - 1,
                            d,
                          ).toLocaleDateString("es-MX", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });
                          return (
                          <div
                            key={date}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              {isEditingThis ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="date"
                                    className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                                    value={editingGroupNewDate}
                                    min={
                                      new Date().toISOString().split("T")[0]
                                    }
                                    onChange={(e) =>
                                      setEditingGroupNewDate(e.target.value)
                                    }
                                  />
                                  <Button
                                    size="sm"
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                    disabled={
                                      !editingGroupNewDate || isSavingEdit
                                    }
                                    onClick={() =>
                                      handleSaveGroupDate(trips)
                                    }
                                  >
                                    {isSavingEdit ? "..." : "Guardar"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingTripGroup(null)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-sm font-medium text-gray-800">
                                    {formattedDate}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {!groupHasPhotos && (
                                      <button
                                        className="text-gray-400 hover:text-teal-600 transition-colors"
                                        title="Editar fecha"
                                        onClick={() => {
                                          setEditingTripGroup(date);
                                          setEditingGroupNewDate(
                                            date.substring(0, 10),
                                          );
                                        }}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <Badge className="bg-orange-100 text-orange-800">
                                      {trips.length} viaje
                                      {trips.length !== 1 ? "s" : ""}
                                    </Badge>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {trips.map((t) => {
                                const hasPhoto = !!(t.guide_path || t.weigh_path);
                                return (
                                  <div key={t.id} className="flex items-center gap-0.5">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${t.guide_path ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                                    >
                                      Viaje {t.trip_number}{" "}
                                      {t.guide_path ? "· guía ✓" : "· sin guía"}
                                    </span>
                                    {!hasPhoto && !isEditingThis && (
                                      <button
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                        title="Eliminar viaje"
                                        onClick={() => handleDeleteTrip(t.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Dialog Preview Guía / Pesada ── */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{previewTitle}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <img
                src={previewUrl}
                alt={previewTitle}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
