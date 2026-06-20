import { Resend } from "resend";
import { emailConfig } from "./config";
import { buildOrderConfirmationEmail, OrderConfirmationEmailProps } from "./templates/order-confirmation";
import { buildOrderShippedEmail, OrderShippedEmailProps } from "./templates/order-shipped";

const resend = new Resend(emailConfig.apiKey);

export async function sendOrderConfirmationEmail(params: OrderConfirmationEmailProps & { toEmail: string }): Promise<void> {
  if (!emailConfig.apiKey) {
    console.warn("sendOrderConfirmationEmail: RESEND_API_KEY no configurada. Saltando envío.");
    return;
  }

  try {
    const html = buildOrderConfirmationEmail(params);
    
    await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.fromAddress}>`,
      to: params.toEmail,
      subject: `Confirmación de pedido ${params.orderNumber} - Crecer Librería`,
      html,
    });
    
    console.log(`[Email] Confirmación de pedido ${params.orderNumber} enviada exitosamente a ${params.toEmail}`);
  } catch (error) {
    console.error(`[Email] Error enviando confirmación de pedido ${params.orderNumber}:`, error);
    // Best-effort: no relanzar el error para no romper la transacción principal
  }
}

export async function sendOrderShippedEmail(params: OrderShippedEmailProps & { toEmail: string }): Promise<void> {
  if (!emailConfig.apiKey) {
    console.warn("sendOrderShippedEmail: RESEND_API_KEY no configurada. Saltando envío.");
    return;
  }

  try {
    const html = buildOrderShippedEmail(params);
    
    await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.fromAddress}>`,
      to: params.toEmail,
      subject: `Tu pedido ${params.orderNumber} está en camino`,
      html,
    });
    
    console.log(`[Email] Notificación de despacho ${params.orderNumber} enviada exitosamente a ${params.toEmail}`);
  } catch (error) {
    console.error(`[Email] Error enviando notificación de despacho ${params.orderNumber}:`, error);
    // Best-effort: no relanzar el error
  }
}
