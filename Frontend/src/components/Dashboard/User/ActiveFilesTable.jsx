import './ActiveFilesTable.css';

function ActiveFilesTable({ actives }) {
  return (
    <section className="active_files">
      <h3>Archivos activos</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tamaño</th>
            <th>Ultimo cambio</th>
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
export default ActiveFilesTable;