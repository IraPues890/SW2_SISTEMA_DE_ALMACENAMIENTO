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
export default ActiveFilesTable;