"use client";

import { createContext, useContext, useState, ReactNode, FC } from "react";

interface PromoState {
  code: string;
  discount: number;
}

interface PromoContextType {
  promo: PromoState;
  setPromo: (promo: PromoState) => void;
  clearPromo: () => void;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export const PromoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [promo, setPromo] = useState<PromoState>({ code: "", discount: 0 });

  const clearPromo = () => {
    setPromo({ code: "", discount: 0 });
  };

  return (
    <PromoContext.Provider value={{ promo, setPromo, clearPromo }}>
      {children}
    </PromoContext.Provider>
  );
};

export function usePromo() {
  const context = useContext(PromoContext);
  if (!context) {
    throw new Error("usePromo must be used within PromoProvider");
  }
  return context;
}
