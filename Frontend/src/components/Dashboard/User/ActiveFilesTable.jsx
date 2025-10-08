function ActiveFilesTable({ actives }) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-blue-600 mb-4">Archivos activos</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left p-3 text-gray-700 font-semibold border-b border-gray-200">Nombre</th>
              <th className="text-left p-3 text-gray-700 font-semibold border-b border-gray-200">Tamaño</th>
              <th className="text-left p-3 text-gray-700 font-semibold border-b border-gray-200">Último cambio</th>
            </tr>
          </thead>
          <tbody>
            {actives.map(( active ) => (
              <tr key={active.getName} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 border-b border-gray-100">{active.getName}</td>
                <td className="p-3 border-b border-gray-100">{active.getSize} GB</td>
                <td className="p-3 border-b border-gray-100">{active.getDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
export default ActiveFilesTable;