export type NewsletterWelcomeEmailProps = {
  unsubscribeUrl: string;
  storeUrl: string;
};

export function buildNewsletterWelcomeEmail({ unsubscribeUrl, storeUrl }: NewsletterWelcomeEmailProps): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Crecer Librería</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f3e8; font-family: Arial, sans-serif; color: #3a3001;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f3e8; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf9f4; border-radius: 8px; overflow: hidden; max-width: 520px; width: 100%;">
              <tr>
                <td style="background-color: #ede9d4; padding: 28px 24px; text-align: center;">
                  <p style="margin: 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #8a7302;">Crecer Librería Católica</p>
                  <p style="margin: 10px 0 0 0; font-family: Georgia, serif; font-size: 24px; color: #736002;">Gracias por suscribirte</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.7; color: #3a3001;">
                    Desde ahora te avisaremos de nuestras novedades, de las fechas especiales
                    (bautizos, primeras comuniones, Navidad) y de los libros y detalles que creemos que te pueden acompañar.
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.7; color: #6b5a04;">
                    Solo escribimos cuando hay algo que vale la pena.
                  </p>
                  <a href="${storeUrl}" style="display: inline-block; padding: 12px 22px; background-color: #c8a830; border-radius: 6px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #3a3001; text-decoration: none;">Visitar la tienda</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 30px 26px; border-top: 1px solid #e0dbb8;">
                  <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #8a7830;">
                    Recibes este correo porque te suscribiste en libreriacrecer.cl.
                    <a href="${unsubscribeUrl}" style="color: #6b5a04;">Darme de baja</a>
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
