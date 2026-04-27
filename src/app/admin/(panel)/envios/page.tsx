"use client";

import { useEffect, useState } from "react";

import { AdminStatusPill, AdminTable } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type ShippingConfig = {
  originRegion: string;
  originCommune: string;
  originCoverageCode: string | null;
  estimatedBookWeightGrams: number;
  serviceTypeCode: string | null;
  declaredWorth: number;
};

type ShippingPackage = {
  id: string;
  name: string;
  maxWeightGrams: number;
  packageWeightGrams: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  maxItems: number;
  isDefault: boolean;
  isActive: boolean;
};

type PackageForm = Omit<ShippingPackage, "id">;

const emptyPackageForm: PackageForm = {
  name: "",
  maxWeightGrams: 1000,
  packageWeightGrams: 100,
  heightCm: 8,
  widthCm: 20,
  lengthCm: 25,
  maxItems: 3,
  isDefault: false,
  isActive: true,
};

const suggestedPackages: PackageForm[] = [
  { name: "Sobre A4", maxWeightGrams: 500, packageWeightGrams: 30, heightCm: 1, widthCm: 23, lengthCm: 32, maxItems: 1, isDefault: false, isActive: true },
  { name: "Caja S", maxWeightGrams: 1000, packageWeightGrams: 150, heightCm: 8, widthCm: 20, lengthCm: 25, maxItems: 3, isDefault: true, isActive: true },
  { name: "Caja M", maxWeightGrams: 2500, packageWeightGrams: 300, heightCm: 12, widthCm: 25, lengthCm: 35, maxItems: 7, isDefault: false, isActive: true },
  { name: "Caja L", maxWeightGrams: 5000, packageWeightGrams: 500, heightCm: 20, widthCm: 35, lengthCm: 45, maxItems: 14, isDefault: false, isActive: true },
];

const inputClassName = "rounded-[8px] border border-border px-3 py-2 text-sm text-text focus:border-gold focus:outline-none";

