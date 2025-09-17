import { Client, Message } from "paho-mqtt";

const HOST = "34.30.17.212";
const PORT = 8081;
// Prueba estos paths comunes; puedes agregar más si sabes otro:
const PATHS = ["/mqtt", "/mqtt/", "/ws", "/ws/", "/"];

// Tus topics
export const TOPICS = [
  "/Sacha53/Pcasing", 
  "/Sacha53/Ptubing", 
  "/Sacha53/VsdMotAmps", 
  "/Sacha53/DHMotorTemp",
  "/Sacha53/DHDischargePressure",
  "/Sacha53/DHIntakeTemp",
  "/Sacha53/DHIntakePressure", 
  "/Sacha53/VSDTargetFreq",
];
const QOS = 0;

/**
 * Nueva configuración centralizada para los topics.
 * Esto nos permite tener nombres amigables, unidades y colores
 * en un solo lugar, haciendo el código más limpio y fácil de mantener.
 */
export const TOPIC_CONFIG = {
  "/Sacha53/Pcasing": {
    name: "Presión Casing",
    unit: "PSI",
    color: "#1f77b4" // Azul profesional
  },
  "/Sacha53/Ptubing": {
    name: "Presión Tubing",
    unit: "PSI",
    color: "#ff7f0e" // Naranja vibrante
  },
  "/Sacha53/VsdMotAmps": {
    name: "Im",
    unit: "amp",
    color: "#98FB98" // Verde claro (PaleGreen)
  },
  "/Sacha53/DHMotorTemp": {
    name: "Tm",
    unit: "°F",
    color: "#FF6347", // Tomate
    lineStyle: 'dotted'
  },
  "/Sacha53/DHDischargePressure": {
    name: "Pd",
    unit: "psi",
    color: "#708090" // Plomo (SlateGray)
  },
  "/Sacha53/DHIntakeTemp": {
    name: "Ti",
    unit: "°F",
    color: "#FFD700" // Amarillo (Gold)
  },
  "/Sacha53/DHIntakePressure": {
    name: "Pi",
    unit: "psi",
    color: "#DC143C" // Rojo (Crimson)
  },
  "/Sacha53/VSDTargetFreq": {
    name: "f",
    unit: "Hz",
    color: "#006400", // Verde oscuro
    lineStyle: 'dotted'
  }
};


let client = null;
let isConnected = false;
const listeners = new Set();
let lastError = null;
let lastTriedUrl = null;

function emit(e) { listeners.forEach(cb => { try{ cb(e); } catch(_){} }); }
export function onMessage(cb){ listeners.add(cb); return () => listeners.delete(cb); }
export function getStatus(){ return { isConnected, clientId: client?.clientId, lastError, lastTriedUrl }; }

function tryConnect(idx, resolve, reject){
  const path = PATHS[idx];
  const clientId = `react_dashboard_${Date.now()}`;
  client = new Client(HOST, Number(PORT), path, clientId);

  lastTriedUrl = `ws://${HOST}:${PORT}${path}`;

  client.onConnectionLost = (r) => {
    console.log("Conexión Perdida")
    isConnected = false;
    emit({ type: "status", isConnected, reason: r?.errorMessage || "lost" });
  };
  client.onMessageArrived = (m) => {
    console.log(m)
    emit({ type: "message", topic: m.destinationName, payload: m.payloadString, timestamp: Date.now() });
  };

  client.connect({
    timeout: 6,
    keepAliveInterval: 30,
    cleanSession: true,
    reconnect: true,
    mqttVersion: 4,
    onSuccess: () => {
      isConnected = true;
      TOPICS.forEach(t => client.subscribe(t, { qos: QOS }));
      emit({ type: "status", isConnected, url: lastTriedUrl });
      resolve(getStatus());
    },
    onFailure: (err) => {
      lastError = { url: lastTriedUrl, code: err?.errorCode, msg: err?.errorMessage };
      if (idx + 1 < PATHS.length) return tryConnect(idx + 1, resolve, reject);
      isConnected = false;
      emit({ type: "status", isConnected, error: lastError });
      reject(lastError);
    },
  });
}

export function connect(){
  if (client && isConnected) return Promise.resolve(getStatus());
  return new Promise((resolve, reject) => tryConnect(0, resolve, reject));
}

export function disconnect(){
  if (client && isConnected){
    client.disconnect();
    isConnected = false;
    emit({ type: "status", isConnected });
  }
}

export function publish(topic, payload){
  if (!client || !isConnected) return;
  const msg = new Message(typeof payload === "string" ? payload : JSON.stringify(payload));
  msg.destinationName = topic;
  msg.qos = QOS;
  client.send(msg);
}
