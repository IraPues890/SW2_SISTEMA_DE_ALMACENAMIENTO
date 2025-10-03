import './QuickActions.css'

function QuickActions({ actions }) {
  return (
    <section className="quick_actions">
      {actions.map(({ label, icon, title }) => (
        <button key={label} title={title}>
          {icon} {label}
        </button>
      ))}
    </section>
  )
}
export default QuickActions;