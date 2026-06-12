"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/context/cursor-context";
import { cn } from "@/lib/utils";

const CustomCursor = () => {
  const { cursorType } = useCursor();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion values for raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for follower (ring) - slower
  const ringX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  // Smooth springs for dot - faster (closer to mouse)
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 400 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 400 });

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };
    checkTouch();
    const resizeListener = () => checkTouch();
    window.addEventListener("resize", resizeListener);

    let rafId: number | null = null;
    const moveCursor = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        rafId = null;
      });
    };
    window.addEventListener("mousemove", moveCursor, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeListener);
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

  // Variants for cursor states
  const followerVariants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "rgba(var(--primary), 0.5)",
      scale: 1,
      opacity: 1,
      x: "-50%",
      y: "-50%"
    },
    hover: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(var(--primary), 0.1)",
      borderColor: "transparent",
      scale: 1.5,
      opacity: 1,
      x: "-50%",
      y: "-50%"
    },
    text: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(var(--primary), 0.1)",
      borderColor: "transparent",
      scale: 1.5,
      opacity: 1,
      x: "-50%",
      y: "-50%"
    },
    magnet: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(var(--primary), 0.2)",
      borderColor: "transparent",
      scale: 2,
      opacity: 1,
      x: "-50%",
      y: "-50%"
    },
    hidden: { scale: 0, opacity: 0 }
  };

  const dotVariants = {
    default: {
      scale: 1,
      opacity: 1,
      width: 8,
      height: 8,
      backgroundColor: "rgba(var(--primary), 0.8)",
      x: "-50%",
      y: "-50%"
    },
    hover: { scale: 0.5, opacity: 0.5, x: "-50%", y: "-50%" },
    text: { scale: 0.5, opacity: 0.5, x: "-50%", y: "-50%" },
    magnet: { scale: 0, opacity: 0, x: "-50%", y: "-50%" },
    hidden: { scale: 0, opacity: 0, x: "-50%", y: "-50%" }
  };

  // Important: We need to apply the spring values to style manually or via motion component
  // We use style={{ left: ringX, top: ringY }} but we need to subtract half width/height or translate -50%.
  // Easier: position fixed at top/left 0, and use x/y transform to move.
  // Warning: transform of x/y is used for positioning, variants usage of x/y might conflict.
  // actually variants x: "-50%" is transform.
  // We can't mix `style={{ x: ringX }}` AND `animate={{ x: "-50%" }}` comfortably.
  // Better approach: Use `translateX/Y` for positioning and `x/y` for offset? No.
  // Best approach in Framer:
  // Use `style={{ x: ringX, y: ringY }}`.
  // INSIDE the variants, use `translateX: "-50%", translateY: "-50%"`?
  // Let's try.

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-primary/50 pointer-events-none z-[9998] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        variants={followerVariants}
        animate={cursorType || "default"}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-primary pointer-events-none z-[9999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        variants={dotVariants}
        animate={cursorType || "default"}
        transition={{ duration: 0.3 }}
      />
    </>
  );
};

export default CustomCursor;
