function GlobalMetrics({ metrics }) {
  const icons = ['👥', '📂', '💾'];
  const colors = ['#3B82F6', '#F59E42', '#10B981'];
  const borderColors = ['border-l-blue-500', 'border-l-orange-400', 'border-l-green-500'];
  const textColors = ['text-blue-500', 'text-orange-400', 'text-green-500'];
  
  return (
    <section className="flex gap-6 mb-6 justify-between flex-wrap">
      {metrics.map(( metric, i) => (
        <div key={metric.getLabel} className={`bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 ${borderColors[i]} flex-1 min-w-[180px] flex items-center`}>
          <span className={`text-4xl mr-2 opacity-95 ${textColors[i]}`}>{icons[i]}</span>
          <div>
            <span className="block text-gray-500 text-sm">{metric.getLabel}</span>
            <strong className="block mt-1 text-xl text-gray-800">{metric.getValue}</strong>
          </div>
        </div>
      ))}
    </section>
  )
}
export default GlobalMetrics;