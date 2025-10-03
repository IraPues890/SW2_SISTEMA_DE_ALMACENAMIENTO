import './GlobalMetrics.css';

function GlobalMetrics({ metrics }) {
  const icons = ['👥', '📂', '💾'];
  const colors = ['#3B82F6', '#F59E42', '#10B981'];
  return (
    <section className="global_metrics">
      {metrics.map(( metric, i) => (
        <div className="metric" key={metric.getLabel} style={{ borderLeft: `6px solid ${colors[i]}` }}>
          <span className="metric_icon" style={{ color: colors[i] }}>{icons[i]}</span>
          <div>
            <span>{metric.getLabel}</span>
            <strong>{metric.getValue}</strong>
          </div>
        </div>
      ))}
    </section>
  )
}
export default GlobalMetrics;