export default function AdminEnviosPage() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ShippingConfig>({
    originRegion: "Antofagasta",
    originCommune: "Antofagasta",
    originCoverageCode: "",
    estimatedBookWeightGrams: 300,
    serviceTypeCode: "",
    declaredWorth: 1000,
  });
  const [packages, setPackages] = useState<ShippingPackage[]>([]);
  const [packageForm, setPackageForm] = useState<PackageForm>(emptyPackageForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingPackage, setSavingPackage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [configResponse, packagesResponse] = await Promise.all([
        fetch("/api/admin/shipping/config", { cache: "no-store" }),
        fetch("/api/admin/shipping/packages", { cache: "no-store" }),
      ]);
      const configPayload = (await configResponse.json().catch(() => null)) as
        | { data?: Partial<ShippingConfig>; message?: string }
        | null;
      const packagesPayload = (await packagesResponse.json().catch(() => null)) as
        | { data?: ShippingPackage[]; message?: string }
        | null;

      if (!configResponse.ok || !packagesResponse.ok) {
        setError(configPayload?.message ?? packagesPayload?.message ?? "No se pudo cargar la configuracion.");
        return;
      }

      if (configPayload?.data) {
        const loadedConfig = configPayload.data;
        setConfig((current) => ({
          ...current,
          ...loadedConfig,
          originCoverageCode: loadedConfig.originCoverageCode ?? "",
          serviceTypeCode: loadedConfig.serviceTypeCode ?? "",
        }));
      }
      setPackages(packagesPayload?.data ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function saveConfig() {
    setSavingConfig(true);
    try {
      const response = await fetch("/api/admin/shipping/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          originCoverageCode: config.originCoverageCode || null,
          serviceTypeCode: config.serviceTypeCode || null,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        toast({ message: payload?.message ?? "No se pudo guardar la configuracion.", variant: "error" });
        return;
      }

      toast({ message: "Configuracion de envios guardada." });
    } catch {
      toast({ message: "Error de red al guardar configuracion.", variant: "error" });
    } finally {
      setSavingConfig(false);
    }
  }

  function editPackage(pkg: ShippingPackage) {
    setEditingId(pkg.id);
    setPackageForm({
      name: pkg.name,
      maxWeightGrams: pkg.maxWeightGrams,
      packageWeightGrams: pkg.packageWeightGrams,
      heightCm: pkg.heightCm,
      widthCm: pkg.widthCm,
      lengthCm: pkg.lengthCm,
      maxItems: pkg.maxItems,
      isDefault: pkg.isDefault,
      isActive: pkg.isActive,
    });
  }

  async function savePackage() {
    setSavingPackage(true);
    try {
      const url = editingId ? `/api/admin/shipping/packages/${editingId}` : "/api/admin/shipping/packages";
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageForm),
      });
      const payload = (await response.json().catch(() => null)) as { data?: ShippingPackage; message?: string } | null;

      if (!response.ok || !payload?.data) {
        toast({ message: payload?.message ?? "No se pudo guardar el empaque.", variant: "error" });
        return;
      }

      setPackages((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? payload.data as ShippingPackage : item))
          : [payload.data as ShippingPackage, ...current],
      );
      setEditingId(null);
      setPackageForm(emptyPackageForm);
      toast({ message: "Empaque guardado." });
    } catch {
      toast({ message: "Error de red al guardar empaque.", variant: "error" });
    } finally {
      setSavingPackage(false);
    }
  }

  async function deactivatePackage(id: string) {
    const response = await fetch(`/api/admin/shipping/packages/${id}`, { method: "DELETE" });
    const payload = (await response.json().catch(() => null)) as { data?: ShippingPackage; message?: string } | null;

    if (!response.ok || !payload?.data) {
      toast({ message: payload?.message ?? "No se pudo desactivar el empaque.", variant: "error" });
      return;
    }

    setPackages((current) => current.map((item) => (item.id === id ? payload.data as ShippingPackage : item)));
    toast({ message: "Empaque desactivado." });
  }

  if (loading) {
    return <p className="text-sm text-text-light">Cargando envios...</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Envios</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Configura el origen de Chilexpress y los empaques disponibles para generar etiquetas.
        </p>
      </div>

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2px] border border-border bg-white p-5">
          <h2 className="text-[0.82rem] font-semibold text-text">Configuracion Chilexpress</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Region origen</span>
              <input className={inputClassName} value={config.originRegion} onChange={(event) => setConfig((current) => ({ ...current, originRegion: event.target.value }))} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Comuna origen</span>
              <input className={inputClassName} value={config.originCommune} onChange={(event) => setConfig((current) => ({ ...current, originCommune: event.target.value }))} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Codigo cobertura origen</span>
              <input className={inputClassName} value={config.originCoverageCode ?? ""} onChange={(event) => setConfig((current) => ({ ...current, originCoverageCode: event.target.value }))} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Peso estimado por libro (g)</span>
              <input className={inputClassName} min={1} type="number" value={config.estimatedBookWeightGrams} onChange={(event) => setConfig((current) => ({ ...current, estimatedBookWeightGrams: Number(event.target.value) }))} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Tipo servicio Chilexpress</span>
              <input className={inputClassName} value={config.serviceTypeCode ?? ""} onChange={(event) => setConfig((current) => ({ ...current, serviceTypeCode: event.target.value }))} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Valor declarado base</span>
              <input className={inputClassName} min={0} type="number" value={config.declaredWorth} onChange={(event) => setConfig((current) => ({ ...current, declaredWorth: Number(event.target.value) }))} />
            </label>
            <button className="mt-2 rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60" disabled={savingConfig} onClick={saveConfig} type="button">
              {savingConfig ? "Guardando..." : "Guardar configuracion"}
            </button>
          </div>
        </div>

        <div className="rounded-[2px] border border-border bg-white p-5">
          <h2 className="text-[0.82rem] font-semibold text-text">{editingId ? "Editar empaque" : "Nuevo empaque"}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className={inputClassName} placeholder="Nombre" value={packageForm.name} onChange={(event) => setPackageForm((current) => ({ ...current, name: event.target.value }))} />
            <input className={inputClassName} min={1} placeholder="Peso maximo g" type="number" value={packageForm.maxWeightGrams} onChange={(event) => setPackageForm((current) => ({ ...current, maxWeightGrams: Number(event.target.value) }))} />
            <input className={inputClassName} min={0} placeholder="Peso empaque g" type="number" value={packageForm.packageWeightGrams} onChange={(event) => setPackageForm((current) => ({ ...current, packageWeightGrams: Number(event.target.value) }))} />
            <input className={inputClassName} min={1} placeholder="Max items" type="number" value={packageForm.maxItems} onChange={(event) => setPackageForm((current) => ({ ...current, maxItems: Number(event.target.value) }))} />
            <input className={inputClassName} min={1} placeholder="Alto cm" type="number" value={packageForm.heightCm} onChange={(event) => setPackageForm((current) => ({ ...current, heightCm: Number(event.target.value) }))} />
            <input className={inputClassName} min={1} placeholder="Ancho cm" type="number" value={packageForm.widthCm} onChange={(event) => setPackageForm((current) => ({ ...current, widthCm: Number(event.target.value) }))} />
            <input className={inputClassName} min={1} placeholder="Largo cm" type="number" value={packageForm.lengthCm} onChange={(event) => setPackageForm((current) => ({ ...current, lengthCm: Number(event.target.value) }))} />
            <label className="flex items-center gap-2 text-sm text-text-mid">
              <input checked={packageForm.isActive} onChange={(event) => setPackageForm((current) => ({ ...current, isActive: event.target.checked }))} type="checkbox" />
              Activo
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60" disabled={savingPackage} onClick={savePackage} type="button">
              {savingPackage ? "Guardando..." : "Guardar empaque"}
            </button>
            <button className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid" onClick={() => { setEditingId(null); setPackageForm(emptyPackageForm); }} type="button">
              Limpiar
            </button>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-text-light">Empaques sugeridos</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPackages.map((item) => (
                <button className="rounded-[8px] border border-border px-3 py-2 text-[12px] text-text-mid hover:border-gold" key={item.name} onClick={() => setPackageForm(item)} type="button">
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        columns={[
          { key: "nombre", header: "Empaque", render: (item) => <span className="font-medium text-text">{item.name}</span> },
          { key: "peso", header: "Peso", render: (item) => <span>{item.maxWeightGrams}g max / {item.packageWeightGrams}g empaque</span> },
          { key: "medidas", header: "Medidas", render: (item) => <span>{item.heightCm} x {item.widthCm} x {item.lengthCm} cm</span> },
          { key: "items", header: "Items", render: (item) => <span>{item.maxItems}</span> },
          { key: "estado", header: "Estado", render: (item) => <AdminStatusPill status={item.isActive ? "active" : "inactive"}>{item.isActive ? "Activo" : "Inactivo"}</AdminStatusPill> },
          {
            key: "acciones",
            header: "Acciones",
            render: (item) => (
              <div className="flex flex-wrap gap-2">
                <button className="rounded-[8px] border border-border px-3 py-[6px] text-[12px] text-text-mid" onClick={() => editPackage(item)} type="button">Editar</button>
                {item.isActive ? (
                  <button className="rounded-[8px] border border-error/30 px-3 py-[6px] text-[12px] text-error" onClick={() => deactivatePackage(item.id)} type="button">Desactivar</button>
                ) : null}
              </div>
            ),
          },
        ]}
        data={packages}
        rowKey={(item) => item.id}
        title="Empaques Chilexpress"
      />
    </section>
  );
}
