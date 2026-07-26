type GetnetConfig = {
  login: string;
  secretKey: string;
  endpoint: string;
  appUrl: string;
};

const TEST_DEFAULTS = {
  login: "7ffbb7bf1f7361b1200b2e8d74e1d76f",
  secretKey: "SnZP3D63n3I9dH9O",
  endpoint: "https://checkout.test.getnet.cl",
  appUrl: "http://localhost:3000",
};

function removeTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export const getnetConfig: GetnetConfig = {
  login: process.env.GETNET_LOGIN ?? TEST_DEFAULTS.login,
  secretKey: process.env.GETNET_SECRET_KEY ?? TEST_DEFAULTS.secretKey,
  endpoint: removeTrailingSlash(process.env.GETNET_ENDPOINT ?? TEST_DEFAULTS.endpoint),
  appUrl: removeTrailingSlash(process.env.NEXT_PUBLIC_APP_URL ?? TEST_DEFAULTS.appUrl),
};

export function getGetnetReturnUrl(reference: string): string {
  const encodedReference = encodeURIComponent(reference);
  return `${getnetConfig.appUrl}/api/pagos/retorno?reference=${encodedReference}`;
}

export function getGetnetCancelUrl(reference: string): string {
  const encodedReference = encodeURIComponent(reference);
  return `${getnetConfig.appUrl}/api/pagos/retorno?reference=${encodedReference}`;
}
export function assertGetnetRuntimeConfig(): void {
  if (process.env.NODE_ENV !== "production") return;

  const missingVariables = [
    ["GETNET_LOGIN", process.env.GETNET_LOGIN],
    ["GETNET_SECRET_KEY", process.env.GETNET_SECRET_KEY],
    ["GETNET_ENDPOINT", process.env.GETNET_ENDPOINT],
    ["NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingVariables.length > 0) {
    throw new Error(`Missing Getnet production configuration: ${missingVariables.join(", ")}`);
  }

  if (
    getnetConfig.endpoint.includes("checkout.test.getnet.cl") ||
    !getnetConfig.endpoint.startsWith("https://")
  ) {
    throw new Error("Getnet production endpoint must use the HTTPS production host.");
  }

  if (!getnetConfig.appUrl.startsWith("https://")) {
    throw new Error("Getnet production callback URL must use HTTPS.");
  }
}
