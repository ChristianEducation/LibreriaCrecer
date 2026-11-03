const ICON_PROPS = {
  "aria-hidden": true,
  fill: "none",
  height: 18,
  stroke: "var(--gold)",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.5,
  viewBox: "0 0 24 24",
  width: 18,
} as const;

const TRUST_ITEMS = [
  {
    label: "Retiro en tienda, Antofagasta",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 10l1.5-5h13L20 10M4 10v9h16v-9M4 10h16M9 19v-5h6v5" />
      </svg>
    ),
  },
  {
    label: "Despacho a todo Chile",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
  },
  {
    label: "Pago seguro con Getnet",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Atención por WhatsApp",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 20l1.3-4.2A8 8 0 118.4 19L4 20z" />
      </svg>
    ),
  },
] as const;

export function TrustStrip() {
  return (
    <div className="trust-strip page-px">
      <ul className="trust-strip-list storefront-container">
        {TRUST_ITEMS.map((item) => (
          <li className="trust-strip-item" key={item.label}>
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
