"use client";

import { useRef, useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export const useMagnetic = (sensitivity = 0.5) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  useEffect(() => {
    // Manually apply transform via subscription to avoid re-renders
    const unsubscribeX = xSpring.on("change", (latestX) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${latestX}px, ${ySpring.get()}px)`;
      }
    });

    const unsubscribeY = ySpring.on("change", (latestY) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${xSpring.get()}px, ${latestY}px)`;
      }
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [xSpring, ySpring]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const relativeX = clientX - (left + width / 2);
      const relativeY = clientY - (top + height / 2);

      x.set(relativeX * sensitivity);
      y.set(relativeY * sensitivity);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y, sensitivity]);

  return ref;
};
