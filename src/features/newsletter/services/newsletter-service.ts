import { and, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { newsletterSubscribers } from "@/integrations/drizzle/schema";
import { sendNewsletterWelcomeEmail } from "@/integrations/email";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Suscribe un correo. Es idempotente y no revela si el correo ya estaba suscrito:
 * solo envía la bienvenida cuando la suscripción es nueva o se reactiva.
 */
export async function subscribeToNewsletter(email: string, source = "home"): Promise<void> {
  const [existing] = await db
    .select({
      id: newsletterSubscribers.id,
      isActive: newsletterSubscribers.isActive,
      unsubscribeToken: newsletterSubscribers.unsubscribeToken,
    })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);

  let token: string;

  if (!existing) {
    const [created] = await db
      .insert(newsletterSubscribers)
      .values({ email, source })
      .onConflictDoNothing({ target: newsletterSubscribers.email })
      .returning({ unsubscribeToken: newsletterSubscribers.unsubscribeToken });

    // Conflicto por carrera: otra solicitud lo insertó primero, no reenviar.
    if (!created) return;
    token = created.unsubscribeToken;
  } else if (!existing.isActive) {
    await db
      .update(newsletterSubscribers)
      .set({ isActive: true, unsubscribedAt: null })
      .where(eq(newsletterSubscribers.id, existing.id));
    token = existing.unsubscribeToken;
  } else {
    return;
  }

  const appUrl = getAppUrl();
  await sendNewsletterWelcomeEmail({
    toEmail: email,
    storeUrl: appUrl,
    unsubscribeUrl: `${appUrl}/api/newsletter/baja?token=${token}`,
  });
}

export async function unsubscribeFromNewsletter(token: string): Promise<boolean> {
  if (!UUID_PATTERN.test(token)) return false;

  const [updated] = await db
    .update(newsletterSubscribers)
    .set({ isActive: false, unsubscribedAt: new Date() })
    .where(and(eq(newsletterSubscribers.unsubscribeToken, token)))
    .returning({ id: newsletterSubscribers.id });

  return Boolean(updated);
}
