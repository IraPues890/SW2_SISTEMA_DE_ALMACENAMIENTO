import './QuickActions.css'

function QuickActions({ actions }) {
  return (
    <section className="quick_actions">
      {actions.map(( action ) => (
        <button key={action.getLabel} title={action.getTitle}>
          {action.getIcon} {action.getLabel}
        </button>
      ))}
    </section>
  )
}
export default QuickActions;