"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const useParallax = (options = { tilt: 15, perspective: 1000 }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial 3D transform properties
    gsap.set(element, { transformPerspective: options.perspective, transformStyle: "preserve-3d" });

    const xTo = gsap.quickTo(element, "rotationY", { duration: 0.5, ease: "power2.out" });
    const yTo = gsap.quickTo(element, "rotationX", { duration: 0.5, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();

      const x = clientX - left;
      const y = clientY - top;

      const xPct = x / width - 0.5;
      const yPct = y / height - 0.5;

      xTo(xPct * options.tilt);
      yTo(-yPct * options.tilt);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: ref });

  return ref;
};
