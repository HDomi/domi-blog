import { useContext } from "react";
import { LayoutContext } from "./LayoutContext";

export const useLayout = () => {
  const context = useContext(LayoutContext);

  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutContext.Provider");
  }

  return context;
};
