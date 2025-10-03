import './GlobalMetrics.css';

function GlobalMetrics({ metrics }) {
  const icons = ['👥', '📂', '💾'];
  const colors = ['#3B82F6', '#F59E42', '#10B981'];
  return (
    <section className="global_metrics">
      {metrics.map(({ label, value }, i) => (
        <div className="metric" key={label} style={{ borderLeft: `6px solid ${colors[i]}` }}>
          <span className="metric_icon" style={{ color: colors[i] }}>{icons[i]}</span>
          <div>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        </div>
      ))}
    </section>
  )
}
export default GlobalMetrics;