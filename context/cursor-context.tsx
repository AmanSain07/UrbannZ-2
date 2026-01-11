"use client";

import React, { createContext, useContext, useState } from "react";

type CursorTypeWrapper = "default" | "hover" | "text" | "hidden" | "magnet";

interface CursorContextType {
  cursorType: CursorTypeWrapper;
  setCursorType: (type: CursorTypeWrapper) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorType: "default",
  setCursorType: () => { },
});

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
  const [cursorType, setCursorType] = useState<CursorTypeWrapper>("default");

  const value = React.useMemo(() => ({ cursorType, setCursorType }), [cursorType]);

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
