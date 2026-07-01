import { useState, useEffect } from "react";

export default function useRouteGeometry(routeId) {
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!routeId) {
      setCoordinates([]);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:3000/routes/${routeId}/geofence`)
      .then((res) => res.json())
      .then((data) => {
        setCoordinates(data.coordinates || []);
      })
      .catch(() => setCoordinates([]))
      .finally(() => setLoading(false));
  }, [routeId]);

  return { coordinates, loading };
}
