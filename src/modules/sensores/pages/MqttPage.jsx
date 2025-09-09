import useMqttHistory from '../hooks/useMqttHistory';
import ConnectionBadge from '../components/ConnectionBadge';
import TopicCard from '../components/TopicCard';
import RealTimeChart from '../components/RealTimeChart';
import Spinner from '../components/Spinner';

/**
 * Página principal del Dashboard.
 * Se ha rediseñado para mostrar la gráfica principal y las tarjetas de estado
 * en una disposición de dashboard moderna y espaciosa.
 */
export default function MqttPage() {
  const { status, history, lastByTopic, topics } = useMqttHistory();
  
  // Verificamos si ya hemos recibido al menos un dato para mostrar la gráfica.
  const hasData = Object.values(history).some(h => h.x.length > 0);

  return (
    // 'container-fluid' ocupa todo el ancho para dar más espacio a la gráfica.
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 m-0">Dashboard MQTT en Tiempo Real</h1>
        <ConnectionBadge isConnected={status.isConnected} />
      </div>

      {!status.isConnected && status.error && (
        <div className="alert alert-danger">
          Error de conexión a <strong>{status.error.url || 'broker'}</strong>: {String(status.error.msg)}
        </div>
      )}

      <div className="row">
        {/* Columna principal para la gráfica, ocupa más espacio en pantallas grandes */}
        <div className="col-lg-9 mb-4">
          <div className="card h-100 shadow-sm" style={{ minHeight: '500px' }}>
            <div className="card-body d-flex flex-column">
              <RealTimeChart history={history} />
              {hasData ? (
                <RealTimeChart history={history} />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Spinner />
                  <span className="ms-3 text-muted">Esperando datos del broker...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna lateral para las tarjetas de estado */}
        <div className="col-lg-3">
          <div className="row">
            {topics.map(t => (
              <TopicCard key={t} topic={t} data={lastByTopic[t]} />
            ))}
          </div>
        </div>
      </div>

      {/* --- DEBUG VIEW --- */}
      {/* Este panel te ayudará a ver el estado interno en tiempo real. */}
      {/* Si 'lastByTopic' permanece vacío, confirma que los mensajes no se procesan. */}
      <div className="card mt-4">
        <div className="card-header">Debug Info</div>
        <div className="card-body bg-light">
          <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.8rem'}}>
            {JSON.stringify({ status, lastByTopic, hasData }, null, 2)}
          </pre>
        </div>
      </div>
      {/* --- END DEBUG VIEW --- */}

    </div>
  );
}

