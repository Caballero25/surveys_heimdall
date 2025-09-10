import React, { useState, useEffect, useRef, useMemo } from "react";
import { connect, disconnect, onMessage, getStatus } from "../services/mqttClient";
import Plot from 'react-plotly.js';

// Configuración de los temas MQTT
const TOPICS = ["/Gae/PCasing/", "/Gae/PTubing/", "/Gae/FlowCount/"];
const TOPIC_CONFIG = {
  "/Gae/PCasing/": { name: "Presión Casing", color: "#1f77b4", unit: "PSI" },
  "/Gae/PTubing/": { name: "Presión Tubing", color: "#d62728", unit: "PSI" },
  "/Gae/FlowCount/": { name: "Flujo", color: "#2ca02c", unit: "PCD" },
};
const MAX_DATA_POINTS = 300;

function generateInitialTestData(topics, numPoints = 30) {
  const initialData = {};
  const now = new Date();

  topics.forEach(topic => {
    const x = [];
    const y = [];
    for (let i = 0; i < numPoints; i++) {
      const timestamp = new Date(now.getTime() - (numPoints - i) * 1000);
      x.push(timestamp);

      let simulatedValue;
      if (topic === "/Gae/PTubing/") {
        simulatedValue = 100 + (Math.random() - 0.5) * 10;
      } else if (topic === "/Gae/PCasing/") {
        simulatedValue = 150 + (Math.random() - 0.5) * 8;
      } else { // "/Gae/FlowCount/"
        simulatedValue = 23800 + (Math.random() - 0.5) * 5;
      }
      y.push(simulatedValue);
    }
    initialData[topic] = { x, y };
  });

  return initialData;
}

export function useMqttHistory() {
  const [status, setStatus] = useState(getStatus());
  
  // Inicializa el estado 'history' con los datos de prueba generados.
  const [history, setHistory] = useState(() => generateInitialTestData(TOPICS));  

  useEffect(() => {
    // Conecta al cliente MQTT cuando el componente se monta.
    connect()
      .then(s => setStatus(s))
      .catch(e => setStatus({ isConnected: false, error: e?.msg || String(e), lastTriedUrl: e?.url }));
    
    const off = onMessage(evt => {
      // Si el componente ya no está montado, detiene la ejecución 
      
      if (evt.isConnected === false) {
        setStatus(prev => ({ ...prev, ...evt }));
      }
      
      if (evt.type === "message" && TOPICS.includes(evt.topic)) {
        setHistory(prevHistory => {
          
          const newHistory = { ...prevHistory };
          // Obtiene el historial del tópico o lo inicializa si no existe.
          const topicHistory = newHistory[evt.topic];

          if (!topicHistory) {
            console.warn("Tópico no encontrado, no se puede actualizar:", evt.topic);
            return prevHistory;
          }
          
          const newX = [...topicHistory.x, new Date()];
          // Usa el valor del mensaje MQTT real
          const updatedY = [...topicHistory.y, parseFloat(evt.payload)]; 

          // Limita el historial a 300 puntos para optimizar el rendimiento
          if (newX.length > MAX_DATA_POINTS) {
            newX.shift();
            updatedY.shift();
          }
          newHistory[evt.topic] = { x: newX, y: updatedY };
          return newHistory;
        });
      }
    });

    // Función de limpieza al desmontar el componente.
    return () => { 
      off(); 
      disconnect();
    };
  }, []);

  // Memoriza los últimos valores de cada tópico para optimizar
  const lastByTopic = useMemo(() => {
    const lastValues = {};
    TOPICS.forEach(topic => {
      const topicHistory = history[topic];
      const lastIndex = topicHistory?.x?.length - 1;
      if (lastIndex >= 0) {
        lastValues[topic] = {
          payload: topicHistory.y[lastIndex],
          timestamp: topicHistory.x[lastIndex].getTime(),
        };
      }
    });
    return lastValues;
  }, [history]);

  // Retorna el estado y las variables para ser usadas por el componente de la página
  return { status, history, lastByTopic, topics: TOPICS, TOPIC_CONFIG };
} 
// Componente para la gráfica del Casing
export function CasingChart({ history }) {
  const [revision, setRevision] = useState(0);
  const casingHistory = history["/Gae/PCasing/"];

  useEffect(() => {
    setRevision(r => r + 1);
  }, [casingHistory?.x]); 

  const traces = [
    {
      x: casingHistory?.x,
      y: casingHistory?.y,
      name: TOPIC_CONFIG["/Gae/PCasing/"].name,
      type: 'scatter',
      mode: 'lines',
      line: { color: TOPIC_CONFIG["/Gae/PCasing/"].color, width: 2 },
    },
  ];

  const layout = {
    datarevision: revision,
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#ffffff', // Fondo de la gráfica blanco
    font: { color: '#000000' }, // Color del texto negro
    title: { text: 'Presión Casing en Tiempo Real', font: { size: 18, color: '#000000' } },
    margin: { l: 40, r: 20, b: 50, t: 80, pad: 4 }, // Márgenes más ajustados
    xaxis: { title: 'Tiempo', gridcolor: '#e6e6e6', type: 'date', tickfont: { color: '#555555' } },
    yaxis: { title: 'Presión (PSI)', gridcolor: '#e6e6e6', tickfont: { color: '#555555' } },
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={{ responsive: true }}
    />
  );
}

