export type GetnetAuthObject = {
  login: string;
  tranKey: string;
  nonce: string;
  seed: string;
};

export type GetnetStatusCode = "OK" | "FAILED";

export type GetnetSessionStatus =
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "FAILED"
  | "CREATED"
  | "PARTIAL_EXPIRED";

export type GetnetApiStatus = {
  status: GetnetStatusCode;
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
  status: GetnetApiStatus & { status?: GetnetSessionStatus };
  request?: {
    status?: { status?: GetnetSessionStatus };
    payment?: GetnetPaymentEntry;
  };
  payment?: GetnetPaymentEntry[];
};

export type GetnetReversePaymentResponse = {
  status: GetnetApiStatus;
  payment?: GetnetPaymentEntry;
};

export type InternalPaymentStatus = "paid" | "cancelled" | "pending";

export function mapGetnetStatusToInternal(status: GetnetSessionStatus | undefined): InternalPaymentStatus {
  switch (status) {
    case "APPROVED":
      return "paid";
    case "REJECTED":
    case "FAILED":
      return "cancelled";
    case "PENDING":
    case "CREATED":
    case "PARTIAL_EXPIRED":
    default:
      return "pending";
  }
}
