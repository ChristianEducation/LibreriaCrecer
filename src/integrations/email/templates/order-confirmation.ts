import { formatCLP } from "@/shared/utils/formatters";

export type OrderConfirmationEmailProps = {
  orderNumber: string;
  customerName: string;
  items: Array<{
    productTitle: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryMethod: string;
  address?: {
    street: string;
    number: string;
    apartment?: string | null;
    commune: string;
    city: string;
    region: string;
  } | null;
};

export function buildOrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  shippingCost,
  total,
  deliveryMethod,
  address,
}: OrderConfirmationEmailProps): string {
  const isShipping = deliveryMethod === "shipping";

  const addressText = isShipping && address
    ? `${address.street} ${address.number}${address.apartment ? `, Dpto ${address.apartment}` : ""}, ${address.commune}, ${address.city}, ${address.region}`
    : "Retiro en tienda (Nos pondremos en contacto para coordinar la entrega)";

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0dbb8; color: #3a3001; font-size: 14px;">
            ${item.productTitle}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e0dbb8; color: #6b5a04; font-size: 14px; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e0dbb8; color: #6b5a04; font-size: 14px; text-align: right;">
            ${formatCLP(item.unitPrice)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e0dbb8; color: #3a3001; font-size: 14px; text-align: right; font-weight: bold;">
            ${formatCLP(item.subtotal)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f3e8; font-family: Arial, sans-serif; color: #3a3001;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f3e8; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf9f4; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(58,48,1,0.05); max-width: 600px; width: 100%;">
              <!-- Header -->
              <tr>
                <td style="background-color: #736002; padding: 30px; text-align: center;">
                  <h1 style="color: #faf9f4; margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal;">
                    Crecer Librería
                  </h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #c8a830; margin: 0 0 20px 0; font-family: Georgia, serif; font-size: 22px;">
                    ¡Gracias por tu compra, ${customerName}!
                  </h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #6b5a04;">
                    Hemos recibido el pago de tu pedido <strong>${orderNumber}</strong> y ya estamos preparándolo.
                  </p>
                  
                  ${isShipping ? `
                  <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.6; color: #6b5a04; background-color: #ede9d4; padding: 15px; border-radius: 4px;">
                    Te avisaremos por este mismo correo cuando tu pedido sea despachado, junto con el número de seguimiento.
                  </p>
                  ` : ""}

                  <!-- Order Details Table -->
                  <h3 style="color: #3a3001; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid #e0dbb8; padding-bottom: 8px;">
                    Resumen de tu pedido
                  </h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; border-collapse: collapse;">
                    <thead>
                      <tr>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e0dbb8; text-align: left; font-size: 12px; text-transform: uppercase; color: #8a7830;">Producto</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e0dbb8; text-align: center; font-size: 12px; text-transform: uppercase; color: #8a7830;">Cant.</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e0dbb8; text-align: right; font-size: 12px; text-transform: uppercase; color: #8a7830;">Precio</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e0dbb8; text-align: right; font-size: 12px; text-transform: uppercase; color: #8a7830;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3" style="padding: 12px; text-align: right; font-size: 14px; color: #6b5a04;">Subtotal</td>
                        <td style="padding: 12px; text-align: right; font-size: 14px; color: #3a3001; font-weight: bold;">${formatCLP(subtotal)}</td>
                      </tr>
                      <tr>
                        <td colspan="3" style="padding: 12px; text-align: right; font-size: 14px; color: #6b5a04; border-bottom: 1px solid #e0dbb8;">Envío</td>
                        <td style="padding: 12px; text-align: right; font-size: 14px; color: #3a3001; font-weight: bold; border-bottom: 1px solid #e0dbb8;">${shippingCost === 0 ? "Gratis" : formatCLP(shippingCost)}</td>
                      </tr>
                      <tr>
                        <td colspan="3" style="padding: 16px 12px; text-align: right; font-size: 16px; color: #736002; font-weight: bold;">Total Pagado</td>
                        <td style="padding: 16px 12px; text-align: right; font-size: 18px; color: #c8a830; font-weight: bold;">${formatCLP(total)}</td>
                      </tr>
                    </tfoot>
                  </table>

                  <!-- Shipping Address -->
                  <h3 style="color: #3a3001; font-size: 16px; margin: 0 0 10px 0;">
                    ${isShipping ? "Dirección de despacho" : "Método de entrega"}
                  </h3>
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b5a04; background-color: #f5f3e8; padding: 15px; border-radius: 4px;">
                    ${addressText}
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #ede9d4; padding: 30px; text-align: center; border-top: 1px solid #e0dbb8;">
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #8a7830;">
                    <strong>Crecer Librería Católica</strong><br/>
                    Antofagasta, Chile
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #8a7830;">
                    Si tienes alguna duda sobre tu pedido, responde a este correo o escríbenos a pedidos@libreriacrecer.cl
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
