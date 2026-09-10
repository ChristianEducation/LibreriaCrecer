export type PaymentAlertEmailProps = {
  orderNumber: string | null;
  reason: string;
  detail: string;
  adminOrderUrl: string | null;
};

export function buildPaymentAlertEmail({
  orderNumber,
  reason,
  detail,
  adminOrderUrl,
}: PaymentAlertEmailProps): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pago no reconciliado</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f3e8; font-family: Arial, sans-serif; color: #3a3001;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f3e8; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="480" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf9f4; border-radius: 8px; overflow: hidden; max-width: 480px; width: 100%;">
              <tr>
                <td style="background-color: #fcebeb; padding: 24px; text-align: center;">
                  <p style="margin: 0; font-size: 18px; color: #791f1f; font-weight: bold;">
                    Pago no reconciliado${orderNumber ? `: ${orderNumber}` : ""}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #3a3001;">
                    Getnet reportó un pago que el sistema no pudo confirmar automáticamente.
                  </p>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e0dbb8; color: #8a7830;">Motivo</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e0dbb8; text-align: right; color: #3a3001;">${reason}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #8a7830;">Detalle</td>
                      <td style="padding: 8px 0; text-align: right; color: #3a3001;">${detail}</td>
                    </tr>
                  </table>
                  ${
                    adminOrderUrl
                      ? `<a href="${adminOrderUrl}" style="display: inline-block; font-size: 13px; color: #791f1f; text-decoration: none;">Ver pedido en el panel →</a>`
                      : `<p style="margin: 0; font-size: 13px; color: #6b5a04;">Revisar en el portal de Getnet con los datos de arriba.</p>`
                  }
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
