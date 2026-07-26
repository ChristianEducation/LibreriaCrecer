export type GetnetAuthObject = {
  login: string;
  tranKey: string;
  nonce: string;
  seed: string;
};

export type GetnetSessionStatus =
  | "OK"
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "FAILED"
  | "CREATED"
  | "PARTIAL_EXPIRED"
  | "REFUNDED";

export type GetnetApiStatus = {
  status: GetnetSessionStatus;
  reason?: string;
  message?: string;
  date?: string;
};

export type GetnetCreateSessionParams = {
  reference: string;
  description: string;
  amount: number;
  buyer: {
    name: string;
    surname: string;
    email: string;
    mobile: string;
  };
  returnUrl: string;
  cancelUrl: string;
  ipAddress: string;
  userAgent: string;
};

export type GetnetCreateSessionResponse = {
  requestId: number;
  processUrl: string;
  status: GetnetApiStatus;
};

export type GetnetPaymentEntry = {
  status: {
    status: GetnetSessionStatus;
    reason?: string;
    message?: string;
    date?: string;
  };
  internalReference?: string;
  reference?: string;
  paymentMethod?: string;
  franchise?: string;
  authorization?: string;
  receipt?: string;
  amount?: {
    from?: {
      total?: number;
      currency?: string;
    };
  };
  processorFields?: Record<string, string>;
};

export type GetnetPaymentStatusResponse = {
  requestId: number;
  status: GetnetApiStatus;
  request?: {
    payment?: {
      reference?: string;
      amount?: {
        currency?: string;
        total?: number;
      };
    };
  };
  payment?: GetnetPaymentEntry[];
};

export type GetnetReversePaymentResponse = {
  status: GetnetApiStatus;
  payment?: GetnetPaymentEntry;
};

export type InternalPaymentStatus = "paid" | "cancelled" | "pending";

export function mapGetnetStatusToInternal(
  status: GetnetSessionStatus | undefined,
): InternalPaymentStatus {
  switch (status) {
    case "APPROVED":
      return "paid";
    case "REJECTED":
    case "FAILED":
    case "PARTIAL_EXPIRED":
      return "cancelled";
    case "PENDING":
    case "CREATED":
    case "OK":
    case "REFUNDED":
    default:
      return "pending";
  }
}

export function getGetnetSessionStatus(
  response: GetnetPaymentStatusResponse,
): GetnetSessionStatus | undefined {
  if (response.status?.status && response.status.status !== "OK") {
    return response.status.status;
  }

  return response.payment?.[0]?.status?.status ?? response.status?.status;
}
