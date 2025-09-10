import React, { useState, useEffect } from "react";
import { useMqttHistory, PressureChart, FlowCountChart } from '../hooks/useMqttHistory';
import ConnectionBadge from '../components/ConnectionBadge';
import TopicCard from '../components/TopicCard';
import Spinner from '../components/Spinner';

export default function MqttPage() {
  const { status, history, lastByTopic, topics, TOPIC_CONFIG } = useMqttHistory();
  const hasData = Object.values(history).some(h => h.x && h.x.length > 0);

  // If there's no data yet, show a loading spinner
  // if (!hasData) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
  //       <Spinner />
  //       <span className="ms-3 text-muted">Conectando y esperando datos...</span>
  //     </div>
  //   );
  // }

  // If data is available, render the full dashboard
  return (
    <div className="container-fluid py-4 px-lg-4" style={{ backgroundColor: '#0f172a', color: '#e0e0e0', minHeight: '100vh' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 m-0">Dashboard MQTT en Tiempo Real</h1>
        <ConnectionBadge isConnected={status.isConnected} />
      </div>

      {!status.isConnected && status.error && (
        <div className="alert alert-danger" style={{ backgroundColor: '#331f1f', color: '#ff6b6b', border: 'none' }}>
          Error de conexión a <strong>{status.error.url || 'broker'}</strong>: {String(status.error.msg)}
        </div>
      )}

      <div className="row">
        <div className="col-lg-9 mb-4">
          <div className="row h-100">
            <div className="col-12 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  minHeight: '300px',
                  backgroundColor: '#1e293b', // Fondo oscuro para la tarjeta
                  border: '1px solid #4a5568', // Borde gris claro
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' // Sombra para el efecto
                }}
              >
                <div className="card-body d-flex flex-column">
                  <PressureChart history={history} />
                </div>
              </div>
            </div>
            <div className="col-12 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  minHeight: '300px',
                  backgroundColor: '#1e293b', // Fondo oscuro para la tarjeta
                  border: '1px solid #4a5568', // Borde gris claro
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div className="card-body d-flex flex-column">
                  <FlowCountChart history={history} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="row">
            {topics.map(t => {
              const data = lastByTopic[t];
              return <TopicCard key={t} topic={t} data={data} style={{ backgroundColor: '#1e293b', color: '#e0e0e0', border: 'none' }} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}