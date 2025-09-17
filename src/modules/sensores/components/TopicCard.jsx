import { TOPIC_CONFIG } from '../services/mqttClient';

/**
 * Tarjeta de información mejorada.
 */
export default function TopicCard({ topic, data, style }) {
  const config = TOPIC_CONFIG[topic] || { name: topic, unit: '' };
  
  const payload = data?.payload != null ? Number(data.payload).toFixed(2) : '—';
  const unit = data?.payload != null ? config.unit : '';
  const ts = data?.timestamp ? new Date(data.timestamp).toLocaleString() : '—';

  return (
    <div className="col-6 mb-3">
      {/* Remove bg-light from this div */}
      <div className="card h-100 shadow-sm" style={style}>
        <div className="card-body">
          {/* Change text-muted to a lighter color for readability */}
          <h6 className="card-subtitle mb-0" style={{color: 'rgba(255, 255, 255, 0.5)'}}>{config.name}</h6>
          <h4 className="card-title">
            {payload} <small style={{color: 'rgba(255, 255, 255, 0.5)'}}>{unit}</small>
          </h4>
        </div>
        {/* Remove bg-white from this div */}
        <div className="card-footer border-0" style={style}>
          {/* Change text-muted to a lighter color for readability */}
          <small style={{color: 'rgba(255, 255, 255, 0.5)'}}>Actualizado: {ts}</small>
        </div>
      </div>
    </div>
  );
}