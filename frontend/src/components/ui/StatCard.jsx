export default function StatCard({ title, value, icon, footer }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div>
          <div className="stat-title">{title}</div>

          <div className="stat-value">{value}</div>
        </div>

        {icon && <div className="stat-icon">{icon}</div>}
      </div>

      {footer && <div className="stat-footer">{footer}</div>}
    </div>
  );
}
