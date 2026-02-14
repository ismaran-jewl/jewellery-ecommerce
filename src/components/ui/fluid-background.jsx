"use client";

import { useEffect } from "react";
import { useMotionValue, useMotionTemplate, motion } from "framer-motion";

export default function FluidBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FAF9F6] pointer-events-none">
      <motion.div
        className="absolute -inset-[100px] opacity-40 blur-3xl"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(120, 113, 108, 0.15),
              transparent 80%
            )
          `,
        }}
      />
    </div>
  );
}