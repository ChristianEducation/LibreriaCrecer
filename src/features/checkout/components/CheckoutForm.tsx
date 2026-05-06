"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cx } from "class-variance-authority";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCart, useCartSummary } from "@/features/carrito/hooks";
import { CreateOrderSchema, type CreateOrderSchemaInput } from "@/features/checkout/schemas";
import { Input, Textarea } from "@/shared/ui";
import { formatCLP } from "@/shared/utils/formatters";

type DeliveryOptionId = "pickup" | "chilexpress";
type ShippingQuoteStatus = "idle" | "loading" | "available" | "unavailable";

type ShippingQuote = {
  cost: number;
  status: ShippingQuoteStatus;
};

type CoverageAreaOption = {
  label: string;
  value: string;
  coverageCode: string;
};

export interface CheckoutFormProps {
  onSubmit: (data: CreateOrderSchemaInput) => Promise<string | void>;
}

const fieldClassName =
  "w-full rounded border border-border bg-white px-[14px] py-[10px] text-sm text-text transition-[border-color,box-shadow] duration-200 placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10";
const errorFieldClassName = "border-error focus:border-error focus:ring-error/10";

const deliveryOptions = [
  {
    id: "pickup" as const,
    label: "Retiro en tienda",
    description: "Arturo Prat 470 · Lun-Sab 9:00-19:00",
    priceLabel: "Gratis",
    shippingCost: 0,
    deliveryMethod: "pickup" as const,
  },
  {
    id: "chilexpress" as const,
    label: "Despacho a domicilio vía Chilexpress",
    description: "2-3 días hábiles · Todo Chile",
    priceLabel: "Por pagar al recibir",
    shippingCost: 0,
    deliveryMethod: "shipping" as const,
  },
];

const chileanRegions: Array<{ label: string; value: string }> = [
  { label: "Arica y Parinacota", value: "R15" },
  { label: "Tarapaca", value: "R1" },
  { label: "Antofagasta", value: "R2" },
  { label: "Atacama", value: "R3" },
  { label: "Coquimbo", value: "R4" },
  { label: "Valparaiso", value: "R5" },
  { label: "Metropolitana de Santiago", value: "RM" },
  { label: "O'Higgins", value: "R6" },
  { label: "Maule", value: "R7" },
  { label: "Nuble", value: "R16" },
  { label: "Biobio", value: "R8" },
  { label: "La Araucania", value: "R9" },
  { label: "Los Rios", value: "R14" },
  { label: "Los Lagos", value: "R10" },
  { label: "Aysen", value: "R11" },
  { label: "Magallanes y la Antartica Chilena", value: "R12" },
] as const;

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="size-[15px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
}

function CheckoutStep({
  number,
  label,
  status,
}: {
  number: number;
  label: string;
  status: "pending" | "active" | "done";
}) {
  const color =
    status === "active" ? "var(--color-moss)" :
    status === "done" ? "var(--color-gold)" :
    "var(--color-text-light)";
  const circleBg =
    status === "active" ? "var(--color-moss)" :
    status === "done" ? "var(--color-gold)" :
    "transparent";
  const circleColor = status === "pending" ? color : "white";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color, fontWeight: status !== "pending" ? 500 : 400 }}>
      <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: `1.5px solid ${color}`, background: circleBg, color: circleColor, fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {number}
      </span>
      <span>{label}</span>
    </div>
  );
}

function SectionTitle({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "var(--font-inter)", fontSize: "16px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-moss)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--color-moss)", color: "white", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {number}
      </span>
      {children}
    </h2>
  );
}

