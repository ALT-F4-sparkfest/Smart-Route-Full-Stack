import { useEffect, useRef, useState } from "react";

export default function useAnimatedPosition(target) {
  const [position, setPosition] = useState(target);

  const frame = useRef();

  useEffect(() => {
    if (!target) return;

    cancelAnimationFrame(frame.current);

    const start = performance.now();

    const duration = 800;

    const from = position || target;

    function animate(now) {
      const t = Math.min((now - start) / duration, 1);

      const eased = 1 - Math.pow(1 - t, 3);

      setPosition({
        lat: from.lat + (target.lat - from.lat) * eased,
        lng: from.lng + (target.lng - from.lng) * eased,
      });

      if (t < 1) {
        frame.current = requestAnimationFrame(animate);
      }
    }

    frame.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame.current);
  }, [target]);

  return position || target;
}
