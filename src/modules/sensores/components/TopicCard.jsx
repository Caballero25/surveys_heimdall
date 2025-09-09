import { TOPIC_CONFIG } from '../services/mqttClient';

/**
 * Tarjeta de información mejorada.
 * Ahora muestra el nombre amigable del topic, la unidad, y formatea el valor.
 */
export default function TopicCard({ topic, data }) {
  // Obtenemos la configuración (nombre, unidad) desde el archivo central.
  const config = TOPIC_CONFIG[topic] || { name: topic, unit: '' };
  
  // Formateamos el payload para que se vea mejor.
  const payload = data?.payload != null ? Number(data.payload).toFixed(2) : '—';
  const unit = data?.payload != null ? config.unit : '';
  const ts = data?.timestamp ? new Date(data.timestamp).toLocaleString() : '—';

  return (
    <div className="col-12 mb-3">
      <div className="card h-100 shadow-sm bg-light">
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">{config.name}</h6>
          <h4 className="card-title">
            {payload} <small className="text-muted">{unit}</small>
          </h4>
        </div>
        <div className="card-footer bg-white border-0">
          <small className="text-muted">Actualizado: {ts}</small>
        </div>
      </div>
    </div>
  );
}
