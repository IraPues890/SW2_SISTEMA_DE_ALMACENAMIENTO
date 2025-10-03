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
          {actives.map(({ name, size, date }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{size} GB</td>
              <td>{date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
export default ActiveUserTable;