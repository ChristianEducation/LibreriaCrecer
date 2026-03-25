export type DeliveryMethod = "pickup" | "shipping";

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CreateOrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderCustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CreateOrderAddressInput = {
  street: string;
  number: string;
  apartment?: string;
  commune: string;
  city: string;
  region: string;
  zipCode?: string;
  deliveryInstructions?: string;
};

export type CreateOrderInput = {
  items: CreateOrderItemInput[];
  customer: CreateOrderCustomerInput;
  deliveryMethod: DeliveryMethod;
  address?: CreateOrderAddressInput;
  couponCode?: string;
};

export type StockValidationError = {
  productId: string;
  requested: number;
  available: number;
};

export type StockValidationResult = {
  valid: boolean;
  errors: StockValidationError[];
};

export type CouponValidationResult = {
  valid: boolean;
  discount: number;
  couponCode?: string;
  couponId?: string;
  error?: string;
};

export type CreateOrderSuccess = {
  orderId: string;
  orderNumber: string;
  total: number;
  status: OrderStatus;
};

export type ServiceErrorCode =
  | "invalid_coupon"
  | "stock_insufficient"
  | "invalid_transition"
  | "order_not_found"
  | "validation_error";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; code: ServiceErrorCode; message: string; details?: unknown };

export type OrderDetail = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  paymentMethod: string | null;
  paymentReference: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    productId: string | null;
    sku: string | null;
    productTitle: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }>;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    number: string;
    apartment: string | null;
    commune: string;
    city: string;
    region: string;
    zipCode: string | null;
    deliveryInstructions: string | null;
  } | null;
};
