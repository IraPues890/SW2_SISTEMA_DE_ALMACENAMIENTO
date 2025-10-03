import './ActiveUserTable.css';

function ActiveUserTable({ actives }) {
  return (
    <section className="active_user">
      <h3>Usuario activos</h3>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Espacio usado</th>
            <th>Última actividad</th>
          </tr>
        </thead>
        <tbody>
          {actives.map(( active ) => (
            <tr key={active.getName}>
              <td>{active.getName}</td>
              <td>{active.getSize} GB</td>
              <td>{active.getDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
export default ActiveUserTable;