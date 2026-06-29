export default function VehicleList({ vehicles }) {
  const vehicleList = Object.values(vehicles);

  return (
    <div className="vehicle-panel">
      <h2 className="panel-title">Active Vehicles</h2>
      {vehicleList.length === 0 ? (
        <div className="empty-state">Waiting for vehicles...</div>
      ) : (
        vehicleList.map((v) => (
          <div key={v.vehicle_id} className="vehicle-card">
            <div className="vehicle-header">
              <span className="vehicle-id">{v.vehicle_id}</span>
              <span className={`vehicle-status ${v.status}`}>{v.status}</span>
            </div>
            <div className="vehicle-route">{v.route}</div>
            <div className="vehicle-stats">
              <div className="stat">
                <span className="stat-label">Speed</span>
                <span className="stat-value">{v.speed} km/h</span>
              </div>
              <div className="stat">
                <span className="stat-label">Lat</span>
                <span className="stat-value">{v.lat}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Lng</span>
                <span className="stat-value">{v.lng}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
