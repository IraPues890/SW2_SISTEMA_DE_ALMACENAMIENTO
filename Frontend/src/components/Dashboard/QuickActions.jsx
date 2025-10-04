import './QuickActions.css'

function QuickActions({ actions, onAction }) {
  return (
    <section className="quick_actions">
      {actions.map(( action ) => (
        <button 
          key={action.getLabel}
          title={action.getTitle}
          onClick={() => onAction && onAction(action.getLabel)}
        >
          {action.getIcon} {action.getLabel}
        </button>
      ))}
    </section>
  )
}
export default QuickActions;