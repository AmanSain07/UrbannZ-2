"use client";

import { useRef } from "react";
import { useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export const useParallax = (options = { tilt: 15, perspective: 1000 }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [options.tilt, -options.tilt]), {
    stiffness: 150,
    damping: 20
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-options.tilt, options.tilt]), {
    stiffness: 150,
    damping: 20
  });

  // We perform the event binding in a useEffect if we want to be pure, 
  // but for brevity and direct replacement we can attach listeners in the return ref callback 
  // or just expose the interaction logic. 
  // HOWEVER, the existing component usage expects a ref to be returned and attached.
  // We need to attach listeners to the ref.current.

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const clientX = e.clientX;
    const clientY = e.clientY;

    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // We need to return a ref, but also apply the style. 
  // Since the original hook returned a ref and applied style imperatively via GSAP, 
  // effective replacement requires us to change how consumer uses it OR 
  // use a similar imperative approach. 
  // BUT, framer motion works best declaratively. 
  // Checking `product-card.tsx` usage: `<div ref={parallaxRef} ...>`
  // Inspecting `product-card.tsx`: It just attaches the ref. It doesn't pass motion props.
  // So we MUST use imperative refs or ref callback to verify.
  // Better approach: Since we can't easily change the consumer to a motion.div without editing the file,
  // we can use a small vanilla helper or just use imperative framer API (not standard).

  // WAIT. The easiest internal refactor without changing consumer structure (if consumer is standard HTML div)
  // involves adding event listeners to the element. 
  // BUT we also need to APPLY the transform.
  // The original GSAP hook applied `transform: ...` to the element.
  // We can do this with vanilla JS inside requestAnimationFrame for max perf, relying on the spring math.

  // Let's stick to the existing contract: Return a Ref.
  // Inside a useEffect, attach listeners and run the loop.

  // Actually, since I am editing the project, I should check if I can just make `ProductCard` use `motion.div`.
  // checking `product-card.tsx`... it uses a standard `div`.
  // I will refactor `useParallax` to return the event handlers and style, 
  // OR I will rewrite `useParallax` to handle the DOM manipulation directly using `animate()` or vanilla.

  // Let's go with a Vanilla JS + Spring Physics approach inside the hook to match the exact same API.
  // API: Returns a Ref.

  // Re-implementing with lightweight spring logic to avoid heavy framer dependency just for this if possible?
  // No, we want to use framer-motion since it is already there.

  // Let's use `framer-motion/dom` logic manually? No that's internal.
  // Let's use standard Framer Motion values and apply them manually in a `useMotionValueEvent` or similar.

  // Actally, simplest valid "Performance" fix:
  // Use `useMotionValue` and `useSpring`, and inside `useEffect`, subscribe to them and update `ref.current.style.transform`.

  return useParallaxImplementation(options);
};

import { useEffect } from "react";

function useParallaxImplementation(options: { tilt: number, perspective: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // Spring physics configuration
  const springConfig = { damping: 20, stiffness: 150 };

  // We can simulate spring values with simple JS for max performance and zero dep overhead if we wanted, 
  // but replacing GSAP with Framer Motion was the prompt.

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  useEffect(() => {
    const unsubscribeX = x.on("change", (latest) => {
      // x (0 to 1) -> rotateY (-tilt to tilt)
      rotateY.set(latest * options.tilt); // input is -0.5 to 0.5. Wait.
      // in handleMove: xPct is -0.5 to 0.5.
      // We want Rotation Y to map to X movement.
      // -0.5 -> -tilt ? NO.
      // If mouse is on left (-0.5), we want to rotate Y to look left?
      // Actually let's trust the math from previous file: xPct * options.tilt for xTo? 
      // Previous: xTo(xPct * options.tilt) -> rotationY.
      // Previous: yTo(-yPct * options.tilt) -> rotationX.
    });

    const unsubscribeY = y.on("change", (latest) => {
      rotateX.set(-latest * options.tilt);
    });

    // Subscription to apply transform
    const unsubscribeRotateX = rotateX.on("change", (rx) => {
      if (ref.current) {
        ref.current.style.transform = `perspective(${options.perspective}px) rotateX(${rx}deg) rotateY(${rotateY.get()}deg)`;
      }
    });

    const unsubscribeRotateY = rotateY.on("change", (ry) => {
      if (ref.current) {
        ref.current.style.transform = `perspective(${options.perspective}px) rotateX(${rotateX.get()}deg) rotateY(${ry}deg)`;
      }
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeRotateX();
      unsubscribeRotateY();
    }
  }, [options.perspective, options.tilt, rotateX, rotateY, x, y]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      const xPct = (clientX - left) / width - 0.5;
      const yPct = (clientY - top) / height - 0.5;

      x.set(xPct); // input for rotationY
      y.set(yPct); // input for rotationX
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    // Set initial style
    element.style.transformStyle = "preserve-3d";

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y]);

  return ref;
}
