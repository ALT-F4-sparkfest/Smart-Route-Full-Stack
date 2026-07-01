import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const API = "http://localhost:3000";

export default function useLiveVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [connected, setConnected] = useState(false);

  // 1. Create a ref to store the socket instance
  const socketRef = useRef(null);

  useEffect(() => {
    // Load initial snapshot
    fetch(`${API}/vehicles`)
      .then((r) => r.json())
      .then((data) => setVehicles(data))
      .catch(console.error);

    // 2. Assign the socket to the ref
    socketRef.current = io(API);

    socketRef.current.on("connect", () => {
      console.log("🟢 Connected");
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Disconnected");
      setConnected(false);
    });

    socketRef.current.on("vehicle_update", (vehicle) => {
      setVehicles((prev) => {
        const index = prev.findIndex((v) => v.id === vehicle.id);

        if (index === -1) return [...prev, vehicle];

        const updated = [...prev];
        updated[index] = vehicle;
        return updated;
      });
    });

    socketRef.current.on("vehicle_snapshot", (snapshot) => {
      setVehicles(snapshot);
    });

    // 3. Clean up using the ref value
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // 4. Now you can safely expose the socket instance to the component using the hook
  return {
    vehicles,
    connected,
    socket: socketRef.current,
  };
}
