
export function createActionHandlers(navigate, actions) {
  const handlers = {}
  actions.forEach(action => {
    switch (action.getLabel) {
      case 'Buscar archivo':
        handlers[action.getLabel] = () => navigate('/explorer')
        break
      case 'Subir archivo':
        handlers[action.getLabel] = () => navigate('/upload')
        break
      case 'Validar permisos':
        handlers[action.getLabel] = () => navigate('/')
        break
      default:
        break
    }
  })
  return handlers;
}

export function handleAction(actionName, handlers) {
  if (handlers[actionName]) {
    handlers[actionName]();
  }
}