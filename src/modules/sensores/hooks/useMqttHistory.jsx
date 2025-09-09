import { useEffect, useRef, useState, useMemo } from "react";
import { connect, disconnect, onMessage, getStatus, TOPICS } from "../services/mqttClient";

// Número máximo de puntos de datos a mantener en la gráfica para evitar sobrecargar la memoria.
// Aprox. 5 minutos de datos si recibes un mensaje por segundo.
const MAX_DATA_POINTS = 300;

/**
 * Hook personalizado para manejar la conexión MQTT y almacenar un historial
 * de los mensajes recibidos, optimizado para la graficación.
 */
export default function useMqttHistory() {
  const [status, setStatus] = useState(getStatus());
  const [history, setHistory] = useState(() => {
    // Inicializamos el estado del historial con un objeto vacío para cada topic.
    const initial = {};
    TOPICS.forEach(topic => {
      initial[topic] = { x: [], y: [] };
    });
    return initial;
  });

  const alive = useRef(true);

  useEffect(() => {
    connect().then(s => setStatus(s)).catch(e => setStatus({ isConnected: false, error: e?.msg || String(e), lastTriedUrl: e?.url }));
    
    const off = onMessage(evt => {
      if (!alive.current) return;
      if (evt.type === "status") {
        setStatus(prev => ({ ...prev, ...evt }));
      }
      if (evt.type === "message" && TOPICS.includes(evt.topic)) {
        setHistory(prevHistory => {
          const newHistory = { ...prevHistory };
          const topicHistory = newHistory[evt.topic];
          
          const newX = [...topicHistory.x, new Date(evt.timestamp)];
          // Es crucial convertir el payload a número para que la gráfica funcione.
          const newY = [...topicHistory.y, parseFloat(evt.payload)];

          // Mantenemos el tamaño del arreglo bajo control para un rendimiento óptimo.
          if (newX.length > MAX_DATA_POINTS) {
            newX.shift(); // Elimina el punto de dato más antiguo.
            newY.shift();
          }

          newHistory[evt.topic] = { x: newX, y: newY };
          return newHistory;
        });
      }
    });

    return () => {
      alive.current = false;
      off();
      disconnect();
    };
  }, []);

  // Usamos useMemo para calcular los últimos valores solo cuando el historial cambia.
  // Esto es más eficiente que recalcularlo en cada render.
  const lastByTopic = useMemo(() => {
    const lastValues = {};
    TOPICS.forEach(topic => {
      const topicHistory = history[topic];
      const lastIndex = topicHistory.x.length - 1;
      if (lastIndex >= 0) {
        lastValues[topic] = {
          payload: topicHistory.y[lastIndex],
          timestamp: topicHistory.x[lastIndex].getTime(),
        };
      }
    });
    return lastValues;
  }, [history]);

  return { status, history, lastByTopic, topics: TOPICS };
}
