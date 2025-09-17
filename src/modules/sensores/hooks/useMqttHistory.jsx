import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  connect,
  disconnect,
  onMessage,
  getStatus,
} from "../services/mqttClient";
import Plot from "react-plotly.js";
import { notify } from "../../../shared/components/Notify";

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
  "/Sacha53/VsdMotAmps": { name: "Im", unit: "amp", color: "#98FB98" },
  "/Sacha53/DHMotorTemp": {
    name: "Tm",
    unit: "°F",
    color: "#FF6347",
    lineStyle: "dotted",
  },
  "/Sacha53/DHDischargePressure": { name: "Pd", unit: "psi", color: "#708090" },
  "/Sacha53/DHIntakeTemp": { name: "Ti", unit: "°F", color: "#FFD700" },
  "/Sacha53/DHIntakePressure": { name: "Pi", unit: "psi", color: "#DC143C" },
  "/Sacha53/VSDTargetFreq": {
    name: "f",
    unit: "Hz",
    color: "#006400",
    lineStyle: "dotted",
  },
};
const MAX_DATA_POINTS = 2000;
const PADDING_PERCENT_MAX = 0.1;
const PADDING_PERCENT_MIN = 0.05;

function generateInitialTestData(topics, numPoints = 1000) {
  const initialData = {};
  const now = new Date();
  const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
  const timeInterval = SEVEN_DAYS_IN_MS / numPoints;

  topics.forEach((topic) => {
    const x = [];
    const y = [];
    for (let i = 0; i < numPoints; i++) {
      const timestamp = new Date(
        now.getTime() - (numPoints - i) * timeInterval
      );
      x.push(timestamp);

      let simulatedValue;
      const config = TOPIC_CONFIG[topic] || {};
      switch (config.unit) {
        case "PSI":
        case "psi":
          simulatedValue = 100 + Math.random() * 50; // Rango PSI
          break;
        case "amp":
          simulatedValue = 30 + Math.random() * 5; // Rango Amps
          break;
        case "°F":
          simulatedValue = 150 + Math.random() * 20; // Rango Temp
          break;
        case "Hz":
          simulatedValue = 60 + (Math.random() - 0.5) * 2; // Rango Freq
          break;
        default:
          simulatedValue = 50 + Math.random() * 10;
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
      .then((s) => setStatus(s))
      .catch((e) =>
        setStatus({
          isConnected: false,
          error: e?.msg || String(e),
          lastTriedUrl: e?.url,
        })
      );

    const off = onMessage((evt) => {
      // Si el componente ya no está montado, detiene la ejecución

      if (evt.isConnected === false) {
        setStatus((prev) => ({ ...prev, ...evt }));
      }

      if (evt.type === "message" && TOPICS.includes(evt.topic)) {
        setHistory((prevHistory) => {
          const newHistory = { ...prevHistory };
          // Obtiene el historial del tópico o lo inicializa si no existe.
          const topicHistory = newHistory[evt.topic];

          if (!topicHistory) {
            console.warn(
              "Tópico no encontrado, no se puede actualizar:",
              evt.topic
            );
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
    TOPICS.forEach((topic) => {
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

export function PressureChart({
  history,
  hiddenLines,
  toggleLineVisibility,
  onLegendDoubleClick,
}) {
  const { TOPIC_CONFIG } = useMqttHistory();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    setRevision((r) => r + 1);
  }, [history]);

  // Reemplaza el `traces = useMemo(...)` con esto:
  const traces = useMemo(() => {
    return TOPICS.map((topic) => {
      const config = TOPIC_CONFIG[topic];
      const topicHistory = history[topic];
      if (!config || !topicHistory) return null;

      let yaxis;
      switch (config.unit) {
        case "PSI":
        case "psi":
          yaxis = "y1";
          break;
        case "amp":
          yaxis = "y2";
          break;
        case "°F":
          yaxis = "y3";
          break;
        case "Hz":
          yaxis = "y4";
          break;
        default:
          yaxis = "y1";
      }

      const lineStyle = { color: config.color, width: 2 };
      if (config.lineStyle === "dotted") {
        lineStyle.dash = "dot";
      }

      return {
        x: topicHistory.x,
        y: topicHistory.y,
        name: config.name,
        topic: topic, // Clave para que los clics en la leyenda funcionen
        type: "scatter",
        mode: "lines",
        yaxis: `y${yaxis.replace("y", "")}`, // Asegura y1, y2, etc.
        line: lineStyle,
        hovertemplate: `<b>${config.name}:</b> %{y:.2f} ${config.unit}<br><b>Hora:</b> %{x|%H:%M:%S}<extra></extra>`,
        visible: hiddenLines[topic] ? "legendonly" : true,
      };
    }).filter(Boolean); // Filtra los nulos si un topic no tiene config/historial
  }, [history, hiddenLines]);
  // Reemplaza tu objeto `layout` con este:
  const layout = {
    datarevision: revision,
    autosize: true,
    paper_bgcolor: "#1e293b",
    plot_bgcolor: "#1e293b",
    font: { color: "#e0e0e0" },
    title: {
      text: "Monitoreo de Sensores en Tiempo Real",
      font: { size: 18, color: "#e0e0e0" },
    },
    margin: { l: 50, r: 20, b: 50, t: 80, pad: 4 },
    grid: {
      rows: 4,
      columns: 1,
      pattern: "independent",
    },
    xaxis: {
      domain: [0, 1],
      gridcolor: "#444444",
      type: "date",
      tickfont: { color: "#e0e0e0" },
    },
    yaxis: {
      // Presión (PSI)
      title: { text: "PSI", font: { size: 12 } },
      domain: [0.76, 1.0],
      gridcolor: "#444444",
      tickfont: { color: "#e0e0e0", size: 10 },
    },
    yaxis2: {
      // Amperaje (amp)
      title: { text: "amp", font: { size: 12 } },
      domain: [0.51, 0.75],
      gridcolor: "#444444",
      tickfont: { color: "#e0e0e0", size: 10 },
    },
    yaxis3: {
      // Temperatura (°F)
      title: { text: "°F", font: { size: 12 } },
      domain: [0.26, 0.5],
      gridcolor: "#444444",
      tickfont: { color: "#e0e0e0", size: 10 },
    },
    yaxis4: {
      // Frecuencia (Hz)
      title: { text: "Hz", font: { size: 12 } },
      domain: [0, 0.25],
      gridcolor: "#444444",
      tickfont: { color: "#e0e0e0", size: 10 },
    },
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: 1.02,
      xanchor: "right",
      x: 1,
      font: { color: "#e0e0e0" },
      itemclick: false,
      itemdoubleclick: false,
    },
  };
  const config = {
    displaylogo: false,
    responsive: true,
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
      config={config}
      onLegendClick={(event) => {
        const topic = event.data[event.curveNumber].topic;
        const isHidden = hiddenLines[topic];
        const action = isHidden ? "Mostrando" : "Ocultando";
        const name = TOPIC_CONFIG[topic]?.name || topic;

        notify("info", `${action} línea de ${name}`);
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
