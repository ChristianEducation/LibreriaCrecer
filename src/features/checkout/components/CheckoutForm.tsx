"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cx } from "class-variance-authority";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCart, useCartSummary } from "@/features/carrito/hooks";
import { CreateOrderSchema, type CreateOrderSchemaInput } from "@/features/checkout/schemas";
import { Button, Input, Textarea } from "@/shared/ui";
import { formatCLP } from "@/shared/utils/formatters";

type PaymentMethod = "tarjeta" | "transferencia" | "efectivo";
type DeliveryOptionId = "pickup" | "starken" | "chilexpress";

export interface CheckoutFormProps {
  onSubmit: (
    data: CreateOrderSchemaInput,
    selectedPaymentMethod: PaymentMethod,
  ) => Promise<string | void>;
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
    id: "starken" as const,
    label: "Starken",
    description: "3-5 dias habiles · Todo Chile",
    priceLabel: "$3.990",
    shippingCost: 3990,
    deliveryMethod: "shipping" as const,
  },
  {
    id: "chilexpress" as const,
    label: "Chilexpress",
    description: "2-3 dias habiles · Todo Chile",
    priceLabel: "$4.990",
    shippingCost: 4990,
    deliveryMethod: "shipping" as const,
  },
];

const chileanRegions = [
  "Arica y Parinacota",
  "Tarapaca",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaiso",
  "Metropolitana de Santiago",
  "O'Higgins",
  "Maule",
  "Nuble",
  "Biobio",
  "La Araucania",
  "Los Rios",
  "Los Lagos",
  "Aysen",
  "Magallanes y la Antartica Chilena",
] as const;