function buildQuotePackage(itemQuantity: number) {
  return {
    weightKg: Math.max(1, itemQuantity),
    heightCm: 8,
    widthCm: 20,
    lengthCm: 28,
  };
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const { items, couponCode, couponDiscount } = useCart();
  const { subtotal, total } = useCartSummary();
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOptionId>("pickup");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [coverageAreas, setCoverageAreas] = useState<CoverageAreaOption[]>([]);
  const [coverageLoading, setCoverageLoading] = useState(false);
  const [coverageError, setCoverageError] = useState<string | null>(null);
  const [destinationCoverageCode, setDestinationCoverageCode] = useState<string | null>(null);
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote>({
    cost: 0,
    status: "idle",
  });
  const previousRegionRef = useRef<string>("");

  const form = useForm<CreateOrderSchemaInput>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      deliveryMethod: "pickup",
      address: undefined,
      couponCode: couponCode ?? undefined,
    },
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    clearErrors,
    setValue,
    watch,
  } = form;

  const deliveryMethod = watch("deliveryMethod");
  const selectedDelivery = useMemo(
    () => deliveryOptions.find((option) => option.id === selectedDeliveryOption) ?? deliveryOptions[0],
    [selectedDeliveryOption],
  );
  const totalItemQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const shippingCost =
    selectedDelivery.deliveryMethod === "shipping" && shippingQuote.status === "available"
      ? shippingQuote.cost
      : selectedDelivery.shippingCost;
  const totalWithShipping = total + shippingCost;

  const customer = watch("customer");
  const address = watch("address");
  const commune = address?.commune?.trim() ?? "";
  const region = address?.region?.trim() ?? "";

  const stepOneDone = Boolean(
    customer.firstName.trim() &&
      customer.lastName.trim() &&
      customer.email.trim() &&
      customer.phone.trim() &&
      !errors.customer,
  );

  const stepTwoReady =
    deliveryMethod === "pickup"
      ? true
      : Boolean(
          address?.street?.trim() &&
            address?.number?.trim() &&
            address?.commune?.trim() &&
            address?.city?.trim() &&
            address?.region?.trim(),
        ) && !errors.address;

  useEffect(() => {
    setValue(
      "items",
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      { shouldValidate: true },
    );
  }, [items, setValue]);

  useEffect(() => {
    setValue("couponCode", couponCode ?? undefined);
  }, [couponCode, setValue]);

  useEffect(() => {
    setValue("deliveryMethod", selectedDelivery.deliveryMethod, { shouldValidate: true });

    if (selectedDelivery.deliveryMethod === "shipping") {
      const currentAddress = form.getValues("address");

      if (!currentAddress) {
        setValue(
          "address",
          {
            street: "",
            number: "",
            apartment: "",
            commune: "",
            city: "",
            region: "",
            zipCode: "",
            deliveryInstructions: "",
          },
          { shouldValidate: false },
        );
      }
    } else {
      setValue("address", undefined, { shouldValidate: false });
    }
  }, [form, selectedDelivery.deliveryMethod, setValue]);

  useEffect(() => {
    if (deliveryMethod !== "shipping" || !region) {
      setCoverageAreas([]);
      setCoverageLoading(false);
      setCoverageError(null);
      setDestinationCoverageCode(null);
      previousRegionRef.current = "";
      setValue("address.commune", "", { shouldValidate: false });
      setShippingQuote({ cost: 0, status: "idle" });
      return;
    }

    if (previousRegionRef.current !== region) {
      previousRegionRef.current = region;
      setDestinationCoverageCode(null);
      setValue("address.commune", "", { shouldValidate: true });
      setShippingQuote({ cost: 0, status: "idle" });
    }

    const controller = new AbortController();

    async function loadCoverageAreas() {
      setCoverageLoading(true);
      setCoverageError(null);

      try {
        const response = await fetch(`/api/shipping/coverage-areas?regionCode=${encodeURIComponent(region)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => null)) as
          | {
              data?: CoverageAreaOption[];
              message?: string;
            }
          | null;

        if (!response.ok || !Array.isArray(payload?.data)) {
          setCoverageAreas([]);
          setCoverageError(payload?.message ?? "No se pudieron cargar las comunas.");
          return;
        }

        setCoverageAreas(payload.data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setCoverageAreas([]);
        setCoverageError("No se pudieron cargar las comunas.");
      } finally {
        if (!controller.signal.aborted) {
          setCoverageLoading(false);
        }
      }
    }

    void loadCoverageAreas();

    return () => controller.abort();
  }, [deliveryMethod, region, setValue]);

  function handleCommuneChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedCommune = event.target.value;
    const selectedCoverageCode = event.currentTarget.selectedOptions[0]?.dataset.coverageCode;

    setDestinationCoverageCode(selectedCoverageCode ?? null);
    setValue("address.commune", selectedCommune, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (selectedCommune) {
      clearErrors("address.commune");
    }
  }

  useEffect(() => {
    if (deliveryMethod !== "shipping" || !region || !commune) {
      setShippingQuote({ cost: 0, status: "idle" });
      return;
    }

    const controller = new AbortController();

    async function quoteShipping() {
      setShippingQuote((current) => ({
        cost: current.status === "available" ? current.cost : 0,
        status: "loading",
      }));

      try {
        const response = await fetch("/api/shipping/cotizar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination: {
              commune,
              regionCode: region || undefined,
              destinationCoverageCode: destinationCoverageCode ?? undefined,
            },
            package: buildQuotePackage(totalItemQuantity),
            declaredWorth: Math.max(0, subtotal),
          }),
          signal: controller.signal,
        });

        const payload = (await response.json().catch(() => null)) as
          | {
              data?: {
                cost?: number;
              };
            }
          | null;

        if (!response.ok || typeof payload?.data?.cost !== "number") {
          setShippingQuote({ cost: 0, status: "unavailable" });
          return;
        }

        setShippingQuote({
          cost: payload.data.cost,
          status: "available",
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setShippingQuote({ cost: 0, status: "unavailable" });
      }
    }

    void quoteShipping();

    return () => controller.abort();
  }, [commune, deliveryMethod, destinationCoverageCode, region, subtotal, totalItemQuantity]);

  async function handleValidSubmit(values: CreateOrderSchemaInput) {
    setSubmitError(null);

    const result = await onSubmit(values);

    if (typeof result === "string" && result) {
      setSubmitError(result);
    }
  }

  return (
    <div>
      <div style={{ height: "52px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--color-border)", background: "var(--color-white)", gap: 0 }}>
        <CheckoutStep number={1} label="Información" status={stepOneDone ? "done" : "active"} />
        <div style={{ width: "40px", height: "1px", background: "var(--color-border)" }} />
        <CheckoutStep
          number={2}
          label="Envío"
          status={stepOneDone ? (stepTwoReady ? "done" : "active") : "pending"}
        />
      </div>

      <form
        onSubmit={handleSubmit(handleValidSubmit)}
        className="checkout-form-padding cart-layout-grid"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <section>
            <SectionTitle number={1}>Informacion de contacto</SectionTitle>

            <div className="form-grid-2col">
              <Input
                error={errors.customer?.firstName?.message}
                label="Nombre"
                placeholder="Maria"
                {...register("customer.firstName")}
              />
              <Input
                error={errors.customer?.lastName?.message}
                label="Apellido"
                placeholder="Gonzalez"
                {...register("customer.lastName")}
              />
            </div>

            <div style={{ marginTop: "14px" }}>
              <Input
                error={errors.customer?.email?.message}
                label="Correo electronico"
                placeholder="tu@correo.cl"
                type="email"
                {...register("customer.email")}
              />
            </div>

            <div style={{ marginTop: "14px" }}>
              <Input
                error={errors.customer?.phone?.message}
                label="Telefono"
                placeholder="+56 9 1234 5678"
                type="tel"
                {...register("customer.phone")}
              />
            </div>
          </section>

          <section>
            <SectionTitle number={2}>Metodo de entrega</SectionTitle>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {deliveryOptions.map((option) => {
                const isSelected = option.id === selectedDeliveryOption;
                return (
                  <label
                    key={option.id}
                    onClick={() => setSelectedDeliveryOption(option.id)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", border: `1px solid ${isSelected ? "var(--color-gold)" : "var(--color-border)"}`, borderRadius: "var(--radius-lg)", cursor: "pointer", background: isSelected ? "rgba(217,186,30,0.05)" : "var(--color-white)", transition: "border-color 0.2s, background 0.2s" }}
                  >
                    {/* Radio visual */}
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `1.5px solid ${isSelected ? "var(--color-gold)" : "var(--color-border)"}`, flexShrink: 0, position: "relative" }}>
                      {isSelected && <div style={{ position: "absolute", inset: "3px", borderRadius: "50%", background: "var(--color-gold)" }} />}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text)", marginBottom: "2px" }}>{option.label}</div>
                      <div style={{ fontSize: "11px", color: "var(--color-text-light)" }}>{option.description}</div>
                    </div>
                    {/* Price */}
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-gold)", flexShrink: 0 }}>{option.priceLabel}</span>
                  </label>
                );
              })}
            </div>

            {deliveryMethod === "shipping" ? (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "11px",
                  color: shippingQuote.status === "available" ? "var(--color-gold)" : "var(--color-text-light)",
                }}
              >
                {shippingQuote.status === "loading"
                  ? "Calculando envio Chilexpress..."
                  : shippingQuote.status === "available"
                    ? `Envio calculado: ${formatCLP(shippingQuote.cost)}`
                    : commune
                      ? "Envio pendiente de confirmar. Puedes continuar con el pedido."
                      : "Ingresa tu comuna para cotizar el envio."}
              </p>
            ) : null}

            {deliveryMethod === "shipping" ? (
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {errors.address?.message ? (
                  <p className="text-[11px] text-error">{errors.address.message}</p>
                ) : null}

                <div className="form-grid-2col">
                  <div>
                    <label style={{ marginBottom: "8px", display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
                      Region
                    </label>
                    <select
                      className={cx(fieldClassName, errors.address?.region?.message ? errorFieldClassName : "")}
                      style={{ width: "100%", paddingLeft: "14px", paddingRight: "14px", paddingTop: "10px", paddingBottom: "10px", borderRadius: "var(--radius-lg)" }}
                      {...register("address.region")}
                      defaultValue=""
                    >
                      <option value="">Seleccionar region</option>
                      {chileanRegions.map((region) => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                    {errors.address?.region?.message ? (
                      <p className="mt-2 text-[11px] text-error">{errors.address.region.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label style={{ marginBottom: "8px", display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
                      Comuna
                    </label>
                    <select
                      className={cx(fieldClassName, errors.address?.commune?.message ? errorFieldClassName : "")}
                      disabled={!region || coverageLoading || coverageAreas.length === 0}
                      style={{ width: "100%", paddingLeft: "14px", paddingRight: "14px", paddingTop: "10px", paddingBottom: "10px", borderRadius: "var(--radius-lg)", opacity: !region || coverageLoading ? 0.7 : 1 }}
                      {...register("address.commune")}
                      onChange={handleCommuneChange}
                      defaultValue=""
                    >
                      <option value="">
                        {!region
                          ? "Selecciona una region"
                          : coverageLoading
                            ? "Cargando comunas..."
                            : "Seleccionar comuna"}
                      </option>
                      {coverageAreas.map((area) => (
                        <option key={area.coverageCode} value={area.label} data-coverage-code={area.coverageCode}>
                          {area.label}
                        </option>
                      ))}
                    </select>
                    {errors.address?.commune?.message ? (
                      <p className="mt-2 text-[11px] text-error">{errors.address.commune.message}</p>
                    ) : coverageError ? (
                      <p className="mt-2 text-[11px] text-error">{coverageError}</p>
                    ) : null}
                  </div>
                </div>

                <div className="form-grid-street">
                  <Input
                    error={errors.address?.street?.message}
                    label="Calle"
                    placeholder="Arturo Prat"
                    {...register("address.street")}
                  />
                  <Input
                    error={errors.address?.number?.message}
                    label="Numero"
                    placeholder="470"
                    {...register("address.number")}
                  />
                </div>

                <div className="form-grid-2col">
                  <Input
                    error={errors.address?.apartment?.message}
                    label="Depto / oficina"
                    placeholder="Opcional"
                    {...register("address.apartment")}
                  />
                  <Input
                    error={errors.address?.city?.message}
                    label="Ciudad"
                    placeholder="Antofagasta"
                    {...register("address.city")}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <Input
                    error={errors.address?.zipCode?.message}
                    label="Codigo postal"
                    placeholder="Opcional"
                    {...register("address.zipCode")}
                  />
                </div>

                <Textarea
                  error={errors.address?.deliveryInstructions?.message}
                  label="Instrucciones de despacho"
                  placeholder="Indicaciones para la entrega"
                  rows={4}
                  {...register("address.deliveryInstructions")}
                />
              </div>
            ) : null}
          </section>

          <section>
            <SectionTitle number={3}>Notas del pedido</SectionTitle>
            <Textarea
              label="Notas"
              placeholder="Instrucciones especiales, dedicatorias, etc."
              rows={4}
              {...register("notes")}
            />
          </section>

          {submitError ? <p className="text-[11px] text-error">{submitError}</p> : null}

          <div>
            <button
              disabled={isSubmitting}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "2rem", paddingRight: "2rem", background: "var(--moss)", color: "white", border: "none", borderRadius: "var(--radius-xl)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, transition: "background 0.2s" }}
              type="submit"
            >
              {isSubmitting ? "Procesando..." : "Confirmar pedido"}
            </button>
          </div>
        </div>

        <aside style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", position: "sticky", top: "80px", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--color-moss)" }}>Tu pedido</span>
            <Link href="/carrito" style={{ fontSize: "11px", color: "var(--color-gold)", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>Editar</Link>
          </div>

          {/* Items */}
          <div style={{ maxHeight: "280px", overflowY: "auto", padding: "8px 0" }}>
            {items.map((item) => (
              <div key={item.productId} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 24px" }}>
                <div style={{ position: "relative", width: "36px", flexShrink: 0, aspectRatio: "2/3" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, var(--color-beige-warm), var(--color-beige-mid))", borderRadius: "1px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {item.imageUrl ? (
                      <Image alt={item.title} fill sizes="36px" src={item.imageUrl} style={{ objectFit: "cover" }} />
                    ) : (
                      <BookIcon className="size-3 text-moss/20" />
                    )}
                  </div>
                  <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", background: "var(--gold)", color: "white", fontSize: "9px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.quantity}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "13px", fontWeight: 500, color: "var(--color-text)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                  {item.author && <div style={{ fontSize: "11px", color: "var(--color-text-light)", marginTop: "1px" }}>{item.author}</div>}
                </div>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-moss)", flexShrink: 0 }}>{formatCLP(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--color-text-light)" }}>Subtotal</span>
              <span style={{ fontSize: "13px", color: "var(--color-text)" }}>{formatCLP(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "var(--color-gold)" }}>Descuento</span>
                <span style={{ fontSize: "13px", color: "var(--color-gold)" }}>-{formatCLP(couponDiscount)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--color-text-light)" }}>Envío</span>
              <span style={{ fontSize: "13px", color: "var(--color-gold)" }}>
                {selectedDelivery.id === "pickup"
                  ? "Gratis"
                  : shippingQuote.status === "loading"
                    ? "Calculando..."
                    : shippingQuote.status === "available"
                      ? formatCLP(shippingQuote.cost)
                      : "Por confirmar"}
              </span>
            </div>
            <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-moss)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 500, color: "var(--color-moss)" }}>{formatCLP(totalWithShipping)}</span>
            </div>
          </div>

          {/* Confirm button */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--color-border)" }}>
            <button
              disabled={isSubmitting}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", paddingTop: "16px", paddingBottom: "16px", background: "var(--moss)", color: "white", border: "none", borderRadius: "var(--radius-xl)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, transition: "background 0.2s" }}
              type="submit"
            >
              <ShieldIcon />
              <span>{isSubmitting ? "Procesando..." : "Confirmar pedido"}</span>
            </button>
            <p style={{ marginTop: "12px", textAlign: "center", fontSize: "10px", color: "var(--color-text-light)" }}>
              Compra 100% segura · SSL
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
