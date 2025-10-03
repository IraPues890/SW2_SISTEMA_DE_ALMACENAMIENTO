import './UserHeader.css';

function UserHeader({ administrator }) {
  return (
    <header className="identity_header">
      <div className="identity_info">
        <h2>{administrator.getName}</h2>
        <p>Puesto laboral: {administrator.getPosicion}</p>
        <span>Rol en el sistema: {administrator.getRole}</span>
      </div>
    </header>
  )
}
export default UserHeader;