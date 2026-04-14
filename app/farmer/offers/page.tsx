"use client";

import { useEffect, useState } from "react";
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
import {
  Search,
  MapPin,
  Eye,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { AppLayout } from "@/components/layouts/app-layout";
import { offerService, Offer } from "@/services/offerService";
import { orchardService } from "@/services/orchardService";

interface OrchardGroup {
  orchardId: number;
  orchardName: string;
  state: string;
  municipality: string;
  plantQuantity: number;
  year: number;
  coverPhoto: string | null;
  agaveType: string;
  offers: Offer[];
}

export default function FarmerOffersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orchardGroups, setOrchardGroups] = useState<OrchardGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<OrchardGroup | null>(null);
  const [showOffersDialog, setShowOffersDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmingOffer, setConfirmingOffer] = useState<{
    id: number;
    action: "aceptada" | "rechazada";
  } | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const offers = await offerService.getAll();

      const map = new Map<number, OrchardGroup>();
      for (const offer of offers) {
        const oId = offer.orchard_id;
        if (!map.has(oId)) {
          map.set(oId, {
            orchardId: oId,
            orchardName: offer.orchard?.name ?? `Huerta #${oId}`,
            state: offer.orchard?.state ?? "",
            municipality: offer.orchard?.municipality ?? "",
            plantQuantity: offer.orchard?.plant_quantity ?? 0,
            year: offer.orchard?.year ?? 0,
            coverPhoto: offer.orchard?.cover_photo ?? null,
            agaveType: offer.orchard?.agave_type?.name ?? "",
            offers: [],
          });
        }
        map.get(oId)!.offers.push(offer);
      }

      setOrchardGroups(Array.from(map.values()));
    } catch (err) {
      console.error("Error cargando ofertas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const filtered = orchardGroups.filter(
    (g) =>
      g.orchardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(g.orchardId).includes(searchTerm),
  );

  const handleViewOffers = (group: OrchardGroup) => {
    setSelectedGroup(group);
    setShowOffersDialog(true);
  };

  const executeOfferAction = async (
    offerId: number,
    action: "aceptada" | "rechazada",
  ) => {
    setActionLoading(true);
    try {
      await offerService.updateStatus(offerId, action);
      setConfirmingOffer(null);
      if (action === "aceptada") {
        setShowOffersDialog(false);
        setSelectedGroup(null);
      }
      await fetchOffers();
    } catch {
      alert.error(
        "Error",
        "No se pudo procesar la oferta. Inténtalo de nuevo.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const statusColor = (status: Offer["status"]) =>
    ({
      pendiente: "bg-yellow-500 text-white",
      revisada: "bg-blue-500 text-white",
      aceptada: "bg-green-500 text-white",
      rechazada: "bg-red-500 text-white",
    })[status] ?? "bg-gray-500 text-white";

  const statusLabel = (status: Offer["status"]) =>
    ({
      pendiente: "En Revisión",
      revisada: "Lista para responder",
      aceptada: "Aceptada",
      rechazada: "Rechazada",
    })[status] ?? status;

  if (loading)
    return (
      <AppLayout type="farmer">
        <p className="p-4">Cargando ofertas...</p>
      </AppLayout>
    );

  return (
    <AppLayout type="farmer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Ofertas</h1>
          <p className="text-muted-foreground">
            Revisa y gestiona las ofertas recibidas para tus huertas
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar huertas por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500">No tienes ofertas aún.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((group) => (
              <Card
                key={group.orchardId}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={
                      orchardService.getPhotoUrl(group.coverPhoto) ||
                      "/agave-field-plantation.png"
                    }
                    alt={group.orchardName}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="secondary"
                      className="bg-orange-600 text-white"
                    >
                      {group.offers.length}{" "}
                      {group.offers.length === 1 ? "oferta" : "ofertas"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {group.orchardName}
                    </h3>
                    <p className="text-sm text-gray-500">#{group.orchardId}</p>
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
                      {group.agaveType}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500 mb-1">
                      Cantidad de Plantas
                    </p>
                    <span className="text-2xl font-bold text-blue-600">
                      {group.plantQuantity.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="text-sm font-medium text-gray-900">
                          {group.state}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Municipio</p>
                        <p className="text-sm font-medium text-gray-900">
                          {group.municipality}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">
                          Ofertas Recibidas
                        </span>
                      </div>
                      <span className="text-lg font-bold text-orange-800">
                        {group.offers.length}
                      </span>
                    </div>
                    {(() => {
                      const ready = group.offers.filter(
                        (o) => o.status === "revisada",
                      ).length;
                      const pending = group.offers.filter(
                        (o) => o.status === "pendiente",
                      ).length;
                      const accepted = group.offers.filter(
                        (o) => o.status === "aceptada",
                      ).length;
                      const rejected = group.offers.filter(
                        (o) => o.status === "rechazada",
                      ).length;
                      return (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {ready > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {ready} lista{ready > 1 ? "s" : ""}
                            </span>
                          )}
                          {pending > 0 && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                              {pending} en revisión
                            </span>
                          )}
                          {accepted > 0 && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              {accepted} aceptada{accepted > 1 ? "s" : ""}
                            </span>
                          )}
                          {rejected > 0 && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              {rejected} rechazada{rejected > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    onClick={() => handleViewOffers(group)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Ofertas
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog detalle de ofertas */}
        <Dialog open={showOffersDialog} onOpenChange={setShowOffersDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-green-700">
                Ofertas para {selectedGroup?.orchardName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {selectedGroup?.offers.length}{" "}
                {selectedGroup?.offers.length === 1
                  ? "oferta recibida"
                  : "ofertas recibidas"}
              </p>
            </DialogHeader>

            {selectedGroup && (
              <div className="space-y-6">
                {selectedGroup.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {offer.company?.business_name ??
                              `Empresa #${offer.company_id}`}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Oferta #{offer.id} ·{" "}
                            {new Date(offer.created_at).toLocaleDateString(
                              "es-MX",
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={statusColor(offer.status)}
                      >
                        {statusLabel(offer.status)}
                      </Badge>
                    </div>

                    {offer.status === "pendiente" ? (
                      /* ── Oferta en revisión por admin ── */
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 text-center space-y-2">
                        <div className="flex justify-center">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-yellow-600" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-yellow-800">
                          Esta empresa está interesada en tu huerta
                        </p>
                        <p className="text-xs text-yellow-600">
                          El administrador está revisando la oferta. Cuando esté
                          lista verás todos los detalles y tu precio de venta.
                        </p>
                      </div>
                    ) : (
                      /* ── Oferta revisada o con resolución: detalles completos ── */
                      <div className="space-y-4">
                        {offer.farmer_price !== null && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-blue-800 mb-1">
                              Tu precio de venta
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                              $
                              {Number(offer.farmer_price).toLocaleString(
                                "es-MX",
                              )}
                            </p>
                            {offer.admin_notes && (
                              <p className="text-xs text-blue-600 mt-2">
                                {offer.admin_notes}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Cm de Jima</Label>
                          <Input type="number" readOnly value={offer.jima_cm} />
                        </div>
                        <div className="space-y-2">
                          <Label>Meses financiado</Label>
                          <Input
                            type="number"
                            readOnly
                            value={offer.financing_months}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de mes de jima</Label>
                          <Input
                            type="date"
                            readOnly
                            value={offer.harvest_date}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>
                            Se jimará a partir de * kilos para arriba * por
                            viaje
                          </Label>
                          <Input
                            type="number"
                            readOnly
                            value={offer.min_kilos}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>
                            Cómo serían los pagos de viajes jimados *
                          </Label>
                          <textarea
                            readOnly
                            value={offer.payment_terms}
                            rows={2}
                            className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>
                            El Agave sería puesto en fábrica o la fábrica se
                            encargaría de toda la logística *
                          </Label>
                          <textarea
                            readOnly
                            value={offer.logistics}
                            rows={2}
                            className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50"
                          />
                        </div>

                        {/* Botones aceptar/rechazar solo cuando está revisada */}
                        {offer.status === "revisada" && (
                          <div className="pt-2 border-t border-gray-100">
                            {confirmingOffer?.id === offer.id ? (
                              <div
                                className={`rounded-lg p-4 space-y-3 ${confirmingOffer.action === "aceptada" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                              >
                                <p className="text-sm font-medium text-gray-800">
                                  {confirmingOffer.action === "aceptada"
                                    ? "¿Confirmas que deseas aceptar esta oferta?"
                                    : "¿Confirmas que deseas rechazar esta oferta?"}
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className={
                                      confirmingOffer.action === "aceptada"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                    }
                                    disabled={actionLoading}
                                    onClick={() =>
                                      executeOfferAction(
                                        offer.id,
                                        confirmingOffer.action,
                                      )
                                    }
                                  >
                                    {actionLoading
                                      ? "Procesando..."
                                      : "Sí, confirmar"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={actionLoading}
                                    onClick={() => setConfirmingOffer(null)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  onClick={() =>
                                    setConfirmingOffer({
                                      id: offer.id,
                                      action: "aceptada",
                                    })
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Aceptar oferta
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 bg-red-600 text-white border-red-300 hover:bg-red-700"
                                  onClick={() =>
                                    setConfirmingOffer({
                                      id: offer.id,
                                      action: "rechazada",
                                    })
                                  }
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Rechazar oferta
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {offer.status === "aceptada" && (
                          <div className="flex items-center gap-2 text-green-600 text-sm pt-2 border-t border-gray-100">
                            <CheckCircle className="w-4 h-4" />
                            Aceptaste esta oferta
                          </div>
                        )}
                        {offer.status === "rechazada" && (
                          <div className="flex items-center gap-2 text-red-600 text-sm pt-2 border-t border-gray-100">
                            <XCircle className="w-4 h-4" />
                            Rechazaste esta oferta
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
