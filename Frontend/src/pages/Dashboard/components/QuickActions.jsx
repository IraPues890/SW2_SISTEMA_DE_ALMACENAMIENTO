function QuickActions({ actions, onAction }) {
  return (
    <section className="flex gap-4 mb-6 flex-wrap">
      {actions.map(( action ) => (
        <button 
          key={action.getLabel}
          title={action.getTitle}
          onClick={() => onAction && onAction(action.getLabel)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-md"
        >
          <span className="text-lg">{action.getIcon}</span>
          {action.getLabel}
        </button>
      ))}
    </section>
  )
}
export default QuickActions;