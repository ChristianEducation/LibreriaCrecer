import { Navbar } from "@/shared/ui";

type CheckoutLayoutProps = {
  children: React.ReactNode;
};

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <>
      <Navbar variant="checkout" />
      <main className="min-h-[calc(100vh-64px)] bg-beige">{children}</main>
    </>
  );
}
