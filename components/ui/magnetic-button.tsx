"use client";

import React, { ReactNode } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useCursor } from "@/context/cursor-context";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  sensitivity?: number;
  onClick?: () => void;
}

const MagneticButton = ({ children, className, sensitivity = 0.5, onClick }: MagneticButtonProps) => {
  const magneticRef = useMagnetic(sensitivity);
  const { setCursorType } = useCursor();

  return (
    <div
      ref={magneticRef}
      className={cn("relative inline-block cursor-none", className)}
      onMouseEnter={() => setCursorType("magnet")}
      onMouseLeave={() => setCursorType("default")}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default MagneticButton;
