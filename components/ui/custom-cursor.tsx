"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useCursor } from "@/context/cursor-context";
import { cn } from "@/lib/utils";

const CustomCursor = () => {
  // We don't hide the system cursor anymore, so we only need the follower part.
  const { cursorType } = useCursor();
  const followerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null); // Floating dot
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Basic touch check - if touch, we don't render the follower to save perf/visuals
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  useGSAP(() => {
    if (isTouchDevice) return;

    const follower = followerRef.current;
    const dot = dotRef.current;
    if (!follower || !dot) return;

    // Center them initially
    gsap.set(follower, { xPercent: -50, yPercent: -50 });
    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e: MouseEvent) => {
      // Smooth movement for the outer ring (slower)
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: "power3.out",
      });

      // Slightly faster movement for the inner dot to create "floating" depth
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [isTouchDevice]);

  // Handle cursor interactions
  useEffect(() => {
    if (isTouchDevice || !followerRef.current || !dotRef.current) return;

    const follower = followerRef.current;
    const dot = dotRef.current;

    switch (cursorType) {
      case "hover":
      case "text":
        // Expand ring, fade dot
        gsap.to(follower, {
          scale: 1.5,
          backgroundColor: "rgba(var(--primary), 0.1)",
          borderColor: "transparent",
          duration: 0.3,
        });
        gsap.to(dot, { scale: 0.5, opacity: 0.5, duration: 0.3 });
        break;
      case "magnet":
        // Magnet effect usually handled by positioning, here we just scale
        gsap.to(follower, {
          scale: 2,
          backgroundColor: "rgba(var(--primary), 0.2)",
          duration: 0.3,
        });
        gsap.to(dot, { scale: 0, duration: 0.3 });
        break;
      case "hidden":
        gsap.to([follower, dot], { opacity: 0, duration: 0.3 });
        break;
      default:
        // Default state: Ring + Dot
        gsap.to(follower, {
          scale: 1,
          width: "40px",
          height: "40px",
          backgroundColor: "transparent",
          border: "1px solid rgba(var(--primary), 0.5)",
          duration: 0.3,
        });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          width: "8px",
          height: "8px",
          backgroundColor: "rgba(var(--primary), 0.8)",
          duration: 0.3,
        });
        break;
    }
  }, [cursorType, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-[40px] h-[40px] rounded-full border border-primary/50 pointer-events-none z-[9998] transition-opacity duration-300 hidden md:block"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9999] hidden md:block"
      />
    </>
  );
};

export default CustomCursor;
