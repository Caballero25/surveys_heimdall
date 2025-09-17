export default function ConnectionBadge({ isConnected }) {
  return <span className={`badge ${isConnected ? 'text-bg-success' : 'text-bg-success'}`}>
    {isConnected ? 'Conectado' : 'Conectado'}
  </span>;
}
