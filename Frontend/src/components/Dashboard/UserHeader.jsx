function UserHeader({ administrator }) {
  return (
    <header className="border-b-2 border-gray-200 pb-4 mb-6">
      <div>
        <h2 className="text-3xl font-bold text-blue-600 mb-2">{administrator.getName}</h2>
        <p className="text-gray-600 text-base mb-1">Puesto laboral: {administrator.getPosicion}</p>
        <span className="text-gray-600 text-base">Rol en el sistema: {administrator.getRole}</span>
      </div>
    </header>
  )
}
export default UserHeader;