import React, { useState, useEffect, useMemo, useRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import { notify } from '../../../shared/components/Notify';

import "../styles/futuristic-datepicker.css";
import "../styles/custom-input.css";
import { useMqttHistory, PressureChart, FlowCountChart } from '../hooks/useMqttHistory';
import ConnectionBadge from '../components/ConnectionBadge';
import TopicCard from '../components/TopicCard';

// Registra el locale de español para DatePicker
registerLocale("es", es);

export default function MqttPage() {
  const { status, history, lastByTopic, topics, TOPIC_CONFIG } = useMqttHistory();
  const hasData = Object.values(history).some(h => h.x && h.x.length > 0);

  const [filterStart, setFilterStart] = useState(null);
  const [filterEnd, setFilterEnd] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hiddenLines, setHiddenLines] = useState({});

  // Estados para el debounce
  const [debouncedFilterStart, setDebouncedFilterStart] = useState(null);
  const [debouncedFilterEnd, setDebouncedFilterEnd] = useState(null);

  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);

  useEffect(() => {
    // Al cargar el componente, establece el filtro de inicio en hace una hora.
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    setFilterStart(oneHourAgo);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterStart(filterStart);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filterStart]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterEnd(filterEnd);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filterEnd]);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const formattedStart = debouncedFilterStart ? debouncedFilterStart.toLocaleString('es-ES') : 'el principio';
    if (debouncedFilterEnd) {
      const formattedEnd = debouncedFilterEnd.toLocaleString('es-ES');
      notify('info', `Mostrando datos desde ${formattedStart} hasta ${formattedEnd}`);
    } else {
      notify('info', `Mostrando datos desde ${formattedStart}`);
    }
  }, [debouncedFilterStart, debouncedFilterEnd]);

  const filteredHistory = useMemo(() => {
    if (!debouncedFilterStart && !debouncedFilterEnd) {
      return history;
    }

    const newFilteredHistory = {};
    for (const topic in history) {
      const filteredX = [];
      const filteredY = [];

      history[topic].x.forEach((date, index) => {
        const timestamp = date.getTime();
        const startTimestamp = debouncedFilterStart ? debouncedFilterStart.getTime() : -Infinity;
        const endTimestamp = debouncedFilterEnd ? debouncedFilterEnd.getTime() : Infinity;

        if (timestamp >= startTimestamp && timestamp <= endTimestamp) {
          filteredX.push(date);
          filteredY.push(history[topic].y[index]);
        }
      });
      newFilteredHistory[topic] = { x: filteredX, y: filteredY };
    }
    return newFilteredHistory;
  }, [history, debouncedFilterStart, debouncedFilterEnd]);

  const toggleLineVisibility = (topic) => {
    setHiddenLines(prev => {
      const isHidden = !prev[topic];
      const newState = { ...prev, [topic]: isHidden };

      return newState;
    });
  };

  const handleLegendDoubleClick = (event) => {
    const topic = event.data[event.curveNumber].topic;
    const name = TOPIC_CONFIG[topic]?.name || topic;
    const newHiddenLines = {};

    Object.keys(TOPIC_CONFIG).forEach(t => {
      if (t !== topic) {
        newHiddenLines[t] = true;
      }
    });
    
    setHiddenLines(newHiddenLines);
    notify('warn', `Mostrando solo la línea de ${name}`);
    
    return false;
  };

  return (
    <div className="container-fluid py-4 px-lg-4" style={{ backgroundColor: '#0f172a', color: '#e0e0e0', minHeight: '100vh' }}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

      <div className="d-flex align-items-center justify-content-between mb-4 pb-2" style={{ borderBottom: '1px solid #4a5568' }}>
        <h2 className="h4 m-0 fw-bold" style={{ color: '#00ffff' }}>Dashboard MQTT en Tiempo Real</h2>
        <ConnectionBadge isConnected={status.isConnected} />
      </div>

      {!status.isConnected && status.error && (
        <div className="alert alert-danger" style={{ backgroundColor: '#331f1f', color: '#ff6b6b', border: 'none' }}>
          Error de conexión a <strong>{status.error.url || 'broker'}</strong>: {String(status.error.msg)}
        </div>
      )}

      <div className="mb-4">
        <h5 className="mb-2" style={{ color: '#c0c0c0', fontSize: '1rem' }}>Filtrar por Rango de Tiempo</h5>
        <div className="d-flex flex-wrap gap-3">
          <div>
            <label className="form-label">Desde:</label>
            <div className="input-group">
                <DatePicker
                  ref={startDatePickerRef}
                  selected={filterStart}
                  onChange={(date) => setFilterStart(date)}
                  locale="es"
                  dateFormat="dd/MM/yyyy h:mm aa"
                  showTimeSelect
                  className="form-control futuristic-input"
                  placeholderText="dd/mm/yyyy hh:mm am/pm"
                />
                <span 
                    className="input-group-text" 
                    onClick={() => startDatePickerRef.current.setOpen(true)}
                    style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #4a5568',
                        borderLeft: 'none',
                        color: '#a0aec0',
                        cursor: 'pointer',
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0'
                    }}
                >
                    📅
                </span>
            </div>
          </div>
          <div>
            <label className="form-label">Hasta:</label>
            <div className="input-group">
                <DatePicker
                  ref={endDatePickerRef}
                  selected={filterEnd}
                  onChange={(date) => setFilterEnd(date)}
                  locale="es"
                  dateFormat="dd/MM/yyyy h:mm aa"
                  showTimeSelect
                  className="form-control futuristic-input"
                  placeholderText="dd/mm/yyyy hh:mm am/pm"
                />
                <span 
                    className="input-group-text" 
                    onClick={() => endDatePickerRef.current.setOpen(true)}
                    style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #4a5568',
                        borderLeft: 'none',
                        color: '#a0aec0',
                        cursor: 'pointer',
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0'
                    }}
                >
                    📅
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-9 mb-4">
          <div className="row h-100">
            <div className="col-12 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  minHeight: '300px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #4a5568',
                  boxShadow: '0 4px 6px -1-px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div className="card-body d-flex flex-column">
                  <PressureChart 
                    history={filteredHistory} 
                    hiddenLines={hiddenLines} 
                    toggleLineVisibility={toggleLineVisibility}
                    onLegendDoubleClick={handleLegendDoubleClick}
                  />
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