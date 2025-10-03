import './ServersStatus.css';

function ServerStatus({ status }) {
  return (
    <section className='global_metrics'>
      {status.map(( stat ) => (
        <div className='metric' key={stat.getLabel}>
          <span>{stat.getLabel}</span>
          <strong>{stat.getValue}</strong>
        </div>
      ))}
    </section>
  );
}
export default ServerStatus;