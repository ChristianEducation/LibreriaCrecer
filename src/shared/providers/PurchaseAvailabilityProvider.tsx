"use client";

import { createContext, useContext } from "react";

type PurchaseAvailabilityContextValue = {
  purchasesEnabled: boolean;
};

const PurchaseAvailabilityContext = createContext<PurchaseAvailabilityContextValue>({
  purchasesEnabled: false,
});

export function PurchaseAvailabilityProvider({
  children,
  purchasesEnabled,
}: PurchaseAvailabilityContextValue & { children: React.ReactNode }) {
  return (
    <PurchaseAvailabilityContext.Provider value={{ purchasesEnabled }}>
      {children}
    </PurchaseAvailabilityContext.Provider>
  );
}

export function usePurchaseAvailability() {
  return useContext(PurchaseAvailabilityContext);
}