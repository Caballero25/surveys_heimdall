import { useEffect, useRef, useState } from "react";
import { connect, disconnect, onMessage, getStatus, TOPICS } from "../services/mqttClient";

export default function useMqtt(){
  const [status, setStatus] = useState(getStatus());
  const [lastByTopic, setLast] = useState({});
  const alive = useRef(true);

  useEffect(() => {
    connect().then(s => setStatus(s)).catch(e => setStatus({ isConnected: false, error: e?.msg || String(e), lastTriedUrl: e?.url }));
    const off = onMessage(evt => {
      if (!alive.current) return;
      if (evt.type === "status") setStatus(prev => ({ ...prev, ...evt }));
      if (evt.type === "message" && TOPICS.includes(evt.topic)) {
        console.log("here")
        setLast(p => ({ ...p, [evt.topic]: { payload: evt.payload, timestamp: evt.timestamp } }));
      }
    });
    return () => { alive.current = false; off(); disconnect(); };
  }, []);

  return { status, lastByTopic, topics: TOPICS };
}
