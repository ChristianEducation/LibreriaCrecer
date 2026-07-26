import "server-only";

export function areStorePurchasesEnabled() {
  return process.env.STORE_PURCHASES_ENABLED === "true";
}