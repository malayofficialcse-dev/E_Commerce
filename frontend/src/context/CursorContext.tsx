"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type CursorType = "default" | "pointer" | "view" | "buy" | "none";

interface CursorContextType {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
  cursorLabel: string;
  setCursorLabel: (label: string) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [cursorLabel, setCursorLabel] = useState("");

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType, cursorLabel, setCursorLabel }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};
