export type OrderShippedEmailProps = {
  orderNumber: string;
  customerName: string;
  chilexpressTransportOrderNumber: string | null;
  chilexpressLabelUrl?: string | null;
};

export function buildOrderShippedEmail({
  orderNumber,
  customerName,
  chilexpressTransportOrderNumber,
}: OrderShippedEmailProps): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pedido Despachado</title>
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
                    Crecer Librería Cristiana
                  </h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #c8a830; margin: 0 0 20px 0; font-family: Georgia, serif; font-size: 22px;">
                    ¡Tu pedido ${orderNumber} está en camino!
                  </h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #6b5a04;">
                    Hola ${customerName}, te avisamos que hemos entregado tu pedido a Chilexpress para su despacho.
                  </p>
                  
                  ${chilexpressTransportOrderNumber ? `
                  <div style="background-color: #ede9d4; padding: 25px; border-radius: 6px; text-align: center; margin: 30px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #8a7830;">
                      Número de Seguimiento Chilexpress
                    </p>
                    <p style="margin: 0; font-size: 28px; font-weight: bold; color: #736002; letter-spacing: 2px;">
                      ${chilexpressTransportOrderNumber}
                    </p>
                  </div>
                  <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #6b5a04; text-align: center;">
                    Puedes rastrear el estado de tu envío ingresando este número en el sitio web oficial de <a href="https://www.chilexpress.cl/" style="color: #c8a830; text-decoration: none; font-weight: bold;">Chilexpress</a>.
                  </p>
                  ` : `
                  <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #6b5a04;">
                    Tu pedido ya ha sido entregado al curier. Pronto recibirás tu paquete en la dirección indicada.
                  </p>
                  `}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #ede9d4; padding: 30px; text-align: center; border-top: 1px solid #e0dbb8;">
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #8a7830;">
                    <strong>Crecer Librería Cristiana</strong><br/>
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
