import { formatCLP } from "@/shared/utils/formatters";

export type OwnerSaleConfirmedEmailProps = {
  orderNumber: string;
  customerName: string;
  items: Array<{
    productTitle: string;
    quantity: number;
  }>;
  total: number;
  deliveryMethod: string;
  adminOrderUrl: string;
};

export function buildOwnerSaleConfirmedEmail({
  orderNumber,
  customerName,
  items,
  total,
  deliveryMethod,
  adminOrderUrl,
}: OwnerSaleConfirmedEmailProps): string {
  const deliveryText = deliveryMethod === "shipping" ? "Despacho" : "Retiro en tienda";

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e0dbb8; color: #3a3001; font-size: 13px;">
            ${item.productTitle} × ${item.quantity}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva venta</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f3e8; font-family: Arial, sans-serif; color: #3a3001;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f3e8; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="480" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf9f4; border-radius: 8px; overflow: hidden; max-width: 480px; width: 100%;">
              <tr>
                <td style="background-color: #c8a830; padding: 24px; text-align: center;">
                  <h1 style="color: #3a3001; margin: 0; font-family: Georgia, serif; font-size: 20px; font-weight: normal;">
                    Crecer Librería
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 6px 0; font-size: 13px; color: #8a7830;">Nueva venta</p>
                  <p style="margin: 0 0 20px 0; font-size: 18px; color: #3a3001; font-weight: bold;">
                    ${orderNumber} · ${formatCLP(total)}
                  </p>
                  <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #6b5a04;">
                    ${customerName} acaba de pagar su pedido.
                  </p>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                    ${itemsHtml}
                  </table>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 6px 0; color: #8a7830;">Entrega</td>
                      <td style="padding: 6px 0; text-align: right; color: #3a3001;">${deliveryText}</td>
                    </tr>
                  </table>
                  <a href="${adminOrderUrl}" style="display: inline-block; font-size: 13px; color: #736002; text-decoration: none;">
                    Ver pedido en el panel →
                  </a>
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