// Componente para la gráfica del Tubing
export function TubingChart({ history }) {
  const [revision, setRevision] = useState(0);
  const tubingHistory = history["/Gae/PTubing/"];
  
  useEffect(() => {
    setRevision(r => r + 1);
  }, [tubingHistory?.x]); 

  const traces = [
    {
      x: tubingHistory?.x,
      y: tubingHistory?.y,
      name: TOPIC_CONFIG["/Gae/PTubing/"].name,
      type: 'scatter',
      mode: 'lines',
      line: { color: TOPIC_CONFIG["/Gae/PTubing/"].color, width: 2 },
    },
  ];

  const layout = {
    datarevision: revision,
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#ffffff', // Fondo de la gráfica blanco
    font: { color: '#000000' }, // Color del texto negro
    title: { text: 'Presión Tubing en Tiempo Real', font: { size: 18, color: '#000000' } },
    margin: { l: 40, r: 20, b: 50, t: 80, pad: 4 }, // Márgenes más ajustados
    xaxis: { title: 'Tiempo', gridcolor: '#e6e6e6', type: 'date', tickfont: { color: '#555555' } },
    yaxis: { title: 'Presión (PSI)', gridcolor: '#e6e6e6', tickfont: { color: '#555555' } },
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={{ responsive: true }}
    />
  );
}

// Componente para la gráfica del Flujo
export function FlowCountChart({ history }) {
  const [revision, setRevision] = useState(0);
  const flowCountHistory = history["/Gae/FlowCount/"];
  
  useEffect(() => {
    setRevision(r => r + 1);
  }, [flowCountHistory?.x]); 

  const traces = [
    {
      x: flowCountHistory?.x,
      y: flowCountHistory?.y,
      name: TOPIC_CONFIG["/Gae/FlowCount/"].name,
      type: 'scatter',
      mode: 'lines',
      line: { color: TOPIC_CONFIG["/Gae/FlowCount/"].color, width: 2 },
    },
  ];

  const layout = {
    datarevision: revision,
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#ffffff', // Fondo de la gráfica blanco
    font: { color: '#000000' }, // Color del texto negro
    title: { text: 'Flujo en Tiempo Real', font: { size: 18, color: '#000000' } },
    margin: { l: 40, r: 20, b: 50, t: 80, pad: 4 }, // Márgenes más ajustados
    xaxis: { title: 'Tiempo', gridcolor: '#e6e6e6', type: 'date', tickfont: { color: '#555555' } },
    yaxis: { title: 'Flujo (PCD)', gridcolor: '#e6e6e6', tickfont: { color: '#555555' } },
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={{ responsive: true }}
    />
  );
}