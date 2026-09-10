export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY || "",
  fromAddress: "pedidos@libreriacrecer.cl",
  fromName: "Crecer Librería",
};

const OWNER_EMAIL = "crecerlibreria@gmail.com";
// Temporal: sacar de aca (y de SALE_CONFIRMATION_RECIPIENTS) cuando ya no
// haga falta el respaldo mientras se confirma que el sistema funciona bien.
const DEVELOPER_EMAIL = "c.wevarh@gmail.com";

export const SALE_CONFIRMATION_RECIPIENTS = [OWNER_EMAIL, DEVELOPER_EMAIL];
export const PAYMENT_ALERT_RECIPIENTS = [DEVELOPER_EMAIL];

export function buildAdminOrderUrl(orderId: string): string {
  const adminHostname = process.env.NEXT_PUBLIC_ADMIN_HOSTNAME || "admin.libreriacrecer.cl";
  return `https://${adminHostname}/pedidos/${orderId}`;
}
