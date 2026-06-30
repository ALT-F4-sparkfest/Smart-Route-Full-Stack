// src/components/ui/FadeIn.jsx

import { motion } from "framer-motion";

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  y = 30,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
