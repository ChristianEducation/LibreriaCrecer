"use client";

import { useEffect, useState } from "react";

import { useCartStore } from "./store";

function getPersistApi() {
  return "persist" in useCartStore ? useCartStore.persist : undefined;
}

export function useCartHydration() {
  const [hydrated, setHydrated] = useState(() => {
    const persistApi = getPersistApi();
    return persistApi ? persistApi.hasHydrated() : true;
  });

  useEffect(() => {
    const persistApi = getPersistApi();

    if (!persistApi) {
      setHydrated(true);
      return;
    }

    setHydrated(persistApi.hasHydrated());

    const unsubscribeHydrate = persistApi.onHydrate(() => {
      setHydrated(false);
    });

    const unsubscribeFinish = persistApi.onFinishHydration(() => {
      setHydrated(true);
    });

    return () => {
      unsubscribeHydrate();
      unsubscribeFinish();
    };
  }, []);

  return hydrated;
}
