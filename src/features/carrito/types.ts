export type CartItem = {
  productId: string;
  title: string;
  slug: string;
  author: string | null;
  price: number;
  originalPrice: number | null;
  imageUrl: string | null;
  sku: string | null;
  quantity: number;
};

export type CartItemInput = Omit<CartItem, "quantity">;

export type CartSummary = {
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
};
