export default function Card({
  title,
  subtitle,
  children,
  className = "",
  actions,
}) {
  return (
    <section className={`busina-card ${className}`}>
      {(title || subtitle || actions) && (
        <div className="busina-card-header">
          <div>
            {title && <h3 className="busina-card-title">{title}</h3>}
            {subtitle && <p className="busina-card-subtitle">{subtitle}</p>}
          </div>

          {actions && <div className="busina-card-actions">{actions}</div>}
        </div>
      )}

      <div className="busina-card-body">{children}</div>
    </section>
  );
}
