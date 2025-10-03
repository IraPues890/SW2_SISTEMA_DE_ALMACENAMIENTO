import './ServersStatus.css';

function ServerStatus({ status }) {
  return (
    <section className='global_metrics'>
      {status.map(({ label, value }) => (
        <div className='metric' key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}
export default ServerStatus;