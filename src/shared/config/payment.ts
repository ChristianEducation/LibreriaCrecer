/**
 * Minutos que dura la sesión de pago en Getnet. Pasado ese tiempo la sesión
 * vence y el pedido se cancela. Se usa al crear la sesión (servidor) y en el
 * aviso del checkout (cliente), por eso vive en un archivo sin dependencias.
 */
export const PAYMENT_SESSION_MINUTES = 45;
