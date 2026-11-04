export type PaymentIncompleteEmailProps = {
  orderNumber: string;
  customerName: string;
  productTitles: string[];
  retryUrl: string;
  /** Dirección pública del sitio, para cargar el banner (ej: https://www.libreriacrecer.cl). */
  siteUrl: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Misma paleta de /regalos: crema de fondo, oro solo en acentos y moss en texto, líneas finas y el botón.
const C = {
  beige: "#f5f3e8",
  white: "#faf9f4",
  warm: "#ede9d4",
  line: "#e0dbb8",
  moss: "#736002",
  gold: "#c8a830",
  text: "#3a3001",
  textMid: "#6b5a04",
  textLight: "#8a7830",
};

const SERIF = "Castoro, Georgia, 'Times New Roman', serif";

export function buildPaymentIncompleteEmail({
  orderNumber,
  customerName,
  productTitles,
  retryUrl,
  siteUrl,
}: PaymentIncompleteEmailProps): string {
  const shownTitles = productTitles.slice(0, 5);
  const extraCount = productTitles.length - shownTitles.length;
  const bannerUrl = `${siteUrl.replace(/\/+$/, "")}/images/email/regalos-banner.jpg`;

  const itemsHtml = shownTitles
    .map(
      (title) => `
        <tr>
          <td width="18" valign="top" style="padding: 11px 0 11px 0; border-bottom: 1px solid ${C.line}; color: ${C.gold}; font-size: 14px; line-height: 20px;">&#9670;</td>
          <td style="padding: 11px 0; border-bottom: 1px solid ${C.line}; font-family: ${SERIF}; font-size: 16px; line-height: 20px; color: ${C.text};">${escapeHtml(title)}</td>
        </tr>`,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tu pago no se completó</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${C.beige}; font-family: Arial, Helvetica, sans-serif; color: ${C.text};">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${C.beige};">
        <tr>
          <td align="center" style="padding: 32px 16px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${C.white}; border: 1px solid ${C.line};">

              <!-- Marca -->
              <tr>
                <td align="center" style="padding: 22px 24px 18px 24px; background-color: ${C.white}; border-bottom: 3px double ${C.moss};">
                  <p style="margin: 0; font-family: ${SERIF}; font-size: 24px; line-height: 28px; color: ${C.moss};">Crecer Librería</p>
                  <p style="margin: 4px 0 0 0; font-size: 10px; line-height: 12px; letter-spacing: 0.42em; text-transform: uppercase; color: ${C.gold};">Católica</p>
                </td>
              </tr>

              <!-- Banner -->
              <tr>
                <td style="padding: 0; line-height: 0; font-size: 0; background-color: ${C.warm};">
                  <img src="${bannerUrl}" width="600" alt="Crecer Librería Católica" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0;">
                </td>
              </tr>

              <!-- Título -->
              <tr>
                <td style="padding: 36px 36px 8px 36px; background-color: ${C.white};">
                  <p style="margin: 0 0 10px 0; font-size: 11px; line-height: 14px; letter-spacing: 0.22em; text-transform: uppercase; color: ${C.textLight};">
                    Pedido ${escapeHtml(orderNumber)}
                  </p>
                  <h1 style="margin: 0; font-family: ${SERIF}; font-size: 32px; line-height: 38px; font-weight: normal; color: ${C.moss};">
                    Tu pago <em style="color: ${C.gold}; font-style: italic;">no se completó</em>
                  </h1>
                  <table border="0" cellspacing="0" cellpadding="0" style="margin: 16px 0 0 0;">
                    <tr><td width="56" height="2" style="background-color: ${C.moss}; font-size: 0; line-height: 0;">&nbsp;</td></tr>
                  </table>
                </td>
              </tr>

              <!-- Mensaje -->
              <tr>
                <td style="padding: 20px 36px 8px 36px; background-color: ${C.white};">
                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 26px; color: ${C.textMid};">
                    Hola, ${escapeHtml(customerName)}. Vimos que empezaste tu compra, pero el pago no llegó a completarse.
                  </p>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding: 14px 18px; background-color: ${C.beige}; border-left: 2px solid ${C.gold}; font-size: 14px; line-height: 22px; color: ${C.text};">
                        <strong>No se te cobró nada</strong> y tu pedido no quedó confirmado.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Productos -->
              <tr>
                <td style="padding: 26px 36px 4px 36px; background-color: ${C.white};">
                  <p style="margin: 0 0 6px 0; font-size: 11px; line-height: 14px; letter-spacing: 0.22em; text-transform: uppercase; color: ${C.textLight};">
                    <span style="color: ${C.gold};">&mdash;</span>&nbsp; Lo que tenías en tu pedido
                  </p>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    ${itemsHtml}
                  </table>
                  ${extraCount > 0 ? `<p style="margin: 10px 0 0 0; font-size: 13px; color: ${C.textLight};">y ${extraCount} producto${extraCount === 1 ? "" : "s"} más</p>` : ""}
                </td>
              </tr>

              <!-- Botón -->
              <tr>
                <td align="center" style="padding: 32px 36px 12px 36px; background-color: ${C.white};">
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="background-color: ${C.moss}; border-bottom: 3px solid ${C.gold}; border-radius: 3px;">
                        <a href="${retryUrl}" style="display: inline-block; padding: 15px 38px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 16px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: bold; color: #ffffff; text-decoration: none;">
                          Volver a intentar
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 36px 36px 36px; background-color: ${C.white};">
                  <p style="margin: 0; font-size: 13px; line-height: 22px; color: ${C.textLight}; text-align: center;">
                    Al pagar, vuelve a nuestro sitio hasta ver la pantalla de confirmación.<br>
                    Si ves un cobro en tu tarjeta o tuviste algún problema, responde este correo y lo revisamos contigo.
                  </p>
                </td>
              </tr>

              <!-- Pie -->
              <tr>
                <td align="center" style="padding: 22px 24px; background-color: ${C.beige}; border-top: 3px double ${C.moss};">
                  <p style="margin: 0 0 4px 0; font-family: ${SERIF}; font-size: 15px; line-height: 20px; color: ${C.moss};">Crecer Librería Católica</p>
                  <p style="margin: 0; font-size: 12px; line-height: 18px; color: ${C.textLight};">
                    Antofagasta, Chile &nbsp;&middot;&nbsp; pedidos@libreriacrecer.cl
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
