import { Resend } from "resend";
import { emailConfig, PAYMENT_ALERT_RECIPIENTS, SALE_CONFIRMATION_RECIPIENTS } from "./config";
import { buildOrderConfirmationEmail, OrderConfirmationEmailProps } from "./templates/order-confirmation";
import { buildOrderShippedEmail, OrderShippedEmailProps } from "./templates/order-shipped";
import { buildOwnerSaleConfirmedEmail, OwnerSaleConfirmedEmailProps } from "./templates/owner-sale-confirmed";
import { buildPaymentAlertEmail, PaymentAlertEmailProps } from "./templates/payment-alert";

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

export async function sendOwnerSaleConfirmedEmail(params: OwnerSaleConfirmedEmailProps): Promise<void> {
  if (!emailConfig.apiKey) {
    console.warn("sendOwnerSaleConfirmedEmail: RESEND_API_KEY no configurada. Saltando envío.");
    return;
  }

  try {
    const html = buildOwnerSaleConfirmedEmail(params);

    await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.fromAddress}>`,
      to: SALE_CONFIRMATION_RECIPIENTS,
      subject: `Nueva venta: ${params.orderNumber}`,
      html,
    });

    console.warn(`[Email] Aviso de venta confirmada ${params.orderNumber} enviado`);
  } catch (error) {
    console.error(`[Email] Error enviando aviso de venta confirmada ${params.orderNumber}:`, error);
  }
}

export async function sendPaymentAlertEmail(params: PaymentAlertEmailProps): Promise<void> {
  if (!emailConfig.apiKey) {
    console.warn("sendPaymentAlertEmail: RESEND_API_KEY no configurada. Saltando envío.");
    return;
  }

  try {
    const html = buildPaymentAlertEmail(params);

    await resend.emails.send({
      from: `${emailConfig.fromName} <${emailConfig.fromAddress}>`,
      to: PAYMENT_ALERT_RECIPIENTS,
      subject: `Alerta: pago no reconciliado${params.orderNumber ? ` — ${params.orderNumber}` : ""}`,
      html,
    });

    console.warn(`[Email] Alerta de pago no reconciliado enviada`, { orderNumber: params.orderNumber });
  } catch (error) {
    console.error(`[Email] Error enviando alerta de pago no reconciliado:`, error);
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
