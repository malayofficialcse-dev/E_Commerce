"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/CursorContext";

const CustomCursor = () => {
  const { cursorType, cursorLabel } = useCursor();
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "var(--color-primary)",
      mixBlendMode: "normal" as const,
    },
    view: {
      width: 80,
      height: 80,
      backgroundColor: "var(--color-foreground)",
      mixBlendMode: "difference" as const,
    },
    buy: {
      width: 100,
      height: 100,
      backgroundColor: "var(--color-primary)",
      mixBlendMode: "normal" as const,
    },
    pointer: {
      width: 40,
      height: 40,
      backgroundColor: "var(--color-foreground)",
      mixBlendMode: "difference" as const,
    }
  };

  if (!isVisible || cursorType === "none") return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center overflow-hidden"
      style={{
        translateX: cursorX,
        translateY: cursorY,
        x: "-50%",
        y: "-50%",
        ...variants[cursorType as keyof typeof variants] || variants.default
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
    >
      <AnimatePresence>
        {(cursorType === "view" || cursorType === "buy") && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-white text-[10px] font-black uppercase tracking-widest text-center"
          >
            {cursorLabel || cursorType}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomCursor;
