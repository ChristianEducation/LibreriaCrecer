import { areStorePurchasesEnabled } from "@/shared/config/store-purchases";
import { PurchaseAvailabilityProvider } from "@/shared/providers/PurchaseAvailabilityProvider";
import { Navbar } from "@/shared/ui";

type CheckoutLayoutProps = {
  children: React.ReactNode;
};

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const purchasesEnabled = areStorePurchasesEnabled();

  return (
    <PurchaseAvailabilityProvider purchasesEnabled={purchasesEnabled}>
      <Navbar variant="checkout" />
      <main className="min-h-[calc(100vh-64px)] bg-beige">{children}</main>
    </PurchaseAvailabilityProvider>
  );
}