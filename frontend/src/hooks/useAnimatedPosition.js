// src/hooks/useAnimatedPosition.js

import { useEffect, useRef, useState } from "react";

export default function useAnimatedPosition(target) {
  const [position, setPosition] = useState(target);
  const frameRef = useRef(null);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (!target) {
      setPosition(null);
      return;
    }

    // Skip animation if coordinates haven't changed
    if (
      prevTarget.current &&
      prevTarget.current.lat === target.lat &&
      prevTarget.current.lng === target.lng
    ) {
      // Keep the same position – no update needed
      return;
    }

    // Cancel any ongoing animation
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    const startTime = performance.now();
    const duration = 400; // ← reduced from 800 → 400ms
    const from = position || target;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out for smoother stop
      const eased = 1 - Math.pow(1 - progress, 3);

      setPosition({
        lat: from.lat + (target.lat - from.lat) * eased,
        lng: from.lng + (target.lng - from.lng) * eased,
      });

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // Snap to exact target at the end
        setPosition(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    // Update previous target reference
    prevTarget.current = target;

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target?.lat, target?.lng, target]); // ← more precise dependencies

  return position || target;
}