function CreditCardIcon() {
  return (
    <svg aria-hidden="true" className="size-[14px]" fill="none" viewBox="0 0 24 24">
      <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.5" width="22" x="1" y="4" />
      <path d="M1 10h22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg aria-hidden="true" className="size-[14px]" fill="none" viewBox="0 0 24 24">
      <rect height="14" rx="2" stroke="currentColor" strokeWidth="1.5" width="20" x="2" y="5" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg aria-hidden="true" className="size-[14px]" fill="none" viewBox="0 0 24 24">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

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
  return (
    <div
      className={cx(
        "flex items-center gap-2 px-5 text-[11px] uppercase tracking-[0.08em]",
        status === "pending" ? "text-text-light" : "",
        status === "active" ? "font-medium text-moss" : "",
        status === "done" ? "font-medium text-gold" : "",
      )}
    >
      <span
        className={cx(
          "flex size-5 items-center justify-center rounded-full border text-[10px]",
          status === "pending" ? "border-current" : "",
          status === "active" ? "border-moss bg-moss text-white" : "",
          status === "done" ? "border-gold bg-gold text-white" : "",
        )}
      >
        {number}
      </span>
      <span>{label}</span>
    </div>
  );
}

function SectionTitle({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-2.5 border-b border-border pb-3 font-serif text-[20px] text-moss">
      <span className="flex size-6 items-center justify-center rounded-full bg-moss font-sans text-[11px] text-white">
        {number}
      </span>
      <span>{children}</span>
    </h2>
  );
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const { items, couponCode, couponDiscount } = useCart();
  const { subtotal, total } = useCartSummary();
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOptionId>("pickup");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("tarjeta");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

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
    setValue,
    watch,
  } = form;

  const deliveryMethod = watch("deliveryMethod");
  const selectedDelivery = useMemo(
    () => deliveryOptions.find((option) => option.id === selectedDeliveryOption) ?? deliveryOptions[0],
    [selectedDeliveryOption],
  );
  const shippingCost = selectedDelivery.shippingCost;
  const totalWithShipping = total + shippingCost;

  const customer = watch("customer");
  const address = watch("address");

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

  async function handleValidSubmit(values: CreateOrderSchemaInput) {
    setSubmitError(null);

    if (selectedPaymentMethod === "efectivo" && values.deliveryMethod !== "pickup") {
      setSubmitError("El pago en efectivo solo esta disponible para retiro en tienda.");
      return;
    }

    const result = await onSubmit(values, selectedPaymentMethod);

    if (typeof result === "string" && result) {
      setSubmitError(result);
    }
  }

  return (
    <div>
      <div className="flex h-[52px] items-center justify-center border-b border-border bg-white px-5 md:px-10 lg:px-14">
        <CheckoutStep number={1} label="Datos" status={stepOneDone ? "done" : "active"} />
        <div className="h-px w-10 bg-border" />
        <CheckoutStep
          number={2}
          label="Entrega"
          status={stepOneDone ? (stepTwoReady ? "done" : "active") : "pending"}
        />
        <div className="h-px w-10 bg-border" />
        <CheckoutStep
          number={3}
          label="Pago"
          status={stepOneDone && stepTwoReady ? "active" : "pending"}
        />
      </div>

      <form
        className="mx-auto grid max-w-[1100px] gap-10 px-5 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-14 lg:py-16"
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <div className="space-y-9">
          <section>
            <SectionTitle number={1}>Informacion de contacto</SectionTitle>

            <div className="grid gap-[14px] md:grid-cols-2">
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

            <div className="mt-[14px]">
              <Input
                error={errors.customer?.email?.message}
                label="Correo electronico"
                placeholder="tu@correo.cl"
                type="email"
                {...register("customer.email")}
              />
            </div>

            <div className="mt-[14px]">
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

            <div className="flex flex-col gap-2.5">
              {deliveryOptions.map((option) => {
                const isSelected = option.id === selectedDeliveryOption;

                return (
                  <button
                    className={cx(
                      "flex items-center gap-3 rounded-[2px] border border-border bg-white px-4 py-[14px] text-left transition-colors hover:border-gold",
                      isSelected ? "border-gold bg-gold/5" : "",
                    )}
                    key={option.id}
                    onClick={() => setSelectedDeliveryOption(option.id)}
                    type="button"
                  >
                    <span
                      className={cx(
                        "relative size-4 shrink-0 rounded-full border-[1.5px] border-border",
                        isSelected ? "border-gold" : "",
                      )}
                    >
                      {isSelected ? <span className="absolute inset-[3px] rounded-full bg-gold" /> : null}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-text">{option.label}</span>
                      <span className="mt-0.5 block text-[11px] text-text-light">{option.description}</span>
                    </span>

                    <span className="text-sm font-medium text-gold">{option.priceLabel}</span>
                  </button>
                );
              })}
            </div>

            {deliveryMethod === "shipping" ? (
              <div className="mt-5 space-y-[14px]">
                {errors.address?.message ? (
                  <p className="text-[11px] text-error">{errors.address.message}</p>
                ) : null}

                <div className="grid gap-[14px] md:grid-cols-[minmax(0,1fr)_160px]">
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

                <div className="grid gap-[14px] md:grid-cols-2">
                  <Input
                    error={errors.address?.apartment?.message}
                    label="Depto / oficina"
                    placeholder="Opcional"
                    {...register("address.apartment")}
                  />
                  <Input
                    error={errors.address?.commune?.message}
                    label="Comuna"
                    placeholder="Antofagasta"
                    {...register("address.commune")}
                  />
                </div>

                <div className="grid gap-[14px] md:grid-cols-2">
                  <Input
                    error={errors.address?.city?.message}
                    label="Ciudad"
                    placeholder="Antofagasta"
                    {...register("address.city")}
                  />

                  <div>
                    <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-text-light">
                      Region
                    </label>
                    <select
                      className={cx(fieldClassName, errors.address?.region?.message ? errorFieldClassName : "")}
                      {...register("address.region")}
                      defaultValue=""
                    >
                      <option value="">Seleccionar region</option>
                      {chileanRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.address?.region?.message ? (
                      <p className="mt-2 text-[11px] text-error">{errors.address.region.message}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-[14px] md:grid-cols-2">
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
            <SectionTitle number={3}>Metodo de pago</SectionTitle>

            <div className="mb-5 flex flex-wrap gap-2">
              {[
                { id: "tarjeta" as const, label: "Tarjeta", icon: <CreditCardIcon /> },
                { id: "transferencia" as const, label: "Transferencia", icon: <TransferIcon /> },
                { id: "efectivo" as const, label: "Efectivo", icon: <CashIcon /> },
              ].map((method) => {
                const isSelected = selectedPaymentMethod === method.id;

                return (
                  <button
                    className={cx(
                      "flex items-center gap-1.5 rounded-[2px] border border-border px-4 py-2 text-[12px] text-text-mid transition-colors hover:border-moss",
                      isSelected ? "border-moss bg-moss text-white" : "bg-white",
                    )}
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    type="button"
                  >
                    {method.icon}
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedPaymentMethod === "tarjeta" ? (
              <div className="space-y-[14px]">
                <div>
                  <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-text-light">
                    Numero de tarjeta
                  </label>
                  <input
                    autoComplete="off"
                    className={fieldClassName}
                    inputMode="numeric"
                    onChange={(event) => {
                      const value = event.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(value.match(/.{1,4}/g)?.join(" ") ?? value);
                    }}
                    placeholder="4444 4444 4444 4444"
                    value={cardNumber}
                  />
                </div>

                <div className="grid gap-[14px] md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-text-light">
                      Vencimiento
                    </label>
                    <input
                      autoComplete="off"
                      className={fieldClassName}
                      inputMode="numeric"
                      onChange={(event) => {
                        const value = event.target.value.replace(/\D/g, "").slice(0, 4);
                        setCardExpiry(value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value);
                      }}
                      placeholder="MM/AA"
                      value={cardExpiry}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-text-light">
                      CVV
                    </label>
                    <input
                      autoComplete="off"
                      className={fieldClassName}
                      inputMode="numeric"
                      onChange={(event) => setCardCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      value={cardCvv}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-text-light">
                    Nombre
                  </label>
                  <input
                    autoComplete="off"
                    className={fieldClassName}
                    onChange={(event) => setCardName(event.target.value.toUpperCase())}
                    placeholder="NOMBRE EN LA TARJETA"
                    value={cardName}
                  />
                </div>

                <p className="text-[11px] leading-relaxed text-text-light">
                  Estos campos son solo referenciales. Al confirmar, continuaras el pago en el entorno seguro de
                  Getnet.
                </p>
              </div>
            ) : null}

            {selectedPaymentMethod === "transferencia" ? (
              <div className="rounded-[2px] border border-border bg-beige p-4 text-[13px] leading-[1.8] text-text-mid">
                <strong className="font-medium text-moss">Crecer Libreria SpA</strong>
                <br />
                RUT: 76.123.456-7 · Banco Estado
                <br />
                Cta. corriente: 123-456789-0
                <br />
                <span className="text-[11px] text-text-light">Envia el comprobante a pagos@crecerlibreria.cl</span>
              </div>
            ) : null}

            {selectedPaymentMethod === "efectivo" ? (
              <div className="rounded-[2px] border border-border bg-beige p-4 text-[13px] leading-[1.8] text-text-mid">
                Pago disponible solo para retiro en tienda.
                <br />
                <strong className="font-medium text-moss">Arturo Prat 470, Antofagasta</strong>
              </div>
            ) : null}
          </section>

          <section>
            <h2 className="mb-3 font-serif text-base text-moss">Notas del pedido</h2>
            <Textarea
              label="Notas"
              placeholder="Instrucciones especiales, dedicatorias, etc."
              rows={4}
            />
          </section>

          {submitError ? <p className="text-[11px] text-error">{submitError}</p> : null}

          <div className="lg:hidden">
            <Button className="w-full justify-center" loading={isSubmitting} type="submit" variant="moss">
              Confirmar pedido
            </Button>
          </div>
        </div>

        <aside className="h-fit rounded-[2px] border border-border bg-white lg:sticky lg:top-20">
          <div className="border-b border-border px-6 pb-4 pt-5">
            <h2 className="font-serif text-lg text-moss">Resumen del pedido</h2>
          </div>

          <div className="max-h-[280px] overflow-y-auto py-2">
            {items.map((item) => (
              <div className="flex items-center gap-3 px-6 py-2.5" key={item.productId}>
                <div className="relative aspect-[2/3] w-9 shrink-0 overflow-hidden rounded-[1px] bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))]">
                  {item.imageUrl ? (
                    <Image alt={item.title} className="object-cover" fill sizes="36px" src={item.imageUrl} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-moss/20">
                      <BookIcon className="size-3" />
                    </div>
                  )}
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-moss text-[9px] font-semibold text-white">
                    {item.quantity}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-[13px] text-text">{item.title}</p>
                  <p className="truncate text-[11px] text-text-light">{item.author ?? "Crecer Libreria"}</p>
                </div>

                <span className="text-[13px] font-medium text-text-mid">
                  {formatCLP(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border px-6 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-text-light">Subtotal</span>
                <span className="text-sm text-text-mid">{formatCLP(subtotal)}</span>
              </div>

              {couponDiscount > 0 ? (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gold">Descuento</span>
                  <span className="text-sm text-gold">-{formatCLP(couponDiscount)}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-text-light">Envio</span>
                <span className={cx("text-sm", shippingCost === 0 ? "text-gold" : "text-text-mid")}>
                  {shippingCost === 0 ? "Gratis" : formatCLP(shippingCost)}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-end justify-between gap-4">
                <span className="font-serif text-base text-moss">Total</span>
                <span className="font-serif text-[28px] font-medium text-moss">
                  {formatCLP(totalWithShipping)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border px-6 py-4 max-lg:hidden">
            <Button className="w-full justify-center" loading={isSubmitting} type="submit" variant="moss">
              <span className="flex items-center gap-2">
                <ShieldIcon />
                <span>Confirmar pedido</span>
              </span>
            </Button>
            <p className="mt-3 text-center text-[10px] text-text-light">Compra 100% segura · SSL</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
