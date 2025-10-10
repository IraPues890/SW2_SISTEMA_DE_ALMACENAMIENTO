function ServerStatus({ status }) {
  return (
    <section className="flex gap-6 mb-6 justify-between flex-wrap">
      {status.map(( stat ) => (
        <div key={stat.getLabel} className="bg-green-50 border-l-4 border-l-green-500 p-4 rounded-lg shadow-sm flex-1 min-w-[180px]">
          <span className="block text-gray-600 text-sm">{stat.getLabel}</span>
          <strong className="block mt-1 text-xl text-green-600 font-semibold">{stat.getValue}</strong>
        </div>
      ))}
    </section>
  );
}
export default ServerStatus;