import React, { useState, useEffect, useRef, useMemo } from "react";
import { connect, disconnect, onMessage, getStatus } from "../services/mqttClient";
import Plot from 'react-plotly.js';
import { notify } from '../../../shared/components/Notify';

// Configuración de los temas MQTT
const TOPICS = [
  "/Sacha53/Pcasing", 
  "/Sacha53/Ptubing", 
  "/Sacha53/VsdMotAmps", 
  "/Sacha53/DHMotorTemp",
  "/Sacha53/DHDischargePressure",
  "/Sacha53/DHIntakeTemp",
  "/Sacha53/DHIntakePressure", 
  "/Sacha53/VSDTargetFreq",
];
const TOPIC_CONFIG = {
  "/Sacha53/Pcasing": { name: "Presión Casing", color: "#00b2ff", unit: "PSI" },
  "/Sacha53/Ptubing": { name: "Presión Tubing", color: "#ff267e", unit: "PSI" },
};
const MAX_DATA_POINTS = 2000;
const PADDING_PERCENT_MAX = 0.10;
const PADDING_PERCENT_MIN = 0.05;

function generateInitialTestData(topics, numPoints = 1000) {
  const initialData = {};
  const now = new Date();
  const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
  const timeInterval = SEVEN_DAYS_IN_MS / numPoints;

  topics.forEach(topic => {
    const x = [];
    const y = [];
    for (let i = 0; i < numPoints; i++) {
      const timestamp = new Date(now.getTime() - (numPoints - i) * timeInterval);
      x.push(timestamp);

      let simulatedValue;
      if (topic === "/Sacha53/Ptubing") {
        // Valor ajustado para que Tubing esté entre 104 y 108 PSI
        simulatedValue = 104 + (Math.random() * 4);
      } else if (topic === "/Sacha53/Pcasing") {
        simulatedValue = 152 + (Math.random() * 4); 
      } else {
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

export function PressureChart({ history, hiddenLines, toggleLineVisibility, onLegendDoubleClick }) {
  const { TOPIC_CONFIG } = useMqttHistory();
  const [revision, setRevision] = useState(0);

  const casingHistory = history["/Sacha53/Pcasing"];
  const tubingHistory = history["/Sacha53/Ptubing"];

  const [yMin, yMax] = useMemo(() => {
    const casingData = casingHistory?.y || [];
    const tubingData = tubingHistory?.y || [];
    const allData = [...casingData, ...tubingData];
    if (allData.length === 0) return [0, 100];
    const currentYMin = Math.min(...allData);
    const currentYMax = Math.max(...allData);
    const calculatedYMin = currentYMin > 0 ? currentYMin * (1 - PADDING_PERCENT_MIN) : 0;
    const calculatedYMax = currentYMax * (1 + PADDING_PERCENT_MAX);
    return [calculatedYMin, calculatedYMax];
  }, [casingHistory, tubingHistory]);

  useEffect(() => {
    setRevision(r => r + 1);
  }, [casingHistory?.x, tubingHistory?.x]);

  const traces = useMemo(() => {
    const allTraces = [
      {
        x: casingHistory?.x,
        y: casingHistory?.y,
        name: TOPIC_CONFIG["/Sacha53/Pcasing"].name,
        topic: "/Sacha53/Pcasing",
        type: 'scatter',
        mode: 'lines',
        line: { color: TOPIC_CONFIG["/Sacha53/Pcasing"].color, width: 2 },
        // ❗ Actualización del hovertemplate
        hovertemplate: 
          "<b>Fecha:</b> %{x|%Y-%m-%d %H:%M:%S}<br>" +
          "<b>%{data.name}:</b> %{y:.2f} PSI<br>" +
          "<b>Nota:</b><extra></extra>",
      },
      {
        x: tubingHistory?.x,
        y: tubingHistory?.y,
        name: TOPIC_CONFIG["/Sacha53/Ptubing"].name,
        topic: "/Sacha53/Ptubing",
        type: 'scatter',
        mode: 'lines',
        line: { color: TOPIC_CONFIG["/Sacha53/Ptubing"].color, width: 2 },
        // ❗ Actualización del hovertemplate
        hovertemplate: 
          "<b>Fecha:</b> %{x|%Y-%m-%d %H:%M:%S}<br>" +
          "<b>%{data.name}:</b> %{y:.2f} PSI<br>" +
          "<b>Nota:</b><extra></extra>",
      },
    ];

    return allTraces.map(trace => ({
        ...trace,
        visible: hiddenLines[trace.topic] ? 'legendonly' : true
    }));
  }, [casingHistory, tubingHistory, hiddenLines]);

  const layout = {
    datarevision: revision,
    autosize: true,
    paper_bgcolor: "#1e293b",
    plot_bgcolor: "#1e293b",
    font: { color: '#e0e0e0' },
    title: { text: 'Presión Casing vs Tubing en Tiempo Real', font: { size: 18, color: '#e0e0e0' } },
    margin: { l: 40, r: 20, b: 50, t: 80, pad: 4 },
    xaxis: {
      title: 'Tiempo',
      gridcolor: '#444444',
      type: 'date',
      tickfont: { color: '#e0e0e0' }
    },
    yaxis: {
      title: 'Presión (PSI)',
      gridcolor: '#444444',
      tickfont: { color: '#e0e0e0' },
      nticks: 6,
      range: [yMin, yMax],
    },
    legend: {
      font: {
        color: '#e0e0e0'
      },
      itemclick: false,
      itemdoubleclick: false,
    },
    // ❗ Elimina la configuración del hoverlabel para usar el hovertemplate
  };

  const config = {
    displaylogo: false,
    responsive: true,
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={config}
      onLegendClick={(event) => {
        const topic = event.data[event.curveNumber].topic;
        const isHidden = hiddenLines[topic];
        const action = isHidden ? "Mostrando" : "Ocultando";
        const name = TOPIC_CONFIG[topic]?.name || topic;
        
        notify('info', `${action} línea de ${name}`);
        toggleLineVisibility(topic);
        
        return false;
      }}
      onLegendDoubleClick={(event) => {
        const topic = event.data[event.curveNumber].topic;
        onLegendDoubleClick(event);
        return false;
      }}
    />
  );
}

export function FlowCountChart({ history }) {
  const [revision, setRevision] = useState(0);
  const flowCountHistory = history["/Gae/FlowCount/"];

  const [yMin, yMax] = useMemo(() => {
    if (!flowCountHistory?.y || flowCountHistory.y.length === 0) return [0, 100];
    const currentYMin = Math.min(...flowCountHistory.y);
    const currentYMax = Math.max(...flowCountHistory.y);
    const calculatedYMin = currentYMin > 0 ? currentYMin * (1 - PADDING_PERCENT_MIN) : 0;
    const calculatedYMax = currentYMax > 0 ? currentYMax * (1 + PADDING_PERCENT_MAX) : 100;
    return [calculatedYMin, calculatedYMax];
  }, [flowCountHistory]);

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
    paper_bgcolor: "#1e293b",
      plot_bgcolor: "#1e293b",
    font: { color: '#e0e0e0' },
    title: { text: 'Flujo en Tiempo Real', font: { size: 18, color: '#e0e0e0' } },
    margin: { l: 40, r: 20, b: 50, t: 80, pad: 4 },
    xaxis: {
      title: 'Tiempo',
      gridcolor: '#444444',
      type: 'date',
      tickfont: { color: '#e0e0e0' }
    },
    yaxis: {
      title: 'Flujo (PCD)',
      gridcolor: '#444444',
      tickfont: { color: '#e0e0e0' },
      nticks: 6,
      range: [yMin, yMax],
    },
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