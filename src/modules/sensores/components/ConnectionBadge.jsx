export default function ConnectionBadge({ isConnected }) {
  return <span className={`badge ${isConnected ? 'text-bg-success' : 'text-bg-danger'}`}>
    {isConnected ? 'Conectado' : 'Desconectado'}
  </span>;
}
